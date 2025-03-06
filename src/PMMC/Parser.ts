
import { Types }    from './Types';
import { Literals } from './Literals';

export class Parser implements Types.Flow<Types.Parsed> {
    private $tokens : Types.Flow<Types.Token>;

    constructor (tokens : Types.Flow<Types.Token>) {
        this.$tokens = tokens;
    }

    async getIdentifier (stream : Types.Stream<Types.Token>) : Promise<Types.Identifier> {
        return stream.next().then((ident) => {
            if (ident.done)
                throw new Error("Unexpected end of source, expect identifier");
            return { type : 'IDENTIFIER', token : ident.value as Types.Token };
        })
    }

    async *flow () : Types.Stream<Types.Parsed> {
        let flow = this.$tokens.flow();
        for await (const token of flow) {
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
                    yield { type : 'MOD_BEGIN', token : token, ident : await this.getIdentifier(flow) };
                    break;
                case ':':
                    yield { type : 'WORD_BEGIN', token : token, ident : await this.getIdentifier(flow) };
                    break;

                case ';;':
                    yield { type : 'MOD_END', token : token };
                    break;
                case ';':
                    yield { type : 'WORD_END', token : token };
                    break;
                // -------------------------------------------------------------
                // control structures
                // -------------------------------------------------------------
                case 'IF':
                case 'ELSE':
                case 'THEN':
                case 'BEGIN':
                case 'WHILE':
                case 'UNTIL':
                case 'REPEAT':
                case 'DO':
                case 'LOOP':
                    yield { type : 'KEYWORD', token : token };
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
