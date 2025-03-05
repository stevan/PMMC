
export namespace Types {

    // -------------------------------------------------------------------------
    // Common Types
    // -------------------------------------------------------------------------

    export interface Runtime {
        stack   : LiteralValue[];
        control : LiteralValue[];
    }

    export interface Flow<T> {
        flow () : T;
    }

    export interface Tape<T> {
        load (t : T) : void;
        flow ()      : Stream<T>;
    }

    export type Stream<T> = AsyncGenerator<T, void, void>;

    // =========================================================================
    // Literals
    // =========================================================================

    export type NumericLiteral = { type : 'NUM',  value : number  };
    export type StringLiteral  = { type : 'STR',  value : string  };
    export type BooleanLiteral = { type : 'BOOL', value : boolean };
    export type WordLiteral    = { type : 'WORD', value : string  };
    export type AddressLiteral = { type : 'ADDR', value : string  };

    export type LiteralValue =
        | NumericLiteral
        | StringLiteral
        | BooleanLiteral
        | WordLiteral
        | AddressLiteral

    // =========================================================================
    // Tokens
    // =========================================================================

    // -------------------------------------------------------------------------
    // Source
    // -------------------------------------------------------------------------

    export type Source       = string;
    export type SourceStream = Stream<Source>;

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

    export type Token       = { type : TokenType, source : string };
    export type TokenStream = Stream<Token>;

    // -------------------------------------------------------------------------
    // Parsed Tokens
    // -------------------------------------------------------------------------

    export type Identifier = { type : 'IDENTIFIER', token : Token }

    export type Import     = { type : 'IMPORT',     token : Token, ident : Identifier  }
    export type ModBegin   = { type : 'MOD_BEGIN',  token : Token, ident : Identifier }
    export type ModEnd     = { type : 'MOD_END',    token : Token }

    export type WordBegin  = { type : 'WORD_BEGIN', token : Token, ident : Identifier  }
    export type WordEnd    = { type : 'WORD_END',   token : Token }

    export type Keyword    = { type : 'KEYWORD',    token : Token }
    export type Const      = { type : 'CONST',      token : Token, literal : LiteralValue }
    export type Call       = { type : 'CALL',       token : Token }

    export type Parsed =
        | Identifier
        | ModBegin
        | ModEnd
        | WordBegin
        | WordEnd
        | Import
        | Keyword
        | Const
        | Call

    export type ParsedStream = Stream<Parsed>;

    // -------------------------------------------------------------------------
    // Compiler Tokens
    // -------------------------------------------------------------------------

    export type Compiled = {
        addr   : number,
        type   : 'TODO',
        parsed : Parsed
    };
    export type CompiledStream = Stream<Compiled>;

}













