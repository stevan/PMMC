
import { Types } from './Types';

export class Parser implements Types.Flow<Types.ParsedStream> {
    private $tokens : Types.Flow<Types.TokenStream>;

    constructor (tokens : Types.Flow<Types.TokenStream>) {
        this.$tokens = tokens;
    }

    async getIdentifier (stream : Types.TokenStream) : Promise<Types.Parsed> {
        return stream.next().then((ident) => {
            if (ident.done)
                throw new Error("Unexpected end of source, expect identifier");
            return { type : Types.ParsedType.IDENTIFIER, token : ident.value as Types.Token };
        })
    }

    async *flow () : Types.ParsedStream {
        let flow = this.$tokens.flow();
        for await (const token of flow) {
            switch (token.type) {
            case Types.TokenType.STRING:
            case Types.TokenType.NUMBER:
            case Types.TokenType.BOOLEAN:
                yield { type : Types.ParsedType.LITERAL, token : token };
                break;
            case Types.TokenType.WORD:
                switch (token.source) {
                // definitions
                case '%::':
                    yield { type : Types.ParsedType.IMPORT, token : token };
                    yield this.getIdentifier(flow);
                    break;
                // definitions
                case '::':
                    yield { type : Types.ParsedType.MOD_BEGIN, token : token };
                    yield this.getIdentifier(flow);
                    break;
                case ':':
                    yield { type : Types.ParsedType.WORD_BEGIN, token : token };
                    yield this.getIdentifier(flow);
                    break;
                case ';;':
                    yield { type : Types.ParsedType.MOD_END, token : token };
                    break;
                case ';':
                    yield { type : Types.ParsedType.WORD_END, token : token };
                    break;
                // control structures
                case 'IF':
                case 'ELSE':
                case 'THEN':
                case 'BEGIN':
                case 'WHILE':
                case 'UNTIL':
                case 'REPEAT':
                case 'DO':
                case 'LOOP':
                    yield { type : Types.ParsedType.KEYWORD, token : token };
                    break;
                // calls
                default:
                    yield { type : Types.ParsedType.CALL, token : token };
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
