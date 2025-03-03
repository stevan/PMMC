
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

    async getIdentifier (stream : Types.ParsedStream) : Promise<Types.Parsed> {
        return stream.next().then((ident) => {
            if (ident.done)
                throw new Error("Unexpected end of source, expect identifier");
            return ident.value;
        })
    }

    async *flow () : Types.CompiledStream {
        let flow = this.$parsed.flow();
        for await (const parsed of flow) {
            switch (parsed.type) {
            case Types.ParsedType.IMPORT:
                let import_name = await this.getIdentifier(flow);
                console.log("TODO", import_name);
                break;
            case Types.ParsedType.MOD_BEGIN:
                let mod_name = await this.getIdentifier(flow);
                this.$catalog.createVolume(mod_name.token.source);
                break;
            case Types.ParsedType.WORD_BEGIN:
                let word_name = await this.getIdentifier(flow);
                this.$catalog.currentVolume().createUserWord(word_name.token.source);
                break;
            case Types.ParsedType.MOD_END:
                this.$catalog.exitCurrentVolume();
                break;
            case Types.ParsedType.WORD_END:
                this.$catalog.currentVolume().exitCurrentWord();
                break;
            case Types.ParsedType.KEYWORD:
            case Types.ParsedType.CALL:
            case Types.ParsedType.LITERAL:
                let type : string = parsed.type as string;
                let compiled = { type : type as Types.CompiledType, parsed : parsed };
                if (this.$catalog.currentVolume().hasCurrentWord()) {
                    this.$catalog.currentVolume().currentWord().body.load(compiled);
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
