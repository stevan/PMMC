
import * as PMMC from '../../src/PMMC';

async function Test007 () {
    let dict   = new PMMC.Dictionary.Catalog();
    dict.addVolume(PMMC.Images.createCoreVolume());

    let source = new PMMC.Sources.FromString(`
            #t [ "YO!" ]? DROP
            #f [ "NO!" ]? DROP
            #t [ "Hey" ]? ! [ "Ho" ]? DROP
            #f [ "Hey" ]? ! [ "Ho" ]? DROP
            #f [ "Hey" ]? ! [
                #t [ "Hip" ]? DROP
                #f [ "Hop" ]? ! [ "-Hop" ~ "Horray" ]? DROP
            ]? DROP
    `);

    let tokenizer   = new PMMC.Tokenizer();
    let parser      = new PMMC.Parser();
    let compiler    = new PMMC.Compiler(dict);
    let interpreter = new PMMC.Interpreter(dict);
    let output      = new PMMC.Sinks.Console();

    await output.flow(
            interpreter.flow(
                compiler.flow(
                    parser.flow(
                        tokenizer.flow(
                            source.flow())))));
}

Test007();

