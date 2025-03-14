
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test011 () {
    let test = new Test.Simple();
    let dict = new PMMC.Dictionary.Catalog();
    PMMC.Images.createCoreVolume(dict);

    let source = new PMMC.Sources.FromString(`

        // ----------------------------------------
        // manually controlled loop
        // ----------------------------------------
        // will only run once, unless next [+]?
        // is called and can be exited at any
        // time via last [^]?
        // ----------------------------------------
        : countdown
            BEGIN
                1 -
                DUP 2 % 0 != [+]?  // next unless even
                    DUP 0 == [^]?  // last if 0
                      DUP #t [+]?  // otherwise next
            END
        ;

        // ----------------------------------------
        // equivalent to this
        // ----------------------------------------
        // : countdown
        //     BEGIN
        //         1 -
        //         DUP 2 % 0 == IF DUP THEN
        //         DUP 0 ==
        //     UNTIL DROP
        // ;

        10 countdown

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
        "8 6 4 2 0",
        '... got the expected result'
    );

    test.done();
}

Test011();

