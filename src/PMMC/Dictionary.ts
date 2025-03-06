
import { Types }    from './Types';
import { Tapes }    from './Tapes';
import { Literals } from './Literals';

export namespace Dictionary {

    export type UserWordBody   = Tapes.CompiledTape;
    export type NativeWordBody = (runtime : Types.Runtime) => void;

    export type UserWord   = { type : 'USER',   name : string, body : UserWordBody }
    export type NativeWord = { type : 'NATIVE', name : string, body : NativeWordBody }

    export type Word = UserWord | NativeWord;

    export class Catalog {
        public shelf : Map<string, Volume>;
        public stack : Volume[];

        constructor () {
            this.shelf = new Map<string, Volume>();
            this.stack = new Array<Volume>();
        }

        addVolume (vol : Volume) : void { this.shelf.set(vol.name, vol) }

        createVolume (name : string) : Volume {
            //console.log('creating volume', name);
            let dict = new Volume(name);
            this.shelf.set(name, dict);
            this.stack.unshift(dict);
            return dict;
        }

        currentVolume     () : Volume { return this.stack[0] as Volume }
        exitCurrentVolume () : void {
            //console.log('exiting volume', this.stack[0]);
            this.stack.shift();
        }

        lookup (wordRef : Literals.WordRef) : Word | undefined {
            // XXX - this could be much better
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

        createUserWord (name : string) : UserWord {
            //console.log('creating word', name);
            let userWord = {
                type : 'USER',
                name : name,
                body : new Tapes.CompiledTape()
            } as UserWord;
            this.entries.set(name, userWord);
            this.current = userWord;
            return userWord;
        }

        hasCurrentWord  () : boolean { return !! this.current }
        currentWord     () : UserWord { return this.current as UserWord }
        exitCurrentWord () : void {
            //console.log('exiting word', this.current);
            this.current = undefined
        }

        bind (e : NativeWord) : void {
            this.entries.set(e.name, e);
        }

        lookup (wordRef : Literals.WordRef) : Word | undefined {
            return this.entries.get(wordRef.name);
        }
    }

}
