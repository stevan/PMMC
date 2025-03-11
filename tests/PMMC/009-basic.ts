
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test009 () {
    let test = new Test.Simple();
    let dict = new PMMC.Dictionary.Catalog();
    PMMC.Images.createCoreVolume(dict);

    // let source = new PMMC.Sources.FromString(`
    //     10
    //     10 0
    //     SWAP [
    //         >R 1 + >R
    //         DUP 1 -
    //         <R <R OVER OVER <
    //     ]@? DROP DROP
    // `);

    let source = new PMMC.Sources.FromString(`
        10
        10 0 DO
            DUP 1 -
        LOOP
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
        "10 9 8 7 6 5 4 3 2 1 0",
        '... got the expected result'
    );

    test.done();
}

Test009();

