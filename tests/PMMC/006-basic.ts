
import * as PMMC from '../../src/PMMC';

async function Test006 () {
    let image = new PMMC.Images.Image();

    await image.run(
        image.fromString(`
            : plusTen     10 + ;
            : timesTwenty 20 * ;
            1 plusTen timesTwenty 3 -
        `),
        image.toConsole()
    );
}

Test006();

