
export namespace Types {

    // -------------------------------------------------------------------------
    // Common Types
    // -------------------------------------------------------------------------

    export enum LiteralType {
        Bool  = 'Bool',
        Num   = 'Num',
        Str   = 'Str',
        Sym   = 'Sym',
        Block = 'Block',
    }

    export interface Literal {
        toNum    () : number;
        toBool   () : boolean;
        toStr    () : string;
        toNative () : any;
        // toJSON () ...?
        // copy?
    }

    export interface Stack {
        get size  () : number;
        push (l : Literal) : void;
        pop  () : Literal;
        peek () : Literal;
        drop () : void;
        dup  () : void;
        over () : void;
        rdup () : void;
        swap () : void;
        rot  () : void;
        rrot () : void;
    }

    export type Cell = Literal & {
        value : Literal;
    }

    export interface Pad {
        get   (name : string) : Literal;
        set   (name : string, value : Cell) : void;
        free  (name : string) : void;
    }

    export interface Runtime {
        pad     : Pad;
        stack   : Stack;
        control : Stack;
        // I/O
        put (...args : Literal[]) : void;
        // get () : Literal;
    }

    // -------------------------------------------------------------------------
    // Core Types
    // -------------------------------------------------------------------------

    export type Stream<T> = AsyncGenerator<T, void, void>;

    export interface Source<Out> {
        flow () : Stream<Out>;
    }

    export interface Flow<In, Out> {
        flow (source: Stream<In>) : Stream<Out>;
    }

    export interface Sink<In> {
        flow (source: Stream<In>) : Promise<void>;
    }

    // ... tapes are like sources, but with a bit more

    export type Tape<T> = Source<T> & {
        load (t : T) : void;
    }

    // =========================================================================
    // Tokens
    // =========================================================================

    export enum OutputHandle {
        STDOUT = '🆗',
        INFO   = '🌈',
        WARN   = '⚡️',
        ERROR  = '💔',
        DEBUG  = '💩',
    }

    export type OutputToken = { fh : OutputHandle, args : Literal[] }

    // -------------------------------------------------------------------------
    // Source
    // -------------------------------------------------------------------------

    export type SourceCode = string;

    // -------------------------------------------------------------------------
    // Tokens (rename to Lexed)
    // -------------------------------------------------------------------------

    export enum TokenType {
        NUMBER  = 'NUMBER',
        STRING  = 'STRING',
        BOOLEAN = 'BOOLEAN',
        SYMBOL  = 'SYMBOL',
        WORD    = 'WORD',
        COMMENT = 'COMMENT',
    }

    export type Token = { type : TokenType, source : string };

    // -------------------------------------------------------------------------
    // Parsed Tokens
    // -------------------------------------------------------------------------

    export type Identifier = { type : 'IDENTIFIER', token : Token }

    export type ModBegin   = { type : 'MOD_BEGIN',  token : Token, ident : Identifier }
    export type ModEnd     = { type : 'MOD_END',    token : Token }

    export type WordBegin  = { type : 'WORD_BEGIN', token : Token, ident : Identifier  }
    export type WordEnd    = { type : 'WORD_END',   token : Token }

    export type BlockBegin  = { type : 'BLOCK_BEGIN',  token : Token }
    export type BlockEnd    = { type : 'BLOCK_END',    token : Token }
    export type BlockInvoke = { type : 'BLOCK_INVOKE', token : Token }
    export type BlockExec   = { type : 'BLOCK_EXEC',   token : Token }
    export type BlockCond   = { type : 'BLOCK_COND',   token : Token }
    export type BlockLoop   = { type : 'BLOCK_LOOP',   token : Token }
    export type BlockNext   = { type : 'BLOCK_NEXT',   token : Token }
    export type BlockLast   = { type : 'BLOCK_LAST',   token : Token }

    export type Const   = { type : 'CONST',   token : Token, literalType : LiteralType }
    export type Call    = { type : 'CALL',    token : Token }

    export type BlockControl = BlockNext | BlockLast

    export type Parsed =
        | Identifier
        | ModBegin
        | ModEnd
        | WordBegin
        | WordEnd
        | BlockBegin
        | BlockEnd
        | BlockInvoke
        | BlockExec
        | BlockCond
        | BlockLoop
        | BlockControl
        | Const
        | Call

    // -------------------------------------------------------------------------
    // Compiler Tokens
    // -------------------------------------------------------------------------

    export type Goto    = { type : 'GOTO',    parsed : BlockControl, tape : Tape<Compiled> };
    export type Loop    = { type : 'LOOP',    parsed : BlockLoop,    tape : Tape<Compiled> };
    export type Cond    = { type : 'COND',    parsed : BlockCond,    tape : Tape<Compiled> };
    export type Do      = { type : 'DO',      parsed : BlockExec,    tape : Tape<Compiled> };
    export type Push    = { type : 'PUSH',    parsed : Const | BlockEnd, literal : Literal };
    export type Execute = { type : 'EXECUTE', parsed : Call  | BlockInvoke };
    export type TODO    = { type : 'TODO',    parsed : Parsed };

    export type Compiled =
        | Goto
        | Loop
        | Cond
        | Do
        | Push
        | Execute
        | TODO


    // -------------------------------------------------------------------------
}













