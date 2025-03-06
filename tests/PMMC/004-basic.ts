
import { Types }   from '../../src/PMMC/Types';

import { Sources }     from '../../src/PMMC/Sources';
import { Dictionary }  from '../../src/PMMC/Dictionary';
import { Tokenizer }   from '../../src/PMMC/Tokenizer';
import { Parser }      from '../../src/PMMC/Parser';
import { Compiler }    from '../../src/PMMC/Compiler';
import { Interpreter } from '../../src/PMMC/Interpreter';

async function Test003 () {
    let dict        = new Dictionary.Catalog();
    let interpreter = new Interpreter(
        dict,
        new Compiler(
            dict,
            new Parser(
                new Tokenizer(
                    new Sources.FromArray(
                        [
                            `
                            1 10 + 20 * 3 -
                            `,
                        ] as Types.Source[]
                    )
                )
            )
        )
    );

    await interpreter.run();

}

Test003();

