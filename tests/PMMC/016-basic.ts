
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test016 () {
    let test  = new Test.Simple();
    let image = new PMMC.Images.Image();

    await image.run(
        image.fromString(`
            ~$foo 10 :=

            $foo
        `),
        image.toConsole(false)
    );

    let cell : PMMC.Literals.Cell = image.interpreter.stack.pop() as PMMC.Literals.Cell;
    test.is(
        cell.value,
        10,
        '... got the expected result'
    );

    test.done();
}

Test016();

