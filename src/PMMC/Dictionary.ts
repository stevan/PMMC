
import { Types } from './Types';

export namespace Dictionary {

    export type UserWordBody   = Types.Tape<Types.Compiled>;
    export type NativeWordBody = (runtime : Types.Runtime) => void;

    export type UserWord   = { type : 'USER',   name : string, body : UserWordBody }
    export type NativeWord = { type : 'NATIVE', name : string, body : NativeWordBody }

    export type Word = UserWord | NativeWord;

    export type WordRef = { name : string };

    export class Catalog {
        public shelf : Map<string, Volume>;
        public stack : Volume[];

        constructor () {
            this.shelf = new Map<string, Volume>();
            this.stack = new Array<Volume>();
        }

        addVolume (vol : Volume) : void { this.shelf.set(vol.name, vol) }

        createVolume (name : string) : Volume {
            let dict = new Volume(name);
            this.shelf.set(name, dict);
            this.stack.unshift(dict);
            return dict;
        }

        currentVolume     () : Volume { return this.stack[0] as Volume }
        exitCurrentVolume () : void { this.stack.shift() }

        lookup (wordRef : WordRef | string) : Word | undefined {
            for (const dict of this.shelf.values()) {
                let word = dict.lookup(wordRef);
                if (word)
                    return word as Word;
            }
            return undefined;
        }
    }

    export class Volume {
        public name     : string;
        public entries  : Map<string, Word>;
        public current? : UserWord | undefined;

        constructor (name : string) {
            this.name    = name;
            this.entries = new Map<string, Word>();
        }

        createUserWord (name : string, body : Types.Tape<Types.Compiled>) : UserWord {
            let userWord = {
                type : 'USER',
                name : name,
                body : body
            } as UserWord;
            this.entries.set(name, userWord);
            this.current = userWord;
            return userWord;
        }

        hasCurrentWord  () : boolean { return !! this.current }
        currentWord     () : UserWord { return this.current as UserWord }
        exitCurrentWord () : void { this.current = undefined }

        bind (e : NativeWord) : void {
            this.entries.set(e.name, e);
        }

        lookup (wordRef : WordRef | string) : Word | undefined {
            let name : string = typeof wordRef === 'string' ? wordRef : wordRef.name;
            return this.entries.get(name);
        }
    }

}
