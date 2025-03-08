
import * as PMMC from '../../src/PMMC';

async function Test008 () {
    let dict   = new PMMC.Dictionary.Catalog();
    dict.addVolume(PMMC.Images.createCoreVolume());

    let source = new PMMC.Sources.FromString(`
        10 [ DUP 1 - DUP 0 != ]@?
        10 [ DUP 0 != [ DUP 2 - ]? ]@?
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

