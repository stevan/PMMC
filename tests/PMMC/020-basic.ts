
import * as PMMC from '../../src/PMMC';

async function Test020 () {
    let image = new PMMC.Images.TestImage();
    await image.run(
        image.fromString(`
            "True is true"   #t ok
            "False is false" #f ! ok

            "True is == True"   #t #t is
            "False is == False" #f #f is

            "1 == 1"   1 1   is
            "10 == 10" 10 10 is

            "'hello' == 'hello'" "hello" "hello" is

            100 >CELL \`$x :=
            "$x == 100" $x 100 is
            $x 200 >CELL!
            "$x != 100" $x 100 != ok
            "$x == 200" $x 200 is

            done-testing
        `),
        image.toConsole()
    );
}

Test020();

