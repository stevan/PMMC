
import { Types }      from './Types';
import { Tapes }      from './Tapes';
import { Literals }   from './Literals';
import { Dictionary } from './Dictionary';

export class Interpreter implements Types.Runtime, Types.Flow<Types.Compiled, Types.OutputToken> {
    public catalog : Dictionary.Catalog;
    public pad     : Literals.Pad;
    public stack   : Literals.Stack;
    public control : Literals.Stack;

    private $output : Types.Literal[] = [];

    constructor (catalog : Dictionary.Catalog) {
        this.catalog = catalog;
        this.pad     = new Literals.Pad();
        this.stack   = new Literals.Stack();
        this.control = new Literals.Stack();

        this.catalog.createVolume('__');
    }

    put (...args : Types.Literal[]) : void {
        this.$output.push(...args);
    }

    async *flow (source : Types.Stream<Types.Compiled>, callee : string = 'main') : Types.Stream<Types.OutputToken> {
        yield this.createOutputToken(Types.OutputHandle.INFO, [ `ENTER => ${callee}` ]);
        for await (const compiled of source) {
            let beforeStack   = this.stack.copyStack();
            let beforeControl = this.control.copyStack();
            switch (compiled.type) {
            case 'EXECUTE':
                let word = this.catalog.lookup(compiled.parsed.token.source);
                if (!word) throw new Error(`Could not find word ${compiled.parsed.token.source}`)
                yield this.createOutputToken(Types.OutputHandle.INFO, [ `  CALL : ${word.name}` ]);
                if (word.type == 'NATIVE') {
                    word.body(this);
                    // NOTE:
                    // we can only ever have output after a call to .say, so
                    // we know this is the best place to call this ...
                    if (this.$output.length) {
                        yield this.createOutputToken(Types.OutputHandle.STDOUT, this.$output.splice(0));
                    }
                }
                else {
                    yield* this.flow(word.body.flow(), word.name);
                }
                break;
            case 'GOTO':
                let gotoTape = compiled.tape as Tapes.BlockTape;
                let goto = this.stack.pop() as Literals.Bool;
                Literals.assertBool(goto);
                if (goto.toBool()) {
                    if (compiled.parsed.type == 'BLOCK_NEXT') {
                        yield this.createOutputToken(Types.OutputHandle.INFO, [ `  NEXT ?` ]);
                        gotoTape.next();
                    } else {
                        yield this.createOutputToken(Types.OutputHandle.INFO, [ `  LAST ?` ]);
                        gotoTape.last();
                    }
                }
                //this.stack.push(goto);
                break;
            case 'COND':
                let condTape = compiled.tape;
                let cond = this.stack.pop() as Literals.Bool;
                Literals.assertBool(cond);
                yield this.createOutputToken(Types.OutputHandle.INFO, [ `  COND ?` ]);
                if (cond.toBool()) {
                    yield* this.flow(condTape.flow(), 'COND');
                }
                this.stack.push(cond);
                break;
            case 'LOOP':
                yield this.createOutputToken(Types.OutputHandle.INFO, [ ` +LOOP @` ]);
                let loopTape = compiled.tape;
                let looping = true;
                while (looping) {
                    yield* this.flow(loopTape.flow(), 'LOOP');
                    let cond = this.stack.pop() as Literals.Bool;
                    Literals.assertBool(cond);
                    looping = cond.toBool();
                }
                yield this.createOutputToken(Types.OutputHandle.INFO, [ ` -LOOP @` ]);
                break;
            case 'DO':
                yield this.createOutputToken(Types.OutputHandle.INFO, [ `   +DO |` ]);
                yield* this.flow(compiled.tape.flow(), 'DO');
                yield this.createOutputToken(Types.OutputHandle.INFO, [ `   -DO |` ]);
                break;
            case 'PUSH':
                yield this.createOutputToken(Types.OutputHandle.INFO, [ `   PUSH | ${compiled.parsed.token.source}` ]);
                this.stack.push(compiled.literal)
                break;
            case 'TODO':
                yield this.createOutputToken(Types.OutputHandle.WARN, [ "TODO", compiled ]);
                break;
            }
            yield this.createOutputToken(Types.OutputHandle.DEBUG, [ " stck[] :", beforeStack,   "--", this.stack   ]);
            yield this.createOutputToken(Types.OutputHandle.DEBUG, [ " ctrl[] :", beforeControl, "--", this.control ]);
        }
        yield this.createOutputToken(Types.OutputHandle.INFO, [ "EXIT   ^", this.stack ]);
    }

    private createOutputToken (fh : Types.OutputHandle, args : any[]) : Types.OutputToken {
        return {
            fh   : fh,
            args : args.map((arg) => {
                if (Literals.isLiteral(arg)) {
                    return arg;
                } else {
                    return new Literals.Str(String(arg));
                }
            })
        }
    }
}
