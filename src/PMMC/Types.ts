
export namespace Types {

    // -------------------------------------------------------------------------
    // Common Types
    // -------------------------------------------------------------------------

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

    export interface Runtime {
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

    export type BlockBegin = { type : 'BLOCK_BEGIN', token : Token }
    export type BlockExec  = { type : 'BLOCK_EXEC',  token : Token }
    export type BlockCond  = { type : 'BLOCK_COND',  token : Token }
    export type BlockLoop  = { type : 'BLOCK_LOOP',  token : Token }
    export type BlockNext  = { type : 'BLOCK_NEXT',  token : Token }
    export type BlockLast  = { type : 'BLOCK_LAST',  token : Token }

    export type Const   = { type : 'CONST',   token : Token, literal : Literal }
    export type Call    = { type : 'CALL',    token : Token }

    export type BlockControl = BlockNext | BlockLast

    export type Parsed =
        | Identifier
        | ModBegin
        | ModEnd
        | WordBegin
        | WordEnd
        | BlockBegin
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
    export type Push    = { type : 'PUSH',    parsed : Const }; // << move the `literal` here instead
    export type Execute = { type : 'EXECUTE', parsed : Call  };
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













