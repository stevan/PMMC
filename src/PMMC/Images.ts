
import { Types }      from './Types';
import { Literals }   from './Literals';
import { Dictionary } from './Dictionary';
import { Tokenizer }   from './Tokenizer';
import { Parser }      from './Parser';
import { Compiler }    from './Compiler';
import { Interpreter } from './Interpreter';
import { Sources }     from './Sources';
import { Sinks }       from './Sinks';

export namespace Images {

    export class Image {
        public catalog     : Dictionary.Catalog;
        public tokenizer   : Tokenizer;
        public parser      : Parser;
        public compiler    : Compiler;
        public interpreter : Interpreter;

        constructor () {
            this.catalog     = new Dictionary.Catalog();
            this.tokenizer   = new Tokenizer();
            this.parser      = new Parser();
            this.compiler    = new Compiler(this.catalog);
            this.interpreter = new Interpreter(this.catalog);

            createCoreVolume(this.catalog);
        }

        // ---------------------------------------------------------------------

        fromSources (sources : Types.Source<Types.SourceCode>[]) : Types.Source<Types.SourceCode> {
            return new Sources.FromSources(sources)
        }

        fromFile (path : string) : Types.Source<Types.SourceCode> {
            return new Sources.FromFile(path)
        }

        fromString (src : Types.SourceCode) : Types.Source<Types.SourceCode> {
            return new Sources.FromString(src)
        }

        fromArray (src : Types.SourceCode[]) : Types.Source<Types.SourceCode> {
            return new Sources.FromArray(src)
        }

        fromREPL () : Types.Source<Types.SourceCode> {
            return new Sources.REPL()
        }

        // ---------------------------------------------------------------------

        toConsole () : Types.Sink<Types.OutputToken> {
            return new Sinks.Console()
        }

        // ---------------------------------------------------------------------

        async run (
            input  : Types.Source<Types.SourceCode>,
            output : Types.Sink<Types.OutputToken>
        ) : Promise<void> {
            await output.flow(
                this.interpreter.flow(
                    this.compiler.flow(
                        this.parser.flow(
                            this.tokenizer.flow(
                                input.flow())))));
        }

    }

    // -------------------------------------------------------------------------
    // Image Utilities
    // -------------------------------------------------------------------------

