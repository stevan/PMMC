
import { Types }    from './Types';
import { Literals } from './Literals';

export class Parser implements Types.Flow<Types.Token, Types.Parsed> {

    async getIdentifier (stream : Types.Stream<Types.Token>) : Promise<Types.Identifier> {
        return stream.next().then((ident) => {
            if (ident.done)
                throw new Error("Unexpected end of source, expect identifier");
            return { type : 'IDENTIFIER', token : ident.value as Types.Token };
        })
    }

    async *flow (source : Types.Stream<Types.Token>) : Types.Stream<Types.Parsed> {
        for await (const token of source) {
            switch (token.type) {
            case Types.TokenType.STRING:
                yield { type : 'CONST', token : token, literal : new Literals.Str(token.source) };
                break;
            case Types.TokenType.NUMBER:
                yield { type : 'CONST', token : token, literal : new Literals.Num(parseInt(token.source)) };
                break;
            case Types.TokenType.BOOLEAN:
                yield { type : 'CONST', token : token, literal : new Literals.Bool(token.source == '#t' ? true : false) };
                break;
            case Types.TokenType.WORD:
                switch (token.source) {
                // -------------------------------------------------------------
                // definitions
                // -------------------------------------------------------------
                case '::':
                    yield { type : 'MOD_BEGIN', token : token, ident : await this.getIdentifier(source) };
                    break;
                case ';;':
                    yield { type : 'MOD_END', token : token };
                    break;

                case ':':
                    yield { type : 'WORD_BEGIN', token : token, ident : await this.getIdentifier(source) };
                    break;
                case ';':
                    yield { type : 'WORD_END', token : token };
                    break;

                case '[':
                    yield { type : 'BLOCK_BEGIN', token : token };
                    break;

                case ']?':
                    yield { type : 'BLOCK_COND', token : token };
                    break;

                case ']@?':
                    yield { type : 'BLOCK_LOOP', token : token };
                    break;

                case '@+':
                    yield { type : 'BLOCK_NEXT', token : token };
                    break;

                case '@^':
                    yield { type : 'BLOCK_LAST', token : token };
                    break;
                // -------------------------------------------------------------
                // control structures
                // -------------------------------------------------------------
                case 'IF':
                    yield { type : 'BLOCK_BEGIN', token : token };
                    break;
                case 'ELSE':
                    yield { type : 'BLOCK_COND', token : token };
                    yield { type : 'CALL', token : { type : Types.TokenType.WORD, source : '!'} };
                    yield { type : 'BLOCK_BEGIN', token : token };
                    break;
                case 'THEN':
                    yield { type : 'BLOCK_COND', token : token };
                    yield { type : 'CALL', token : { type : Types.TokenType.WORD, source : 'DROP'} };
                    break;

                case 'BEGIN':
                    yield { type : 'BLOCK_BEGIN', token : token };
                    break;
                case 'WHILE':
                    yield { type : 'BLOCK_BEGIN', token : token };
                    break;
                case 'UNTIL':
                    yield { type : 'CALL', token : { type : Types.TokenType.WORD, source : '!'} };
                    yield { type : 'BLOCK_LOOP', token : token };
                    break;
                case 'REPEAT':
                    yield { type : 'BLOCK_COND', token : token };
                    yield { type : 'BLOCK_LOOP', token : token };
                    break;
                case 'DO':
                    yield { type : 'CALL',        token : { type : Types.TokenType.WORD, source : 'SWAP'} };
                    yield { type : 'BLOCK_BEGIN', token : token };
                    yield { type : 'CALL',        token : { type : Types.TokenType.WORD,   source : '>R' } };
                    yield { type : 'CONST',       token : { type : Types.TokenType.NUMBER, source : '1' }, literal : new Literals.Num(1) };
                    yield { type : 'CALL',        token : { type : Types.TokenType.WORD,   source : '+' } };
                    yield { type : 'CALL',        token : { type : Types.TokenType.WORD,   source : '>R' } };
                    break;
                case 'LOOP':
                    yield { type : 'CALL',       token : { type : Types.TokenType.WORD, source : '<R' } };
                    yield { type : 'CALL',       token : { type : Types.TokenType.WORD, source : '<R' } };
                    yield { type : 'CALL',       token : { type : Types.TokenType.WORD, source : 'OVER' } };
                    yield { type : 'CALL',       token : { type : Types.TokenType.WORD, source : 'OVER' } };
                    yield { type : 'CALL',       token : { type : Types.TokenType.WORD, source : '<' } };
                    yield { type : 'BLOCK_LOOP', token : token };
                    yield { type : 'CALL',       token : { type : Types.TokenType.WORD, source : 'DROP' } };
                    yield { type : 'CALL',       token : { type : Types.TokenType.WORD, source : 'DROP' } };
                    break;
                // -------------------------------------------------------------
                // calls
                // -------------------------------------------------------------
                default:
                    yield { type : 'CALL', token : token };
                }
                break;
            case Types.TokenType.COMMENT:
                break;
            default:
                throw new Error(`Unrecognized token type ${token.type}`)
            }
        }
    }
}
