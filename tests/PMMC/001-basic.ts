
import { Sources }   from '../../src/PMMC/Sources';
import { Tokenizer } from '../../src/PMMC/Tokenizer';

async function Test001 () {
    let source = new Sources.FromArray(
        [
            '"hello world!" say',
            '10 "world" #t',
            'this is the "end" of 10000',

        ]
    );

    let tokenizer = new Tokenizer();

    for await (const input of tokenizer.flow(source.flow())) {
        console.log("GOT", input);
    }
}

Test001();

