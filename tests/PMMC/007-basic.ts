
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test007 () {
    let test = new Test.Simple();
    let dict = new PMMC.Dictionary.Catalog();
    PMMC.Images.createCoreVolume(dict);

    // let source = new PMMC.Sources.FromString(`
    //         #t [ "YO!" ]? DROP
    //         #f [ "NO!" ]? DROP
    //         #t [ "Hey" ]? ! [ "Ho" ]? DROP
    //         #f [ "Hey" ]? ! [ "Ho" ]? DROP
    //         #f [ "Hey" ]? ! [
    //             #t [ "Hip" ]? DROP
    //             #f [ "Hop" ]? ! [ "-Hop" ~ "Horray" ]? DROP
    //         ]? DROP
    // `);

    let source = new PMMC.Sources.FromString(`
            #t IF "YO!" THEN
            #f IF "NO!" THEN
            #t IF "Hey" ELSE "Ho" THEN
            #f IF "Hey" ELSE "Ho" THEN
            #f IF "Hey" ELSE
                #t IF "Hip" THEN
                #f IF "Hop" ELSE "-Hop" ~ "Horray" THEN
            THEN
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
        "YO! Hey Ho Hip-Hop Horray",
        '... got the expected result'
    );

    test.done();
}

Test007();

