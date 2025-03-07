
import { Types }      from './Types';
import { Literals }   from './Literals';
import { Dictionary } from './Dictionary';

export class Interpreter implements Types.Runtime, Types.Flow<Types.Compiled, Types.OutputToken> {
    public catalog : Dictionary.Catalog;
    public stack   : Literals.Stack;
    public control : Literals.Stack;

    constructor (catalog : Dictionary.Catalog) {
        this.catalog = catalog;
        this.stack   = new Literals.Stack();
        this.control = new Literals.Stack();
    }

    async *flow (source : Types.Stream<Types.Compiled>, callee : string = 'main') : Types.Stream<Types.OutputToken> {
        yield this.createOutputToken(Types.OutputHandle.STDERR, [ `ENTER  @ ${callee}` ]);
        for await (const compiled of source) {
            let before = this.stack.copyStack();
            switch (compiled.type) {
            case 'EXECUTE':
                let word = this.catalog.lookup(compiled.parsed.token.source);
                if (!word) throw new Error(`Could not find word ${compiled.parsed.token.source}`)
                if (word.type == 'NATIVE') {
                    word.body(this);
                }
                else {
                    yield* this.flow(word.body.flow(), word.name);
                }
                break;
            case 'PUSH':
                this.stack.push(compiled.parsed.literal)
                break;
            case 'TODO':
                yield this.createOutputToken(Types.OutputHandle.STDERR, [ "TODO", compiled ]);
                break;
            }
            yield this.createOutputToken(Types.OutputHandle.STDERR, [ "  TICK :>", before, "--", this.stack ]);
        }
        yield this.createOutputToken(Types.OutputHandle.STDERR, [ "EXIT  <:", this.stack ]);
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
