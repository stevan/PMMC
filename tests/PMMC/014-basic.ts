
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test014 () {
    let test = new Test.Simple();
    let dict = new PMMC.Dictionary.Catalog();
    PMMC.Images.createCoreVolume(dict);

    let source = new PMMC.Sources.FromString(`
        : /reduce
            0 DO
                ROT SWAP RDUP >[+]
            LOOP
            SWAP DROP
        ;

        [ 4 3 2 1 ] >[+]
        [ + ] 0 4 /reduce
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
        interpreter.stack.pop().toNative(),
        10,
        '... got the expected result'
    );

    test.done();
}

Test014();

