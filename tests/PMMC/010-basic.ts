
import * as PMMC from '../../src/PMMC';

async function Test009 () {
    let dict   = new PMMC.Dictionary.Catalog();
    dict.addVolume(PMMC.Images.createCoreVolume());

    let source = new PMMC.Sources.FromString(`
        : EGGSIZE // ( n -- )
            [
                DUP 18 < [  "reject"      ]? @^
                DUP 21 < [  "small"       ]? @^
                DUP 24 < [  "medium"      ]? @^
                DUP 27 < [  "large"       ]? @^
                DUP 30 < [  "extra large" ]? @^
                            "error"
            ]+
        ;

        // : EGGSIZE // ( n -- )
        //         DUP 18 < [  "reject"      ]? ! [
        //             DUP 21 < [  "small"       ]? ! [
        //                 DUP 24 < [  "medium"      ]? ! [
        //                     DUP 27 < [  "large"       ]? ! [
        //                         DUP 30 < [  "extra large" ]? ! [ "error" ]?
        //                     ]? DROP
        //                 ]? DROP
        //             ]? DROP
        //         ]? DROP
        // ;

        // : EGGSIZE
        //        DUP 18 < IF  "reject"      ELSE
        //        DUP 21 < IF  "small"       ELSE
        //        DUP 24 < IF  "medium"      ELSE
        //        DUP 27 < IF  "large"       ELSE
        //        DUP 30 < IF  "extra large" ELSE
        //           "error"
        //        THEN THEN THEN THEN THEN SWAP DROP ;

        10  EGGSIZE
        19  EGGSIZE
        22  EGGSIZE
        25  EGGSIZE
        29  EGGSIZE
        31  EGGSIZE
    `);

    let tokenizer   = new PMMC.Tokenizer();
    let parser      = new PMMC.Parser();
    let compiler    = new PMMC.Compiler(dict);
    let interpreter = new PMMC.Interpreter(dict);
    let output      = new PMMC.Sinks.Console();

    for await (const input of compiler.flow(parser.flow(tokenizer.flow(source.flow())))) {
        console.log("GOT", input);
    }
    console.log('----------------------------');

    // console.log(
    //     (((dict.lookup('EGGSIZE')?.body as PMMC.Tapes.CompiledTape)
    //         .compiled[0] as PMMC.Types.Loop)
    //             .tape as PMMC.Tapes.CompiledTape)
    //                 .compiled
    // );

    await output.flow(
            interpreter.flow(
                compiler.flow(
                    parser.flow(
                        tokenizer.flow(
                            source.flow())))));
}

Test009();

