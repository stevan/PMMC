
import { Types }      from './Types';
import { Tapes }      from './Tapes';
//import { Literals }   from './Literals';
import { Dictionary } from './Dictionary';

export class Compiler implements Types.Flow<Types.Parsed, Types.Compiled> {
    private $catalog : Dictionary.Catalog;

    constructor (catalog : Dictionary.Catalog) {
        this.$catalog = catalog;
        this.$catalog.createVolume('_');
    }

    async *flow (source : Types.Stream<Types.Parsed>) : Types.Stream<Types.Compiled> {
        let tape_stack : Tapes.CompiledTape[] = [];
        for await (const parsed of source) {
            switch (parsed.type) {
            case 'WORD_BEGIN':
                let wordTape = new Tapes.CompiledTape();
                tape_stack.unshift(wordTape);
                this.$catalog.currentVolume().createUserWord(parsed.ident.token.source, wordTape);
                break;
            case 'WORD_END':
                this.$catalog.currentVolume().exitCurrentWord();
                tape_stack.shift();
                break;
            //case 'BLOCK_BEGIN':
            //    tape_stack.unshift(new Tapes.CompiledTape());
            //    break;
            //case 'BLOCK_END':
            //    let blockTape = tape_stack.shift();
            //    if (!blockTape)
            //        throw new Error("Expected block tape on the stack and got nothing!");
            //    let block = {
            //        type   : 'PUSH',
            //        parsed : {
            //            type    : 'CONST',
            //            token   : { type : 'WORD', source : '[BLOCK]' },
            //            literal : new Literals.Block(blockTape),
            //        }
            //    } as Types.Compiled;
            //    if (tape_stack.length > 0) {
            //        let tape = tape_stack[0] as Tapes.CompiledTape;
            //        tape.load(block);
            //    } else {
            //        yield block;
            //    }
            //    break;
            case 'CALL':
                let exec = { type : 'EXECUTE', parsed : parsed } as Types.Compiled;
                if (tape_stack.length > 0) {
                    let tape = tape_stack[0] as Tapes.CompiledTape;
                    tape.load(exec);
                } else {
                    yield exec;
                }
                break;
            case 'CONST':
                let constant = { type : 'PUSH', parsed : parsed } as Types.Compiled;
                if (tape_stack.length > 0) {
                    let tape = tape_stack[0] as Tapes.CompiledTape;
                    tape.load(constant);
                } else {
                    yield constant;
                }
                break;
            default:
                yield { type : 'TODO', parsed : parsed }
            }
        }
    }
 }
