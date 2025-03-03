
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
    // Parsed Tokens
    // -------------------------------------------------------------------------

    export enum ParsedType {
        IDENTIFIER = 'IDENTIFIER',
        MOD_BEGIN  = 'MOD_BEGIN',
        MOD_END    = 'MOD_END',
        WORD_BEGIN = 'WORD_BEGIN',
        WORD_END   = 'WORD_END',
        KEYWORD    = 'KEYWORD',
        LITERAL    = 'LITERAL',
        CALL       = 'CALL',
    }

    export type Parsed       = { type : ParsedType, token : Token };
    export type ParsedStream = Stream<Parsed>;

    // -------------------------------------------------------------------------
    // Compiler Tokens
    // -------------------------------------------------------------------------

    export enum CompiledType {
        KEYWORD = 'KEYWORD',
        LITERAL = 'LITERAL',
        CALL    = 'CALL',
    }

    export type Compiled       = { type : CompiledType, parsed : Parsed };
    export type CompiledStream = Stream<Compiled>;

}
