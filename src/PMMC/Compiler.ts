
import { Types }      from './Types';
import { Tapes }      from './Tapes';
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
            case 'BLOCK_BEGIN':
                tape_stack.unshift(new Tapes.CompiledTape());
                break;
            case 'BLOCK_COND':
            case 'BLOCK_LOOP':
                let blockTape = tape_stack.shift();
                if (!blockTape)
                    throw new Error("Expected block tape on the stack and got nothing!");

                let block = {
                    type   : (parsed.type == 'BLOCK_COND' ? 'COND' : 'LOOP'),
                    tape   : blockTape,
                    parsed : parsed,
                } as Types.Compiled;

                if (tape_stack.length > 0) {
                    let tape = tape_stack[0] as Tapes.CompiledTape;
                    tape.load(block);
                } else {
                    yield block;
                }
                break;
            case 'CALL':
            case 'CONST':
                let exec = {
                    type   : (parsed.type == 'CALL' ? 'EXECUTE' : 'PUSH'),
                    parsed : parsed,
                } as Types.Compiled;

                if (tape_stack.length > 0) {
                    let tape = tape_stack[0] as Tapes.CompiledTape;
                    tape.load(exec);
                } else {
                    yield exec;
                }
                break;
            default:
                yield { type : 'TODO', parsed : parsed }
            }
        }
    }
 }
