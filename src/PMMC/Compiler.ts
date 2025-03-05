
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
        let addr_sequence = 0;
        let flow = this.$parsed.flow();
        for await (const parsed of flow) {
            yield {
                type   : 'TODO',
                addr   : ++addr_sequence,
                parsed : parsed
            };
        }
    }
 }
