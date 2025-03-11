
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test005 () {
    let test = new Test.Simple();
    let dict = new PMMC.Dictionary.Catalog();
    PMMC.Images.createCoreVolume(dict);

    let source = new PMMC.Sources.FromString(`
        : plusTen     10 + ;
        : timesTwenty 20 * ;
        1 plusTen timesTwenty 3 -
    `);

    let tokenizer   = new PMMC.Tokenizer();
    let parser      = new PMMC.Parser();
    let compiler    = new PMMC.Compiler(dict);
    let interpreter = new PMMC.Interpreter(dict);
    let output      = new PMMC.Sinks.Console();

    await output.flow(
            interpreter.flow(
                compiler.flow(
                    parser.flow(
                        tokenizer.flow(
                            source.flow())))));
    test.is(
        interpreter.stack.pop()?.toNative(),
        217,
        '... got the expected result'
    );

    test.done();
}

Test005();

