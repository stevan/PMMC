
import { Types } from './Types';

export namespace Tapes {

    export class CompiledTape implements Types.Tape<Types.Compiled> {
        public index    : number     = 0;
        public compiled : Types.Compiled[] = [];

        load (t : Types.Compiled) : void {
            this.compiled.push(t);
        }

        async *flow () : Types.Stream<Types.Compiled> {
            while (this.index < this.compiled.length) {
                let ct = this.compiled[ this.index++ ] as Types.Compiled;
                yield ct;
            }
            this.index = 0;
        }
    }


}
