
import { Types } from './Types';

export namespace Literals {

    // -------------------------------------------------------------------------
    // Scalars
    // -------------------------------------------------------------------------

    export class Bool implements Types.Literal {
        constructor(public value : boolean) {}
        toNum    () : number  { return this.value ? 1 : 0 }
        toBool   () : boolean { return this.value }
        toStr    () : string  { return this.value.toString() }
        toNative () : any { return this.value }
    }

    export class Num implements Types.Literal {
        constructor(public value : number) {}
        toNum    () : number  { return this.value }
        toBool   () : boolean { return this.value != 0 ? true : false }
        toStr    () : string  { return this.value.toString() }
        toNative () : any { return this.value }
    }

    export class Str implements Types.Literal {
        constructor(public value : string) {}
        toNum    () : number  { return parseInt(this.value) }
        toBool   () : boolean { return this.value != '' ? true : false }
        toStr    () : string  { return this.value }
        toNative () : any { return this.value }
    }

    export class Sym implements Types.Literal {
        constructor(public value : string) {}
        toNum    () : number  { throw new Error("Cannot convert Sym to number") }
        toBool   () : boolean { return !! this.value }
        toStr    () : string  { return this.value }
        toNative () : any { return this.value }

        toName () : string { return this.value.slice(1) }
    }

    export class Block implements Types.Literal {
        constructor(public tape : Types.Tape<Types.Compiled>) {}
        toNum    () : number  { return Number(this.tape) }
        toBool   () : boolean { return !!(this.tape) }
        toStr    () : string  { return String(this.tape) }
        toNative () : any { return this.tape }
    }

    export class Cell implements Types.Cell {
        constructor(public value : Types.Literal) {}
        toNum    () : number  { return this.value.toNum() }
        toBool   () : boolean { return this.value.toBool() }
        toStr    () : string  { return `<${this.value.toStr()}>` }
        toNative () : any { return this.value.toNative() }
    }

    export class Boxed implements Types.Literal {
        constructor(public value : any) {}
        toNum    () : number  { return Number(this.value) }
        toBool   () : boolean { return !!(this.value) }
        toStr    () : string  { return this.value.toString() }
        toNative () : any { return this.value }
    }

    // -------------------------------------------------------------------------
    // Containers
    // -------------------------------------------------------------------------

    export class Pad implements Types.Literal, Types.Pad {
        private $items : Map<string, Types.Literal>;

        constructor() { this.$items = new Map<string, Types.Literal>() }
        toNum    () : number  { throw new Error("TODO") }
        toBool   () : boolean { throw new Error("TODO") }
        toStr    () : string  { throw new Error("TODO") }
        toNative () : any { return this.$items }

        free (name : string) : void { this.$items.delete(name) }
        set  (name : string, value : Types.Cell) : void { this.$items.set(name, value) }
        get  (name : string) : Types.Cell {
            let cell = this.$items.get(name);
            if (!cell) throw new Error(`Cannot find ${name} cell`);
            return cell as Types.Cell;
        }
    }

    export class Stack implements Types.Literal, Types.Stack {
        private $items : Types.Literal[];

        constructor(items : Types.Literal[] = []) { this.$items = items }
        toNum    () : number  { throw new Error("TODO") }
        toBool   () : boolean { throw new Error("TODO") }
        toStr    () : string  { throw new Error("TODO") }

        toNative () : any { return this.$items.map((l) => l.toNative()) }
        toArray  () : Types.Literal[] { return this.$items }

        copyStack () : Types.Stack { return new Stack([...this.$items]) }

        get size () : number { return this.$items.length }

        push (l : Types.Literal) : void { this.$items.push(l) }
        pop  () : Types.Literal { return this.$items.pop()  as Types.Literal }
        peek () : Types.Literal { return this.$items.at(-1) as Types.Literal }

        drop () : void { this.$items.pop(); }
        dup  () : void { this.$items.push( this.$items.at(-1) as Types.Literal ) }
        over () : void { this.$items.push( this.$items.at(-2) as Types.Literal ) }
        rdup () : void { this.$items.push( this.$items.at(-3) as Types.Literal ) }
        swap () : void {
            let x = this.$items.pop() as Types.Literal;
            let y = this.$items.pop() as Types.Literal;
            this.$items.push(x);
            this.$items.push(y);
        }
        rot () : void {
            let x = this.$items.pop() as Types.Literal;
            let y = this.$items.pop() as Types.Literal;
            let z = this.$items.pop() as Types.Literal;
            this.$items.push(y);
            this.$items.push(x);
            this.$items.push(z);
        }
        rrot () : void {
            let x = this.$items.pop() as Types.Literal;
            let y = this.$items.pop() as Types.Literal;
            let z = this.$items.pop() as Types.Literal;
            this.$items.push(x);
            this.$items.push(z);
            this.$items.push(y);
        }
    }

    // -------------------------------------------------------------------------
    // Predicates
    // -------------------------------------------------------------------------

    export function isLiteral (l: any) : boolean {
        return l instanceof Bool
            || l instanceof Num
            || l instanceof Str
            || l instanceof Sym
            || l instanceof Block
            || l instanceof Cell
            || l instanceof Boxed
            || l instanceof Pad
            || l instanceof Stack;
    }

    // -------------------------------------------------------------------------
    // Assertions
    // -------------------------------------------------------------------------

    export function assertBool (l : Types.Literal) : asserts l is Bool {
        if (!(l instanceof Bool)) throw new Error(`Not Bool (${JSON.stringify(l)})`)
    }

    export function assertNum (l : Types.Literal) : asserts l is Num {
        if (!(l instanceof Num)) throw new Error(`Not Num (${JSON.stringify(l)})`)
    }

    export function assertStr (l : Types.Literal) : asserts l is Str {
        if (!(l instanceof Str)) throw new Error(`Not Str (${JSON.stringify(l)})`)
    }

    export function assertBlock (l : Types.Literal) : asserts l is Block {
        if (!(l instanceof Block)) throw new Error(`Not Block (${JSON.stringify(l)})`)
    }

    export function assertBoxed (l : Types.Literal) : asserts l is Boxed {
        if (!(l instanceof Boxed)) throw new Error(`Not Boxed (${JSON.stringify(l)})`)
    }

    export function assertStack (l : Types.Literal) : asserts l is Stack {
        if (!(l instanceof Stack)) throw new Error(`Not Stack (${JSON.stringify(l)})`)
    }
}
