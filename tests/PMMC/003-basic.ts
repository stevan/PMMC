
import { Sources }    from '../../src/PMMC/Sources';
import { Dictionary } from '../../src/PMMC/Dictionary';
import { Tokenizer }  from '../../src/PMMC/Tokenizer';
import { Parser }     from '../../src/PMMC/Parser';
import { Compiler }   from '../../src/PMMC/Compiler';

async function Test003 () {
    let dict   = new Dictionary.Catalog();
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
    let compiler  = new Compiler(dict);

    for await (const input of compiler.flow(parser.flow(tokenizer.flow(source.flow())))) {
        console.log("GOT", input);
    }
}

Test003();

