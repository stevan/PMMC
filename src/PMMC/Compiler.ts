
import { Types }      from './Types';
import { Dictionary } from './Dictionary';

export class Compiler implements Types.Flow<Types.Compiled> {
    private $parsed  : Types.Flow<Types.Parsed>;
    private $catalog : Dictionary.Catalog;

    constructor (catalog : Dictionary.Catalog, parsed : Types.Flow<Types.Parsed>) {
        this.$parsed  = parsed;
        this.$catalog = catalog;
        this.$catalog.createVolume('_');
    }

    async *flow () : Types.Stream<Types.Compiled> {
        let addr_sequence = 0;
        let flow = this.$parsed.flow();
        for await (const parsed of flow) {
            switch (parsed.type) {
            case 'WORD_BEGIN':
                this.$catalog.currentVolume().createUserWord(parsed.ident.token.source);
                break;
            case 'WORD_END':
                this.$catalog.currentVolume().exitCurrentWord();
                break;
            case 'CALL':
                let exec = { addr : ++addr_sequence, type : 'EXECUTE', parsed : parsed } as Types.Compiled;
                if (this.$catalog.currentVolume().hasCurrentWord()) {
                    this.$catalog.currentVolume().currentWord().body.load(exec);
                } else {
                    yield exec;
                }
                break;
            case 'CONST':
                let constant = { addr : ++addr_sequence, type : 'PUSH', parsed : parsed } as Types.Compiled;
                if (this.$catalog.currentVolume().hasCurrentWord()) {
                    this.$catalog.currentVolume().currentWord().body.load(constant);
                } else {
                    yield constant;
                }
                break;
            default:
                yield { addr : ++addr_sequence, type : 'TODO', parsed : parsed }
            }
        }
    }
 }
