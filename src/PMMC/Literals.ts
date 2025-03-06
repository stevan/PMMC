
export namespace Literals {

    // -------------------------------------------------------------------------
    // Scalars
    // -------------------------------------------------------------------------

    export interface Literal {
        toNum    () : number;
        toBool   () : boolean;
        toStr    () : string;
        toNative () : any;
    }

    export class Bool implements Literal {
        constructor(public value : boolean) {}
        toNum    () : number  { return this.value ? 1 : 0 }
        toBool   () : boolean { return this.value }
        toStr    () : string  { return this.value.toString() }
        toNative () : any { return this.value }

        // TODO:
        // invert
        // equals
    }

    export function assertBool (l : Literal) : asserts l is Bool {
        if (!(l instanceof Bool)) throw new Error(`Not Bool (${JSON.stringify(l)})`)
    }

    export class Num implements Literal {
        constructor(public value : number) {}
        toNum    () : number  { return this.value }
        toBool   () : boolean { return this.value != 0 ? true : false }
        toStr    () : string  { return this.value.toString() }
        toNative () : any { return this.value }

        // TODO:
        // negate
        // add, sub, mul, div, mod
        // equals
        // compare
    }

    export function assertNum (l : Literal) : asserts l is Num {
        if (!(l instanceof Num)) throw new Error(`Not Num (${JSON.stringify(l)})`)
    }

    export class Str implements Literal {
        constructor(public value : string) {}
        toNum    () : number  { return parseInt(this.value) }
        toBool   () : boolean { return this.value != '' ? true : false }
        toStr    () : string  { return this.value }
        toNative () : any { return this.value }

        // TODO:
        // length
        // concat
        // equals
        // compare
    }

    export function assertStr (l : Literal) : asserts l is Str {
        if (!(l instanceof Str)) throw new Error(`Not Str (${JSON.stringify(l)})`)
    }

    export class WordRef implements Literal {
        constructor(public name : string) {}
        toNum    () : number  { throw new Error("Cannot convert WordRef to Num") }
        toBool   () : boolean { return true }
        toStr    () : string  { return "&" + this.name }
        toNative () : any { return this.toStr() }
        // TODO:
        // length?
        // equals
    }

    export function assertWordRef (l : Literal) : asserts l is WordRef {
        if (!(l instanceof WordRef)) throw new Error(`Not WordRef (${JSON.stringify(l)})`)
    }

    export class JSValue implements Literal {
        constructor(public value : any) {}
        toNum    () : number  { return Number(this.value) }
        toBool   () : boolean { return !!(this.value) }
        toStr    () : string  { return this.value.toString() }
        toNative () : any { return this.value }
    }

    export function assertJSValue (l : Literal) : asserts l is JSValue {
        if (!(l instanceof JSValue)) throw new Error(`Not JSValue (${JSON.stringify(l)})`)
    }

    // -------------------------------------------------------------------------
    // Containers
    // -------------------------------------------------------------------------

    export class Stack implements Literal {
        private $items : Literal[] = [];

        constructor() {}
        toNum    () : number  { throw new Error("TODO") }
        toBool   () : boolean { throw new Error("TODO") }
        toStr    () : string  { throw new Error("TODO") }

        toNative () : any { return this.$items.map((l) => l.toNative()) }
        toArray  () : Literal[] { return this.$items }

        get size () : number { return this.$items.length }

        push (l : Literal) : void { this.$items.push(l) }
        pop  () : Literal { return this.$items.pop()  as Literal }
        peek () : Literal { return this.$items.at(-1) as Literal }

        drop () : void { this.$items.pop(); }
        dup  () : void { this.$items.push( this.$items.at(-1) as Literal ) }
        over () : void { this.$items.push( this.$items.at(-2) as Literal ) }
        rdup () : void { this.$items.push( this.$items.at(-3) as Literal ) }
        swap () : void {
            let x = this.$items.pop() as Literal;
            let y = this.$items.pop() as Literal;
            this.$items.push(x);
            this.$items.push(y);
        }
        rot () : void {
            let x = this.$items.pop() as Literal;
            let y = this.$items.pop() as Literal;
            let z = this.$items.pop() as Literal;
            this.$items.push(y);
            this.$items.push(x);
            this.$items.push(z);
        }
        rrot () : void {
            let x = this.$items.pop() as Literal;
            let y = this.$items.pop() as Literal;
            let z = this.$items.pop() as Literal;
            this.$items.push(x);
            this.$items.push(z);
            this.$items.push(y);
        }


        // TODO:
        // length
        // equals
    }

    export function assertStack (l : Literal) : asserts l is Stack {
        if (!(l instanceof Stack)) throw new Error(`Not Stack (${JSON.stringify(l)})`)
    }

    export class Tuple implements Literal {
        private $items : Literal[] = [];

        constructor(public size : number) {}
        toNum    () : number  { throw new Error("TODO") }
        toBool   () : boolean { throw new Error("TODO") }
        toStr    () : string  { throw new Error("TODO") }
        toNative () : any { return this.$items.map((l) => l.toNative()) }

        get (i : number) : Literal { return this.$items[i] as Literal }
        set (i : number, l : Literal) : void { this.$items[i] = l }

        // TODO:
        // length
        // equals
    }

    export function assertTuple (l : Literal) : asserts l is Tuple {
        if (!(l instanceof Tuple)) throw new Error(`Not Tuple (${JSON.stringify(l)})`)
    }

    export class Queue implements Literal {
        private $items : Literal[] = [];

        constructor() {}
        toNum    () : number  { throw new Error("TODO") }
        toBool   () : boolean { throw new Error("TODO") }
        toStr    () : string  { throw new Error("TODO") }
        toNative () : any { return this.$items.map((l) => l.toNative()) }

        get size () : number { return this.$items.length }

        enqueue (l : Literal) : void { this.$items.unshift(l) }
        dequeue () : Literal { return this.$items.pop() as Literal }
        discard () : void  { this.$items.pop(); }

        // TODO:
        // length
        // equals
    }

    export function assertQueue (l : Literal) : asserts l is Queue {
        if (!(l instanceof Queue)) throw new Error(`Not Queue (${JSON.stringify(l)})`)
    }

}
