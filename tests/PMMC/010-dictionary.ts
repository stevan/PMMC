
//mport { Types }      from '../../src/PMMC/Types';
import { Dictionary } from '../../src/PMMC/Dictionary';

function Test001 () {

    let dict = new Dictionary.Catalog();

    dict.createVolume('Foo');

    let vol = dict.currentVolume();
    console.log(vol.name);

    vol.createUserWord('foo');
    let word : Dictionary.UserWord = vol.currentWord();
    console.log(word.name);

    console.log(word);

}

Test001();

