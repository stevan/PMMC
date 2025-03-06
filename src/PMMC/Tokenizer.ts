
import { Types } from './Types';

const IS_NUMBER   = /^-?[0-9][0-9_]*$/;
const IS_STRING   = /^"[^"]*"|'[^']*'$/;
const IS_BOOLEAN  = /^#t|#f$/;
const IS_WORD     = /^\S+$/;
const IS_COMMENT  = /^\/\/\s.*\n$/;

const SPLITTER = /\/\/\s.*\n|"([^"])*"|'([^'])*'|\S+/g;

export class Tokenizer implements Types.Flow<Types.Token> {
    private $source          : Types.Flow<Types.Source>;
    private $includeComments : boolean;

    constructor (source : Types.Flow<Types.Source>) {
        this.$source          = source;
        this.$includeComments = false;
    }

    async *flow () : Types.Stream<Types.Token> {
        for await (const chunk of this.$source.flow()) {
            let match;
            while ((match = SPLITTER.exec(chunk)) !== null) {
                let m = match[0] as string;
                switch (true) {
                case IS_COMMENT.test(m):
                    if (this.$includeComments) {
                        yield { type : Types.TokenType.COMMENT, source : m };
                    }
                    break;
                case IS_STRING.test(m):
                    yield { type : Types.TokenType.STRING, source : m };
                    break;
                case IS_NUMBER.test(m):
                    yield { type : Types.TokenType.NUMBER, source : m };
                    break;
                case IS_BOOLEAN.test(m):
                    yield { type : Types.TokenType.BOOLEAN, source : m };
                    break;
                case IS_WORD.test(m):
                    yield { type : Types.TokenType.WORD, source : m };
                    break;
                default:
                    throw new Error(`Unrecognized match ${m}`);
                }
            }
        }
    }
}

