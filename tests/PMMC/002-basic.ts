
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test002 () {
    let test = new Test.Simple();

    let source = new PMMC.Sources.FromArray(
        [
            ':: Foo',
            ': double SWAP * ;',
            ';;',
            `10 Foo::double
            DUP 15 > [ 15 + ]?

            10 [ 1 - 0 > ]@
            `,
        ]
    );

    let tokenizer = new PMMC.Tokenizer();
    let parser    = new PMMC.Parser();

    for await (const input of parser.flow(tokenizer.flow(source.flow()))) {
        test.ok(!!input, `... got the Parser output (${JSON.stringify(input)})`);
    }

    test.done();
}

Test002();

