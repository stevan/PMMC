
import * as PMMC from '../../src/PMMC';

async function Test013 () {
    let dict   = new PMMC.Dictionary.Catalog();
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
        console.log("Expected error: ", e);
    }
}

Test013();

