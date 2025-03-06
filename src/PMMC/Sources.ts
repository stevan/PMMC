
import * as readline from 'readline';

import { Types } from './Types';

export namespace Sources {

    export class FromArray implements Types.Flow<Types.Source> {
        private $array : Types.Source[]

        constructor (array : Types.Source[]) {
            this.$array = array;
        }

        async *flow () : Types.Stream<Types.Source> {
            for (const source of this.$array) {
                yield source;
            }
        }
    }

    export class REPL implements Types.Flow<Types.Source> {
        private $readline : readline.ReadLine;
        private $running  : boolean;

        constructor () {
            this.$running  = false;
            this.$readline = readline.createInterface({
                input  : process.stdin,
                output : process.stdout
            });
        }

        async *flow () : Types.Stream<Types.Source> {
            this.$running = true;
            while (this.$running) {
                yield new Promise<Types.Source>((resolve) => {
                    this.$readline.question('? ', (answer : string) => {
                        if (answer == ':q') {
                            this.$running = false;
                            answer = '';
                        }
                        resolve(answer as Types.Source);
                    });
                })
            }
            this.$readline.close();
        }
    }

}
