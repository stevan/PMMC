
import { Images }  from '../../src/PMMC/Images';
import { Sources } from '../../src/PMMC/Sources';
import { Sinks }   from '../../src/PMMC/Sinks';

async function Test003 () {
    //let src = new Sources.REPL();
    let src = new Sources.FromArray(
        [
            `
            : plusTen     10 + ;
            : timesTwenty 20 * ;
            1 plusTen timesTwenty 3 -
            `,
        ]
    );

    let img  = new Images.BaseImage();
    let sink = new Sinks.Console(img.compile().run(src));

    sink.run().then((i) => console.log(i));
}

Test003();

