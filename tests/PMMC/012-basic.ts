
import { Test } from '../Test';

import * as PMMC from '../../src/PMMC';

async function Test012 () {
    let test = new Test.Simple();
    let dict = new PMMC.Dictionary.Catalog();
    PMMC.Images.createCoreVolume(dict);

    let source = new PMMC.Sources.FromString(`
        :: HTML
        : ---- "!!PUSHMARK!!" ;
        : ==== BEGIN ~ OVER ---- == UNTIL SWAP DROP ;

        : <html>   "<html>"  ; : </html>  "</html>"  ;
        : <head>   "<head>"  ; : </head>  "</head>"  ;
        : <body>   "<body>"  ; : </body>  "</body>"  ;

        : <title>  "<title>" ; : </title> "</title>" ;
        : <title/> <title> SWAP </title> ;

        : <h1> "<h1>" ; : </h1> "</h1>" ;
        : <h1/> <h1> SWAP </h1> ;

        : <ul> "<ul>" ; : </ul> "</ul>" ;
        : <li> "<li>" ; : </li> "</li>" ;
        : <li/> <li> SWAP </li> ;
        ;;
    `+
    " ~HTML >IMPORT "
    +`
        ----
        <html>
           <head>
               "Hello World" <title/>
           </head>
           <body>
               "Hello HTML!" <h1/>
                ----
                <ul>
                    4 0 DO .R <li/> LOOP
                </ul>
                ====
           </body>
        </html>
        ====
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

    test.is(
        interpreter.stack.toNative().join(" "),
        "<html><head><title>Hello World</title></head><body><h1>Hello HTML!</h1><ul><li>1</li><li>2</li><li>3</li><li>4</li></ul></body></html>",
        '... got the expected result'
    );

    test.done();
}

Test012();

