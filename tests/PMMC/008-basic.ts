
import * as PMMC from '../../src/PMMC';

async function Test008 () {
    let dict   = new PMMC.Dictionary.Catalog();
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
}

Test008();

