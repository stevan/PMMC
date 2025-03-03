
import { Types }  from '../../src/PMMC/Types';
import { Sources } from '../../src/PMMC/Sources';

import { Tokenizer } from '../../src/PMMC/Tokenizer';

async function Test001 () {
    let stream = new Tokenizer(
        new Sources.FromArray(
            [
                '"hello world!" say',
                '10 "world" #t',
                'this is the "end" of 10000',

            ] as Types.Source[]
        )
    );

    for await (const input of stream.flow()) {
        console.log("GOT", input);
    }
}

Test001();

