
import * as PMMC from '../../src/PMMC';

async function Test001 () {
    let source = new PMMC.Sources.FromArray(
        [
            '"hello world!" say',
            '10 "world" #t',
            'this is the "end" of 10000',
        ]
    );

    let tokenizer = new PMMC.Tokenizer();

    for await (const input of tokenizer.flow(source.flow())) {
        console.log("GOT", input);
    }
}

Test001();

