
import { Types } from './Types';

export namespace Sinks {

    export class Console implements Types.Sink<Types.OutputToken> {
        public showLog : boolean;

        constructor (showLog : boolean = false) {
            this.showLog = showLog;
        }

        async flow (source : Types.Stream<Types.OutputToken>) : Promise<void> {
            for await (const output of source) {
                if (output.fh == Types.OutputHandle.STDOUT) {
                    console.log(output.args.map((arg) => arg.toStr()).join(''));
                }
                else {
                    if (this.showLog)
                        console.warn(output.fh, ...output.args.map((arg) => arg.toNative()));
                }
            }
        }
    }

}
