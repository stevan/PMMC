
import * as PMMC from '../../src/PMMC';

async function Test002 () {
    let source = new PMMC.Sources.FromArray(
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

    let tokenizer = new PMMC.Tokenizer();
    let parser    = new PMMC.Parser();

    for await (const input of parser.flow(tokenizer.flow(source.flow()))) {
        console.log("GOT", input);
    }
}

Test002();

