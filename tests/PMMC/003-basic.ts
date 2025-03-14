
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test003 () {
    let test = new Test.Simple();

    let dict   = new PMMC.Dictionary.Catalog();
    let source = new PMMC.Sources.FromArray(
        [
            ':: Foo',
            ': double SWAP * ;',
            ';;',
            `
            10 Foo::double

            DUP 15 > [ 15 + ]?

            10 [ 1 - 0 > ]@
            `,
        ]
    );

    let tokenizer = new PMMC.Tokenizer();
    let parser    = new PMMC.Parser();
    let compiler  = new PMMC.Compiler(dict);

    for await (const input of compiler.flow(parser.flow(tokenizer.flow(source.flow())))) {
        test.ok(!!input, `... got the Compiler output (${JSON.stringify(input)})`);
    }

    test.done();
}

Test003();

