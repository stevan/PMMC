
import { Types }      from './Types';
import { Literals }   from './Literals';
import { Dictionary } from './Dictionary';

export class Interpreter implements Types.Runtime, Types.Flow<Types.OutputToken> {
    public compiled : Types.Flow<Types.Compiled>;
    public catalog  : Dictionary.Catalog;
    public stack    : Literals.Stack;
    public control  : Literals.Stack;

    constructor (catalog : Dictionary.Catalog, compiled : Types.Flow<Types.Compiled>) {
        this.compiled = compiled;
        this.catalog  = catalog;
        this.stack    = new Literals.Stack();
        this.control  = new Literals.Stack();
    }

    async *flow () : Types.Stream<Types.OutputToken> {
        yield* this.execute(this.compiled.flow(), "main");
    }

    async *execute (tape : Types.Stream<Types.Compiled>, callee : string) : Types.Stream<Types.OutputToken> {
        yield this.put(Types.OutputHandle.STDERR, [ `ENTER  @ ${callee}` ]);
        for await (const compiled of tape) {
            let before = this.stack.copyStack();
            switch (compiled.type) {
            case 'EXECUTE':
                let word = this.catalog.lookup(compiled.parsed.token.source);
                if (!word) throw new Error(`Could not find word ${compiled.parsed.token.source}`)
                if (word.type == 'NATIVE') {
                    word.body(this);
                }
                else {
                    yield* this.execute(word.body.flow(), word.name);
                }
                break;
            case 'PUSH':
                this.stack.push(compiled.parsed.literal)
                break;
            case 'TODO':
                yield this.put(Types.OutputHandle.STDERR, [ "TODO", compiled ]);
                break;
            }
            yield this.put(Types.OutputHandle.STDERR, [ "  TICK :>", before, "--", this.stack ]);
        }
        yield this.put(Types.OutputHandle.STDERR, [ "EXIT  <:", this.stack ]);
    }

    //--------------------------------------------------------------------------
    // Builtins ...
    //--------------------------------------------------------------------------

    private put (fh : Types.OutputHandle, args : any[]) : Types.OutputToken {
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
