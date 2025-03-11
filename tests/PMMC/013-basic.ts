
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test013 () {
    let test = new Test.Simple();
    let dict = new PMMC.Dictionary.Catalog();
    PMMC.Images.createCoreVolume(dict);

    // symbol table manipulation
    let source = new PMMC.Sources.FromString("\
        [ 10 0 ] `foo :=                      \
        foo                                   \
        [ 10000 100 ] `foo :=                 \
        foo                                   \
        `foo :^                               \
        foo                                   \
    ");

    let tokenizer   = new PMMC.Tokenizer();
    let parser      = new PMMC.Parser();
    let compiler    = new PMMC.Compiler(dict);
    let interpreter = new PMMC.Interpreter(dict);
    let output      = new PMMC.Sinks.Console();

    try {
        await output.flow(
                interpreter.flow(
                    compiler.flow(
                        parser.flow(
                            tokenizer.flow(
                                source.flow())))));
    } catch (e) {
        test.pass("... got the expected error");
    }

    test.is(
        interpreter.stack.toNative().join(" "),
        "10 0 10000 100",
        '... got the expected result'
    );

    test.done();
}

Test013();

