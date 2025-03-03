
export namespace Types {

    export interface Flow<T> {
        flow () : T;
    }

    export type Stream<T> = AsyncGenerator<T, void, void>;

    // -------------------------------------------------------------------------
    // Source
    // -------------------------------------------------------------------------

    export type Source       = string;
    export type SourceStream = Stream<Source>;

    // -------------------------------------------------------------------------
    // Tokens
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
    // Syntax Tokens
    // -------------------------------------------------------------------------

    export enum ParsedType {
        IDENTIFIER = 'IDENTIFIER',
        PUSH_CONST = 'PUSH_CONST',
        CALL_WORD  = 'CALL_WORD',
        BEGIN_MOD  = 'BEGIN_MOD',
        END_MOD    = 'END_MOD',
        BEGIN_WORD = 'BEGIN_WORD',
        END_WORD   = 'END_WORD',
    }

    export type Parsed       = { type : ParsedType, token : Token };
    export type ParsedStream = Stream<Parsed>;


}
