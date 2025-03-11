
import * as PMMC from '../../src/PMMC';

async function Test020 () {
    let dict = new PMMC.Dictionary.Catalog();
    PMMC.Images.createCoreVolume(dict);

    let source = new PMMC.Sources.FromSources([
        new PMMC.Sources.FromFile('./lib/Test.pmmc'),
        new PMMC.Sources.FromString("`Test >IMPORT"),
        new PMMC.Sources.FromString(`
            "True is true"   #t ok
            "False is false" #f ! ok

            "True is == True"   #t #t is
            "False is == False" #f #f is

            done-testing
        `)
    ]);

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

Test020();

