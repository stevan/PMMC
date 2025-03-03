
import { Types }      from './Types';
import { Dictionary } from './Dictionary';

export class Compiler implements Types.Flow<Types.CompiledStream> {
    private $parsed  : Types.Flow<Types.ParsedStream>;
    private $catalog : Dictionary.Catalog;

    constructor (catalog : Dictionary.Catalog, parsed : Types.Flow<Types.ParsedStream>) {
        this.$parsed  = parsed;
        this.$catalog = catalog;
    }

    getCatalog () : Dictionary.Catalog { return this.$catalog }

    async *flow () : Types.CompiledStream {
        let flow = this.$parsed.flow();
        for await (const parsed of flow) {
            switch (parsed.type) {
            case Types.ParsedType.MOD_BEGIN:
                let mod_name = await flow.next();
                if (mod_name.done)
                    throw new Error("Unexpected end of parsed stream, expected module name");
                this.$catalog.createVolume(mod_name.value.token.source);
                break;
            case Types.ParsedType.MOD_END:
                this.$catalog.exitCurrentVolume();
                break;
            case Types.ParsedType.WORD_BEGIN:
                let word_name = await flow.next();
                if (word_name.done)
                    throw new Error("Unexpected end of parsed stream, expected word name");
                this.$catalog.currentVolume().createUserWord(word_name.value.token.source);
                break;
            case Types.ParsedType.WORD_END:
                this.$catalog.currentVolume().exitCurrentWord();
                break;
            case Types.ParsedType.KEYWORD:
            case Types.ParsedType.CALL:
            case Types.ParsedType.LITERAL:
                let type : string = parsed.type as string;
                let compiled = { type : type as Types.CompiledType, parsed : parsed }
                if (this.$catalog.currentVolume().hasCurrentWord()) {
                    this.$catalog.currentVolume().currentWord().body.push(compiled);
                }
                else {
                    yield compiled;
                }
                break;
            default:
                throw new Error(`Unrecognized parsed type ${parsed.type}`)
            }
        }
    }
}
