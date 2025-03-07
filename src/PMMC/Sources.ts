
import * as readline from 'readline';

import { Types } from './Types';

export namespace Sources {

    export class FromString implements Types.Source<Types.SourceCode> {
        private $source : Types.SourceCode;

        constructor (src : Types.SourceCode) {
            this.$source = src;
        }

        async *flow () : Types.Stream<Types.SourceCode> {
            yield this.$source;
        }
    }

    export class FromArray implements Types.Source<Types.SourceCode> {
        private $array : Types.SourceCode[]

        constructor (array : Types.SourceCode[]) {
            this.$array = array;
        }

        async *flow () : Types.Stream<Types.SourceCode> {
            for (const source of this.$array) {
                yield source;
            }
        }
    }

    export class REPL implements Types.Source<Types.SourceCode> {
        private $readline : readline.ReadLine;
        private $running  : boolean;

        constructor () {
            this.$running  = false;
            this.$readline = readline.createInterface({
                input  : process.stdin,
                output : process.stdout
            });
        }

        async *flow () : Types.Stream<Types.SourceCode> {
            this.$running = true;
            while (this.$running) {
                yield new Promise<Types.SourceCode>((resolve) => {
                    this.$readline.question('? ', (answer : string) => {
                        if (answer == ':q') {
                            this.$running = false;
                            answer = '';
                        }
                        resolve(answer as Types.SourceCode);
                    });
                })
            }
            this.$readline.close();
        }
    }

}
