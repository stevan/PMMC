
import { Types }      from './Types';
import { Literals }   from './Literals';
import { Dictionary } from './Dictionary';
import { Tokenizer }   from './Tokenizer';
import { Parser }      from './Parser';
import { Compiler }    from './Compiler';
import { Interpreter } from './Interpreter';

export namespace Images {

    export class BaseImage {
        public catalog : Dictionary.Catalog;

        constructor() {
            this.catalog = new Dictionary.Catalog();
        }

        compile () : BaseImage {
            this.catalog.createVolume('CORE');
            this.loadCoreWords();
            this.catalog.exitCurrentVolume();
            return this;
        }

        run (source : Types.Flow<Types.Source>) : Types.Flow<Types.OutputToken> {
            let tokenizer   = new Tokenizer(source);
            let parser      = new Parser(tokenizer);
            let compiler    = new Compiler(this.catalog, parser);
            let interpreter = new Interpreter(this.catalog, compiler);
            return interpreter;
        }

        bindNativeWord (name : string, body : Dictionary.NativeWordBody) : void {
            this.catalog.currentVolume().bind(
                { type : 'NATIVE', name : name, body : body } as Dictionary.NativeWord
            );
        }

        loadCoreWords () : void {
            // =====================================================================
            // Stack Operators
            // =====================================================================

            // ---------------------------------------------------------------------
            // I/O
            // ---------------------------------------------------------------------

            // ---------------------------------------------------------------------
            // Stack Ops
            // ---------------------------------------------------------------------
            // DUP   ( a     -- a a   ) duplicate the top of the stack
            // SWAP  ( b a   -- a b   ) swap the top two items on the stack
            // DROP  ( a     --       ) drop the item at the top of the stack
            // OVER  ( b a   -- b a b ) like DUP, but for the 2nd item on the stack
            // ROT   ( c b a -- b a c ) rotate the 3rd item to the top of the stack
            // -ROT  ( c b a -- a c b ) rotate the 1st item to the 3rd position

            this.bindNativeWord('DUP',  (r:Types.Runtime) => r.stack.dup());
            this.bindNativeWord('DROP', (r:Types.Runtime) => r.stack.drop());

            this.bindNativeWord('OVER', (r:Types.Runtime) => r.stack.over());
            this.bindNativeWord('SWAP', (r:Types.Runtime) => r.stack.swap());

            this.bindNativeWord('RDUP', (r:Types.Runtime) => r.stack.rdup());
            this.bindNativeWord('ROT',  (r:Types.Runtime) => r.stack.rot());
            this.bindNativeWord('-ROT', (r:Types.Runtime) => r.stack.rrot());

            // ---------------------------------------------------------------------
            // Contorl Stack Ops
            // ---------------------------------------------------------------------
            // >R!  ( a --   ) ( a --   ) take from stack and push to control stack
            // <R!  (   -- a ) (   -- a ) take from control stack and push to stack
            // .R!  (   -- a ) ( a -- a ) push top of control stack to stack
            // ^R!  (   --   ) (   --   ) drop the top of the control stack
            // ---------------------------------------------------------------------

            this.bindNativeWord('>R!', (r:Types.Runtime) => r.control.push(r.stack.pop()));
            this.bindNativeWord('<R!', (r:Types.Runtime) => r.stack.push(r.control.pop()));
            this.bindNativeWord('.R!', (r:Types.Runtime) => r.stack.push(r.control.peek()));
            this.bindNativeWord('^R!', (r:Types.Runtime) => r.control.drop());

            // =====================================================================
            // BinOps
            // =====================================================================

            // ---------------------------------------------------------------------
            // Strings
            // ---------------------------------------------------------------------

            this.bindNativeWord('~', (r:Types.Runtime) => {
                let rhs = r.stack.pop() as Literals.Literal;
                let lhs = r.stack.pop() as Literals.Literal;
                r.stack.push(new Literals.Str(lhs.toNative() + rhs.toNative()))
            });

            // ---------------------------------------------------------------------
            // Equality
            // ---------------------------------------------------------------------

            this.bindNativeWord('==', (r:Types.Runtime) => {
                let rhs = r.stack.pop() as Literals.Literal;
                let lhs = r.stack.pop() as Literals.Literal;
                r.stack.push(new Literals.Bool(lhs.toNative() == rhs.toNative()))
            });

            this.bindNativeWord('!=', (r:Types.Runtime) => {
                let rhs = r.stack.pop() as Literals.Literal;
                let lhs = r.stack.pop() as Literals.Literal;
                r.stack.push(new Literals.Bool(lhs.toNative() != rhs.toNative()))
            });

            // ---------------------------------------------------------------------
            // Comparison
            // ---------------------------------------------------------------------

            this.bindNativeWord('>', (r:Types.Runtime) => {
                let rhs = r.stack.pop() as Literals.Literal;
                let lhs = r.stack.pop() as Literals.Literal;
                r.stack.push(new Literals.Bool(lhs.toNative() > rhs.toNative()))
            });

            this.bindNativeWord('>=', (r:Types.Runtime) => {
                let rhs = r.stack.pop() as Literals.Literal;
                let lhs = r.stack.pop() as Literals.Literal;
                r.stack.push(new Literals.Bool(lhs.toNative() >= rhs.toNative()))
            });

            this.bindNativeWord('<=', (r:Types.Runtime) => {
                let rhs = r.stack.pop() as Literals.Literal;
                let lhs = r.stack.pop() as Literals.Literal;
                r.stack.push(new Literals.Bool(lhs.toNative() <= rhs.toNative()))
            });

            this.bindNativeWord('<', (r:Types.Runtime) => {
                let rhs = r.stack.pop() as Literals.Literal;
                let lhs = r.stack.pop() as Literals.Literal;
                r.stack.push(new Literals.Bool(lhs.toNative() < rhs.toNative()))
            });

            // ---------------------------------------------------------------------
            // Math Ops
            // ---------------------------------------------------------------------

            this.bindNativeWord('+', (r:Types.Runtime) => {
                let rhs = r.stack.pop() as Literals.Literal;
                let lhs = r.stack.pop() as Literals.Literal;
                r.stack.push(new Literals.Num(lhs.toNative() + rhs.toNative()))
            });

            this.bindNativeWord('-', (r:Types.Runtime) => {
                let rhs = r.stack.pop() as Literals.Literal;
                let lhs = r.stack.pop() as Literals.Literal;
                r.stack.push(new Literals.Num(lhs.toNative() - rhs.toNative()))
            });

            this.bindNativeWord('*', (r:Types.Runtime) => {
                let rhs = r.stack.pop() as Literals.Literal;
                let lhs = r.stack.pop() as Literals.Literal;
                r.stack.push(new Literals.Num(lhs.toNative() * rhs.toNative()))
            });

            this.bindNativeWord('/', (r:Types.Runtime) => {
                let rhs = r.stack.pop() as Literals.Literal;
                let lhs = r.stack.pop() as Literals.Literal;
                r.stack.push(new Literals.Num(lhs.toNative() / rhs.toNative()))
            });

            this.bindNativeWord('%', (r:Types.Runtime) => {
                let rhs = r.stack.pop() as Literals.Literal;
                let lhs = r.stack.pop() as Literals.Literal;
                r.stack.push(new Literals.Num(lhs.toNative() % rhs.toNative()))
            });
        }
    }

}
