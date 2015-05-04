
const cmd = [];

let argv = Array.prototype.map.call(process.argv, arg => arg);

cmd.bin =  argv.shift();
cmd.program = argv.shift();
cmd.params = {};

while(argv.length > 0) {
  let token = argv.shift();
  if(token === 'help' || token === '-h') {
    cmd.params['-h'] = true;
  } else if(token[0] === '-'){
    if(!(argv.length > 0)) {
      throw new Error('invalid arguments');
    }
    cmd.params[token] = argv.shift();
  } else {
    cmd.push(token);
  }
}

export default cmd;
