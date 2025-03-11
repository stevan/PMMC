
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test008 () {
    let test = new Test.Simple();
    let dict = new PMMC.Dictionary.Catalog();
    PMMC.Images.createCoreVolume(dict);

    // let source = new PMMC.Sources.FromString(`
    //     10 [ DUP 1 - DUP 0 != ]@?
    //     10 [ DUP 0 != [ DUP 2 - ]? ]@?
    // `);

    let source = new PMMC.Sources.FromString(`
        10 BEGIN DUP 1 - DUP 0 == UNTIL
        10 BEGIN DUP 0 != WHILE DUP 2 - REPEAT
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
        interpreter.stack.toNative().join(" "),
        "10 9 8 7 6 5 4 3 2 1 0 10 8 6 4 2 0",
        '... got the expected result'
    );

    test.done();
}

Test008();

