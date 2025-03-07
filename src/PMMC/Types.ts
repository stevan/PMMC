
import { Literals } from './Literals';

export namespace Types {

    // -------------------------------------------------------------------------
    // Common Types
    // -------------------------------------------------------------------------

    export interface Runtime {
        stack   : Literals.Stack;
        control : Literals.Stack;
    }

    // -------------------------------------------------------------------------
    // Core Types
    // -------------------------------------------------------------------------

    export interface Source<T> {
        flow () : Stream<T>;
    }

    export interface Flow<In, Out> {
        flow (source: Stream<In>) : Stream<Out>;
    }

    export interface Tape<T> {
        load (t : T) : void;
        flow ()      : Stream<T>;
    }

    export type Stream<T> = AsyncGenerator<T, void, void>;

    // =========================================================================
    // Tokens
    // =========================================================================

    export enum OutputHandle {
        STDOUT = '🌈',
        STDERR = '⚡️',
    }

    export type OutputToken = { fh : OutputHandle, args : Literals.Literal[] }

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

    export type Keyword    = { type : 'KEYWORD',    token : Token }
    export type Const      = { type : 'CONST',      token : Token, literal : Literals.Literal }
    export type Call       = { type : 'CALL',       token : Token }

    export type Parsed =
        | Identifier
        | ModBegin
        | ModEnd
        | WordBegin
        | WordEnd
        | Keyword
        | Const
        | Call

    // -------------------------------------------------------------------------
    // Compiler Tokens
    // -------------------------------------------------------------------------

    export type Push    = { addr : number, type : 'PUSH',    parsed : Const };
    export type Execute = { addr : number, type : 'EXECUTE', parsed : Call  };
    export type TODO    = { addr : number, type : 'TODO',    parsed : Parsed };

    export type Compiled =
        | Push
        | Execute
        | TODO


    // -------------------------------------------------------------------------
}













