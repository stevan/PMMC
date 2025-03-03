
import { Types }  from '../../src/PMMC/Types';
import { Sources } from '../../src/PMMC/Sources';

import { Tokenizer } from '../../src/PMMC/Tokenizer';
import { Parser }    from '../../src/PMMC/Parser';

async function Test001 () {
    let stream = new Parser(
        new Tokenizer(
            new Sources.FromArray(
                [
                    ':: Foo',
                    ': double SWAP * ;',
                    ';;',
                    `10 double
                    DUP 15 > IF 15 + THEN
                    10 DO
                        DUP +
                    LOOP
                    `,
                ] as Types.Source[]
            )
        )
    );

    for await (const input of stream.flow()) {
        console.log("GOT", input);
    }
}

Test001();

