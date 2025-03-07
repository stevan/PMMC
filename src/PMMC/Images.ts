
import { Types }      from './Types';
import { Literals }   from './Literals';
import { Dictionary } from './Dictionary';
//import { Tokenizer }   from './Tokenizer';
//import { Parser }      from './Parser';
//import { Compiler }    from './Compiler';
//import { Interpreter } from './Interpreter';

export namespace Images {

    export function createCoreVolume () : Dictionary.Volume {
        let vol = new Dictionary.Volume('CORE');

        const bindNativeWord = (
            name : string,
            body : Dictionary.NativeWordBody
        ) => vol.bind({ type : 'NATIVE', name : name, body : body });

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

        bindNativeWord('>R!', (r:Types.Runtime) => r.control.push(r.stack.pop()));
        bindNativeWord('<R!', (r:Types.Runtime) => r.stack.push(r.control.pop()));
        bindNativeWord('.R!', (r:Types.Runtime) => r.stack.push(r.control.peek()));
        bindNativeWord('^R!', (r:Types.Runtime) => r.control.drop());

        // =====================================================================
        // BinOps
        // =====================================================================

        // ---------------------------------------------------------------------
        // Strings
        // ---------------------------------------------------------------------

        bindNativeWord('~', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Literals.Literal;
            let lhs = r.stack.pop() as Literals.Literal;
            r.stack.push(new Literals.Str(lhs.toNative() + rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Equality
        // ---------------------------------------------------------------------

        bindNativeWord('==', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Literals.Literal;
            let lhs = r.stack.pop() as Literals.Literal;
            r.stack.push(new Literals.Bool(lhs.toNative() == rhs.toNative()))
        });

        bindNativeWord('!=', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Literals.Literal;
            let lhs = r.stack.pop() as Literals.Literal;
            r.stack.push(new Literals.Bool(lhs.toNative() != rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Comparison
        // ---------------------------------------------------------------------

        bindNativeWord('>', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Literals.Literal;
            let lhs = r.stack.pop() as Literals.Literal;
            r.stack.push(new Literals.Bool(lhs.toNative() > rhs.toNative()))
        });

        bindNativeWord('>=', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Literals.Literal;
            let lhs = r.stack.pop() as Literals.Literal;
            r.stack.push(new Literals.Bool(lhs.toNative() >= rhs.toNative()))
        });

        bindNativeWord('<=', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Literals.Literal;
            let lhs = r.stack.pop() as Literals.Literal;
            r.stack.push(new Literals.Bool(lhs.toNative() <= rhs.toNative()))
        });

        bindNativeWord('<', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Literals.Literal;
            let lhs = r.stack.pop() as Literals.Literal;
            r.stack.push(new Literals.Bool(lhs.toNative() < rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Math Ops
        // ---------------------------------------------------------------------

        bindNativeWord('+', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Literals.Literal;
            let lhs = r.stack.pop() as Literals.Literal;
            r.stack.push(new Literals.Num(lhs.toNative() + rhs.toNative()))
        });

        bindNativeWord('-', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Literals.Literal;
            let lhs = r.stack.pop() as Literals.Literal;
            r.stack.push(new Literals.Num(lhs.toNative() - rhs.toNative()))
        });

        bindNativeWord('*', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Literals.Literal;
            let lhs = r.stack.pop() as Literals.Literal;
            r.stack.push(new Literals.Num(lhs.toNative() * rhs.toNative()))
        });

        bindNativeWord('/', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Literals.Literal;
            let lhs = r.stack.pop() as Literals.Literal;
            r.stack.push(new Literals.Num(lhs.toNative() / rhs.toNative()))
        });

        bindNativeWord('%', (r:Types.Runtime) => {
            let rhs = r.stack.pop() as Literals.Literal;
            let lhs = r.stack.pop() as Literals.Literal;
            r.stack.push(new Literals.Num(lhs.toNative() % rhs.toNative()))
        });

        return vol;
    }

}
