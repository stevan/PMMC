
import { Types } from './Types';

export namespace Sinks {

    export class Console implements Types.Sink<Types.OutputToken> {

        async flow (source : Types.Stream<Types.OutputToken>) : Promise<void> {
            for await (const output of source) {
                console.log(output.fh, ...output.args.map((arg) => arg.toNative()));
            }
        }
    }

}
