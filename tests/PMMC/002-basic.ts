
import { Sources }   from '../../src/PMMC/Sources';
import { Tokenizer } from '../../src/PMMC/Tokenizer';
import { Parser }    from '../../src/PMMC/Parser';

async function Test002 () {
    let source = new Sources.FromArray(
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
        ]
    );

    let tokenizer = new Tokenizer();
    let parser    = new Parser();

    for await (const input of parser.flow(tokenizer.flow(source.flow()))) {
        console.log("GOT", input);
    }
}

Test002();

