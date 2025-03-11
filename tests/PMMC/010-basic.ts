
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test010 () {
    let test = new Test.Simple();
    let dict = new PMMC.Dictionary.Catalog();
    PMMC.Images.createCoreVolume(dict);

    let source = new PMMC.Sources.FromString(`
        // ---------------------------------------------------------------------
        //
        // ---------------------------------------------------------------------

        : EGGSIZE // ( n -- )
            BEGIN
                DUP 18 < IF "reject"      THEN/BREAK
                DUP 21 < IF "small"       THEN/BREAK
                DUP 24 < IF "medium"      THEN/BREAK
                DUP 27 < IF "large"       THEN/BREAK
                DUP 30 < IF "extra large" THEN/BREAK
                            "error"
            END
        ;

        // : EGGSIZE // ( n -- )
        //     [
        //         DUP 18 < [  "reject"      ]? [^]?
        //         DUP 21 < [  "small"       ]? [^]?
        //         DUP 24 < [  "medium"      ]? [^]?
        //         DUP 27 < [  "large"       ]? [^]?
        //         DUP 30 < [  "extra large" ]? [^]?
        //                     "error"
        //     ]+
        // ;

        // ---------------------------------------------------------------------
        // Decompiled IF/THEN/ELSE
        // ---------------------------------------------------------------------
        // : EGGSIZE // ( n -- )
        //         DUP 18 < [  "reject"      ]? ! [
        //             DUP 21 < [  "small"       ]? ! [
        //                 DUP 24 < [  "medium"      ]? ! [
        //                     DUP 27 < [  "large"       ]? ! [
        //                         DUP 30 < [  "extra large" ]? ! [ "error" ]?
        //                     ]? DROP
        //                 ]? DROP
        //             ]? DROP
        //         ]? DROP
        // ;

        // ---------------------------------------------------------------------
        // IF/THEN/ELSE version
        // ---------------------------------------------------------------------
        // : EGGSIZE
        //        DUP 18 < IF  "reject"      ELSE
        //        DUP 21 < IF  "small"       ELSE
        //        DUP 24 < IF  "medium"      ELSE
        //        DUP 27 < IF  "large"       ELSE
        //        DUP 30 < IF  "extra large" ELSE
        //           "error"
        //        THEN THEN THEN THEN THEN SWAP DROP ;

        10  EGGSIZE
        19  EGGSIZE
        22  EGGSIZE
        25  EGGSIZE
        29  EGGSIZE
        31  EGGSIZE

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
        "10 reject 19 small 22 medium 25 large 29 extra large 31 error",
        '... got the expected result'
    );

    test.done();
}

Test010();