    export function createCoreVolume (catalog : Dictionary.Catalog) : void {
        let vol = catalog.createVolume('CORE');

        const bindNativeWord = (
            name : string,
            body : Dictionary.NativeWordBody
        ) => vol.bind({ type : 'NATIVE', name : name, body : body });

        // =====================================================================
        // Stack Operators
        // =====================================================================

        // ---------------------------------------------------------------------
        // Bind/Unbind
        // ---------------------------------------------------------------------

        bindNativeWord(':=', (r:Types.Runtime) => {
            let symbol = r.stack.pop() as Literals.Sym;
            let block  = r.stack.pop() as Literals.Block;
            catalog.currentVolume().bind({
                type : 'USER',
                name : symbol.toName(),
                body : block.tape
            });
        });

        bindNativeWord(':^', (r:Types.Runtime) => {
            let symbol = r.stack.pop() as Literals.Sym;
            catalog.currentVolume().unbind(symbol.toName());
        });

        // ---------------------------------------------------------------------
        // I/O
        // ---------------------------------------------------------------------

        bindNativeWord('>PUT', (r:Types.Runtime) => r.put(r.stack.pop()));

        // ---------------------------------------------------------------------
        // Stack Ops
        // ---------------------------------------------------------------------
        // DUP   ( a     -- a a   ) duplicate the top of the stack
        // SWAP  ( b a   -- a b   ) swap the top two items on the stack
        // DROP  ( a     --       ) drop the item at the top of the stack
        // OVER  ( b a   -- b a b ) like DUP, but for the 2nd item on the stack
        // ROT   ( c b a -- b a c ) rotate the 3rd item to the top of the stack
        // -ROT  ( c b a -- a c b ) rotate the 1st item to the 3rd position

        bindNativeWord('DUP',  (r:Types.Runtime) => r.stack.dup());
        bindNativeWord('DROP', (r:Types.Runtime) => r.stack.drop());

        bindNativeWord('OVER', (r:Types.Runtime) => r.stack.over());
        bindNativeWord('SWAP', (r:Types.Runtime) => r.stack.swap());

        bindNativeWord('RDUP', (r:Types.Runtime) => r.stack.rdup());
        bindNativeWord('ROT',  (r:Types.Runtime) => r.stack.rot());
        bindNativeWord('-ROT', (r:Types.Runtime) => r.stack.rrot());

        // ---------------------------------------------------------------------
        // Contorl Stack Ops
        // ---------------------------------------------------------------------
        // >R!  ( a --   ) ( a --   ) take from stack and push to control stack
        // <R!  (   -- a ) (   -- a ) take from control stack and push to stack
        // .R!  (   -- a ) ( a -- a ) push top of control stack to stack
        // ^R!  (   --   ) (   --   ) drop the top of the control stack
        // ---------------------------------------------------------------------

        bindNativeWord('>R', (r:Types.Runtime) => r.control.push(r.stack.pop()));
        bindNativeWord('<R', (r:Types.Runtime) => r.stack.push(r.control.pop()));
        bindNativeWord('.R', (r:Types.Runtime) => r.stack.push(r.control.peek()));
        bindNativeWord('^R', (r:Types.Runtime) => r.control.drop());

        // =====================================================================
        // BinOps
        // =====================================================================

        // ---------------------------------------------------------------------
        // Bools
        // ---------------------------------------------------------------------

        bindNativeWord('!', (r:Types.Runtime) => {
            let lhs = r.stack.pop() as Types.Literal;
            r.stack.push(new Literals.Bool(!lhs.toBool()))
        });

        bindNativeWord('!!', (r:Types.Runtime) => {
            let lhs = r.stack.pop() as Types.Literal;
            r.stack.push(new Literals.Bool(lhs.toBool()))
        });

        // ---------------------------------------------------------------------
        // Strings
        // ---------------------------------------------------------------------

        bindNativeWord('~', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Types.Literal;
            let lhs = r.stack.pop() as Types.Literal;
            r.stack.push(new Literals.Str(lhs.toNative() + rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Equality
        // ---------------------------------------------------------------------

        bindNativeWord('==', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Types.Literal;
            let lhs = r.stack.pop() as Types.Literal;
            r.stack.push(new Literals.Bool(lhs.toNative() == rhs.toNative()))
        });

        bindNativeWord('!=', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Types.Literal;
            let lhs = r.stack.pop() as Types.Literal;
            r.stack.push(new Literals.Bool(lhs.toNative() != rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Comparison
        // ---------------------------------------------------------------------

        bindNativeWord('>', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Types.Literal;
            let lhs = r.stack.pop() as Types.Literal;
            r.stack.push(new Literals.Bool(lhs.toNative() > rhs.toNative()))
        });

        bindNativeWord('>=', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Types.Literal;
            let lhs = r.stack.pop() as Types.Literal;
            r.stack.push(new Literals.Bool(lhs.toNative() >= rhs.toNative()))
        });

        bindNativeWord('<=', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Types.Literal;
            let lhs = r.stack.pop() as Types.Literal;
            r.stack.push(new Literals.Bool(lhs.toNative() <= rhs.toNative()))
        });

        bindNativeWord('<', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Types.Literal;
            let lhs = r.stack.pop() as Types.Literal;
            r.stack.push(new Literals.Bool(lhs.toNative() < rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Math Ops
        // ---------------------------------------------------------------------

        bindNativeWord('+', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Types.Literal;
            let lhs = r.stack.pop() as Types.Literal;
            r.stack.push(new Literals.Num(lhs.toNative() + rhs.toNative()))
        });

        bindNativeWord('-', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Types.Literal;
            let lhs = r.stack.pop() as Types.Literal;
            r.stack.push(new Literals.Num(lhs.toNative() - rhs.toNative()))
        });

        bindNativeWord('*', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Types.Literal;
            let lhs = r.stack.pop() as Types.Literal;
            r.stack.push(new Literals.Num(lhs.toNative() * rhs.toNative()))
        });

        bindNativeWord('/', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Types.Literal;
            let lhs = r.stack.pop() as Types.Literal;
            r.stack.push(new Literals.Num(lhs.toNative() / rhs.toNative()))
        });

        bindNativeWord('%', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Types.Literal;
            let lhs = r.stack.pop() as Types.Literal;
            r.stack.push(new Literals.Num(lhs.toNative() % rhs.toNative()))
        });

        catalog.exitCurrentVolume();
    }

}
