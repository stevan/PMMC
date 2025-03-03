
import { Types } from './Types';

export class Parser implements Types.Flow<Types.ParsedStream> {
    private $tokens : Types.Flow<Types.TokenStream>;

    constructor (tokens : Types.Flow<Types.TokenStream>) {
        this.$tokens = tokens;
    }

    async *flow () : Types.ParsedStream {
        let flow = this.$tokens.flow();
        for await (const token of flow) {
            switch (token.type) {
            case Types.TokenType.STRING:
            case Types.TokenType.NUMBER:
            case Types.TokenType.BOOLEAN:
                yield { type : Types.ParsedType.PUSH_CONST, token : token };
                break;
            case Types.TokenType.WORD:
                switch (token.source) {
                // definitions
                case '::':
                    yield { type : Types.ParsedType.BEGIN_MOD, token : token };
                    let mod_name = await flow.next();
                    if (mod_name.done)
                        throw new Error("Unexpected end of source, expected module name");

                    yield { type : Types.ParsedType.IDENTIFIER, token : mod_name.value as Types.Token };
                    break;
                case ';;':
                    yield { type : Types.ParsedType.END_MOD, token : token };
                    break;
                case ':':
                    yield { type : Types.ParsedType.BEGIN_WORD, token : token };
                    let word_name = await flow.next();
                    if (word_name.done)
                        throw new Error("Unexpected end of source, expect word name");

                    yield { type : Types.ParsedType.IDENTIFIER, token : word_name.value as Types.Token };
                    break;
                case ';':
                    yield { type : Types.ParsedType.END_WORD, token : token };
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
                    yield { type : Types.ParsedType.CALL_WORD, token : token };
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
