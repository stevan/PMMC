
export namespace Test {

    export class Simple {
        public num_tests : number = 0;
        public failures  : number = 0;

        ok (got : any, msg : string) : void {
            !!(got) ? this.pass(msg) : this.fail(msg)
        }

        is (got : any, expected : any, msg : string) : void {
            got == expected
                ? this.pass(msg)
                : this.fail(msg, [
                    `  Failed test '${msg}'`,
                    `         got: ${JSON.stringify(got)}`,
                    `    expected: ${JSON.stringify(expected)}`,
                ])
        }

        pass (msg : string, diags? : string[]) : void {
            this.num_tests++;
            console.log(`ok ${this.num_tests} - ${msg}`);
            if (diags) this.diag(diags);
        }

        fail (msg : string, diags? : string[]) : void {
            this.num_tests++;
            this.failures++;
            console.log(`not ok ${this.num_tests} - ${msg}`);
            if (diags) this.diag(diags);
        }

        diag (diags : string[]) : void {
            diags.forEach((s) => console.log(`# ${s}`));
        }

        done () : void {
            console.log(`1..${this.num_tests}`);
            if (this.failures > 0) {
                this.diag([`# Looks like you failed ${this.failures} test of ${this.num_tests}`]);
            }
        }
    }
}
