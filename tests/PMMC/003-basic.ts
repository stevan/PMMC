
import { Types }   from '../../src/PMMC/Types';

import { Sources }    from '../../src/PMMC/Sources';
import { Dictionary } from '../../src/PMMC/Dictionary';
import { Tokenizer }  from '../../src/PMMC/Tokenizer';
import { Parser }     from '../../src/PMMC/Parser';
import { Compiler }   from '../../src/PMMC/Compiler';

async function Test003 () {
    let dict   = new Dictionary.Catalog();

    dict.createVolume('_');

    let stream = new Compiler(
        dict,
        new Parser(
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
        )
    );

    for await (const input of stream.flow()) {
        console.log("GOT", input);
    }

    console.log(stream.getCatalog());
}

Test003();

