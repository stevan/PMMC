
import { Types }      from './Types';
import { Dictionary } from './Dictionary';

export class Compiler implements Types.Flow<Types.CompiledStream> {
    private $parsed  : Types.Flow<Types.ParsedStream>;
    private $catalog : Dictionary.Catalog;

    constructor (catalog : Dictionary.Catalog, parsed : Types.Flow<Types.ParsedStream>) {
        this.$parsed  = parsed;
        this.$catalog = catalog;
        if (this.$catalog) {
            ;
        }
    }

    async *flow () : Types.CompiledStream {
        let addr_sequence = 0;
        let flow = this.$parsed.flow();
        for await (const parsed of flow) {
            switch (parsed.type) {
            case 'CALL':
                yield { addr : ++addr_sequence, type : 'EXECUTE', parsed : parsed };
                break;
            case 'CONST':
                yield { addr : ++addr_sequence, type : 'PUSH', parsed : parsed };
                break;
            default:
                yield { addr : ++addr_sequence, type : 'TODO', parsed : parsed }
            }
        }
    }
 }
