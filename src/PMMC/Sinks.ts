
import { Types } from './Types';

export namespace Sinks {

    export class Console {
        private $source : Types.Flow<Types.OutputToken>;

        constructor (source : Types.Flow<Types.OutputToken>) {
            this.$source = source;
        }

        async run () : Promise<Types.Flow<Types.OutputToken>> {
            for await (const output of this.$source.flow()) {
                console.log(output.fh, ...output.args.map((arg) => arg.toNative()));
            }
            return this.$source;
        }
    }

}
