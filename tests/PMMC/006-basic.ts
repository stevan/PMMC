
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test006 () {
    let test  = new Test.Simple();
    let image = new PMMC.Images.Image();

    await image.run(
        image.fromString(`
            : plusTen     10 + ;
            : timesTwenty 20 * ;
            1 plusTen timesTwenty 3 -
        `),
        image.toConsole()
    );

    test.is(
        image.interpreter.stack.pop()?.toNative(),
        217,
        '... got the expected result'
    );

    test.done();
}

Test006();

