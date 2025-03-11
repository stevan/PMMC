
import * as PMMC from '../../src/PMMC';

async function Test015 () {
    let dict   = new PMMC.Dictionary.Catalog();
    PMMC.Images.createCoreVolume(dict);

    let source = new PMMC.Sources.FromString(
    " 10 >CELL `foo := "+ // create the cell called foo
    `
        foo DUP >PUT!               // print it
        DUP 5 * >CELL!              // operate and store the result
        foo >PUT!                   // print it again (value is updated)

        foo 10 + >PUT!              // access, operate, and print
        foo >PUT!                   // print it (it is unchanged)
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

Test015();

