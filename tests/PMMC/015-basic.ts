
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test015 () {
    let test = new Test.Simple();
    let dict = new PMMC.Dictionary.Catalog();
    PMMC.Images.createCoreVolume(dict);

    let source = new PMMC.Sources.FromString(`
        ~foo 10 >CELL :=
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

    let expected = [ 10, 50, 60, 50 ];
    for await (const out of interpreter.flow(compiler.flow(parser.flow(tokenizer.flow(source.flow()))))) {
        if (out.fh == PMMC.Types.OutputHandle.STDOUT) {
            test.is(
                out.args[0]?.toNative(),
                expected.shift(),
                `... got the STDOUT output (${JSON.stringify(out)})`
            );
        } else {
            test.ok(!!out, `... got the DEBUG output (${JSON.stringify(out)})`);
        }
    }

    test.done();
}

Test015();

