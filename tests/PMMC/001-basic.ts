
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test001 () {
    let test = new Test.Simple();

    let source = new PMMC.Sources.FromArray(
        [
            '"hello world!" say',
            '10 "world" #t',
            'this is the "end" of 10000',
            ' ~ ~~ ~foo ~$foo foo $foo ',
        ]
    );

    let tokenizer = new PMMC.Tokenizer();

    for await (const input of tokenizer.flow(source.flow())) {
        test.ok(!!input, `... got the Tokenizer output (${JSON.stringify(input)})`);
    }

    test.done();
}

Test001();

