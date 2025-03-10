
import * as PMMC from '../../src/PMMC';

async function Test013 () {
    let dict   = new PMMC.Dictionary.Catalog();
    dict.addVolume(PMMC.Images.createCoreVolume());

    // symbol table manipulation
    let source = new PMMC.Sources.FromString("\
        [ 10 0 ] `foo :=                      \
        foo                                   \
        [ 10000 100 ] `foo :=                 \
        foo                                   \
    ");

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

Test013();

