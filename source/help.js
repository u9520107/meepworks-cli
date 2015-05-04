import dedent from './dedent';

export default function *help() {
  console.log(dedent`
              meepworks-cli
              ==============
              commands:
              ---------
                help
                init
                upgrade
              `);
}
