
import { Types } from './Types';

export namespace Dictionary {

    export type UserWordBody   = Types.Tape<Types.Compiled>;
    export type NativeWordBody = (runtime : Types.Runtime) => void;

    export type UserWord   = { type : 'USER',   name : string, body : UserWordBody }
    export type NativeWord = { type : 'NATIVE', name : string, body : NativeWordBody }

    export type Word = UserWord | NativeWord;

    export class Catalog {
        public shelf   : Map<string, Volume>;
        public stack   : Volume[];
        public imports : Volume[];

        constructor () {
            this.shelf   = new Map<string, Volume>();
            this.stack   = new Array<Volume>();
            this.imports = new Array<Volume>();
        }

        importVolume (name : string) : void {
            let vol = this.shelf.get(name);
            if (!vol)
                throw new Error(`Unable to find module(${name}) to import`);
            this.imports.push(vol);
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

        lookup (name : string) : Word | undefined {
            //console.log(this.shelf.keys());

            if (name.indexOf('::') != -1) {
                let parts = name.split('::');

                let mod = parts[0] as string;
                if (this.shelf.has(mod)) {
                    let vol = this.shelf.get(mod) as Volume;
                    return vol.lookup(parts[1] as string);
                }
                else {
                    throw new Error(`Cannot find module ${mod}`);
                }
            }

            const searchCandidates : Volume[] = [
                this.shelf.get('CORE') as Volume,
                this.shelf.get('_')    as Volume,
                this.shelf.get('__')   as Volume,
                ...this.imports
            ];

            for (const dict of searchCandidates) {
                let word = dict.lookup(name);
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

        bind (e : Word) : void {
            this.entries.set(e.name, e);
        }

        unbind (name : string) : void {
            this.entries.delete(name);
        }

        lookup (name : string) : Word | undefined {
            return this.entries.get(name);
        }
    }

}
