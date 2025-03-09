
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
        let tape_stack : Types.Tape<Types.Compiled>[] = [];
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
                tape_stack.unshift(new Tapes.BlockTape());
                break;
            case 'BLOCK_COND':
            case 'BLOCK_LOOP':
            case 'BLOCK_EXEC':
                let blockTape = tape_stack.shift() as Tapes.BlockTape;
                if (!blockTape)
                    throw new Error("Expected block tape on the stack and got nothing!");

                let block = {
                    type   : (parsed.type == 'BLOCK_COND'
                                    ? 'COND'
                                    : parsed.type == 'BLOCK_LOOP'
                                        ? 'LOOP'
                                        : 'DO'),
                    tape   : blockTape,
                    parsed : parsed,
                } as Types.Compiled;

                if (tape_stack.length > 0) {
                    let tape = tape_stack[0] as Types.Tape<Types.Compiled>;
                    tape.load(block);
                } else {
                    yield block;
                }
                break;
            case 'BLOCK_NEXT':
            case 'BLOCK_LAST':
                let blockTapeCtrl = tape_stack.at(0) as Tapes.BlockTape;
                if (!blockTapeCtrl)
                    throw new Error("Expected block tape on the stack and got nothing!");

                let blockCtrl = {
                    type   : 'GOTO',
                    tape   : blockTapeCtrl,
                    parsed : parsed,
                } as Types.Compiled;

                if (tape_stack.length > 0) {
                    let tape = tape_stack[0] as Types.Tape<Types.Compiled>;
                    tape.load(blockCtrl);
                } else {
                    yield blockCtrl;
                }

                break;
            case 'CALL':
            case 'CONST':
                let exec = {
                    type   : (parsed.type == 'CALL' ? 'EXECUTE' : 'PUSH'),
                    parsed : parsed,
                } as Types.Compiled;

                if (tape_stack.length > 0) {
                    let tape = tape_stack[0] as Types.Tape<Types.Compiled>;
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
