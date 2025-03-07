
import { Sources }     from '../../src/PMMC/Sources';
import { Dictionary }  from '../../src/PMMC/Dictionary';
import { Tokenizer }   from '../../src/PMMC/Tokenizer';
import { Parser }      from '../../src/PMMC/Parser';
import { Compiler }    from '../../src/PMMC/Compiler';
import { Interpreter } from '../../src/PMMC/Interpreter';
import { Images }      from '../../src/PMMC/Images';

async function Test004 () {
    let dict   = new Dictionary.Catalog();
    dict.addVolume(Images.createCoreVolume());

    let source = new Sources.FromArray(
        [
            `
            : plusTen     10 + ;
            : timesTwenty 20 * ;
            1 plusTen timesTwenty 3 -
            `,
        ]
    );

    let tokenizer   = new Tokenizer();
    let parser      = new Parser();
    let compiler    = new Compiler(dict);
    let interpreter = new Interpreter(dict);

    for await (const input of interpreter.flow(compiler.flow(parser.flow(tokenizer.flow(source.flow()))))) {
        console.log("GOT", input);
    }
}

Test004();

