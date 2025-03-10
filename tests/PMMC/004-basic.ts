
import * as PMMC from '../../src/PMMC';

async function Test004 () {
    let dict   = new PMMC.Dictionary.Catalog();
    PMMC.Images.createCoreVolume(dict);

    let source = new PMMC.Sources.FromString(`
        : plusTen     10 + ;
        : timesTwenty 20 * ;
        1 plusTen timesTwenty 3 -
    `);

    let tokenizer   = new PMMC.Tokenizer();
    let parser      = new PMMC.Parser();
    let compiler    = new PMMC.Compiler(dict);
    let interpreter = new PMMC.Interpreter(dict);

    for await (const input of interpreter.flow(compiler.flow(parser.flow(tokenizer.flow(source.flow()))))) {
        console.log("GOT", input);
    }
}

Test004();

