
import * as readline from 'readline';
import * as fs       from 'fs';

import { Types } from './Types';

export namespace Sources {

    export class FromSources implements Types.Source<Types.SourceCode> {
        private $sources : Types.Source<Types.SourceCode>[];

        constructor (sources : Types.Source<Types.SourceCode>[]) {
            this.$sources = sources;
        }

        async *flow () : Types.Stream<Types.SourceCode> {
            for (const source of this.$sources) {
                yield* source.flow();
            }
        }
    }

    export class FromFile implements Types.Source<Types.SourceCode> {
        private $path : string;

        constructor (path : string) {
            this.$path = path;
        }

        async *flow () : Types.Stream<Types.SourceCode> {
            yield new Promise<Types.SourceCode>((resolve) => {
                fs.readFile(this.$path, 'utf8', (err, data) => {
                    if (err) throw new Error(`Got error ${err}`);
                    resolve(data);
                });
            })
        }
    }

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
