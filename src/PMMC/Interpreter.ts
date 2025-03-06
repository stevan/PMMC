
import { Types }      from './Types';
import { Literals }   from './Literals';
import { Dictionary } from './Dictionary';

export class Interpreter implements Types.Runtime {
    public compiled : Types.Flow<Types.Compiled>;
    public catalog  : Dictionary.Catalog;
    public stack    : Literals.Stack;
    public control  : Literals.Stack;

    constructor (catalog : Dictionary.Catalog, compiled : Types.Flow<Types.Compiled>) {
        this.compiled = compiled;
        this.catalog  = catalog;
        this.stack    = new Literals.Stack();
        this.control  = new Literals.Stack();
        this.loadBuiltIns();
    }

    async *run () : Types.Stream<any[]> {
        yield* this.execute(this.compiled.flow(), "main");
    }

    async *execute (tape : Types.Stream<Types.Compiled>, callee : string) : Types.Stream<any[]> {
        yield [ `ENTER  @ ${callee}` ];
        for await (const compiled of tape) {
            let before = this.stack.toNative();
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
                yield [ "TODO", compiled ];
                break;
            }
            yield [ "  TICK :>", before, "--", this.stack.toNative() ];
        }
        yield [ 'EXIT  <:', this.stack.toNative() ];
    }

    //--------------------------------------------------------------------------
    // Builtins ...
    //--------------------------------------------------------------------------

    private bindNativeWord (name : string, body : Dictionary.NativeWordBody) : void {
        this.catalog.currentVolume().bind(
            { type : 'NATIVE', name : name, body : body } as Dictionary.NativeWord
        );
    }

    private loadBuiltIns () : void {
        this.catalog.createVolume('CORE');

        // =====================================================================
        // Stack Operators
        // =====================================================================

        // ---------------------------------------------------------------------
        // Stack Ops
        // ---------------------------------------------------------------------
        // DUP   ( a     -- a a   ) duplicate the top of the stack
        // SWAP  ( b a   -- a b   ) swap the top two items on the stack
        // DROP  ( a     --       ) drop the item at the top of the stack
        // OVER  ( b a   -- b a b ) like DUP, but for the 2nd item on the stack
        // ROT   ( c b a -- b a c ) rotate the 3rd item to the top of the stack
        // -ROT  ( c b a -- a c b ) rotate the 1st item to the 3rd position

        this.bindNativeWord('DUP',  (_:Types.Runtime) => this.stack.dup());
        this.bindNativeWord('DROP', (_:Types.Runtime) => this.stack.drop());

        this.bindNativeWord('OVER', (_:Types.Runtime) => this.stack.over());
        this.bindNativeWord('SWAP', (_:Types.Runtime) => this.stack.swap());

        this.bindNativeWord('RDUP', (_:Types.Runtime) => this.stack.rdup());
        this.bindNativeWord('ROT',  (_:Types.Runtime) => this.stack.rot());
        this.bindNativeWord('-ROT', (_:Types.Runtime) => this.stack.rrot());

        // ---------------------------------------------------------------------
        // Contorl Stack Ops
        // ---------------------------------------------------------------------
        // >R!  ( a --   ) ( a --   ) take from stack and push to control stack
        // <R!  (   -- a ) (   -- a ) take from control stack and push to stack
        // .R!  (   -- a ) ( a -- a ) push top of control stack to stack
        // ^R!  (   --   ) (   --   ) drop the top of the control stack
        // ---------------------------------------------------------------------

        this.bindNativeWord('>R!', (_:Types.Runtime) => this.control.push(this.stack.pop()));
        this.bindNativeWord('<R!', (_:Types.Runtime) => this.stack.push(this.control.pop()));
        this.bindNativeWord('.R!', (_:Types.Runtime) => this.stack.push(this.control.peek()));
        this.bindNativeWord('^R!', (_:Types.Runtime) => this.control.drop());

        // =====================================================================
        // BinOps
        // =====================================================================

        // ---------------------------------------------------------------------
        // Strings
        // ---------------------------------------------------------------------

        this.bindNativeWord('~', (_:Types.Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Str(lhs.toNative() + rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Equality
        // ---------------------------------------------------------------------

        this.bindNativeWord('==', (_:Types.Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() == rhs.toNative()))
        });

        this.bindNativeWord('!=', (_:Types.Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() != rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Comparison
        // ---------------------------------------------------------------------

        this.bindNativeWord('>', (_:Types.Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() > rhs.toNative()))
        });

        this.bindNativeWord('>=', (_:Types.Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() >= rhs.toNative()))
        });

        this.bindNativeWord('<=', (_:Types.Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() <= rhs.toNative()))
        });

        this.bindNativeWord('<', (_:Types.Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() < rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Math Ops
        // ---------------------------------------------------------------------

        this.bindNativeWord('+', (_:Types.Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() + rhs.toNative()))
        });

        this.bindNativeWord('-', (_:Types.Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() - rhs.toNative()))
        });

        this.bindNativeWord('*', (_:Types.Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() * rhs.toNative()))
        });

        this.bindNativeWord('/', (_:Types.Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() / rhs.toNative()))
        });

        this.bindNativeWord('%', (_:Types.Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() % rhs.toNative()))
        });

        this.catalog.exitCurrentVolume();
    }

}
