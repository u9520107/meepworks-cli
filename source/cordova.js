import cp from 'child_process';
import { cofs } from 'greasebox';
import co from 'co';
import path from 'path';

export function * detectCordova() {
  //detect git
  try {
    cp.execSync('which cordova');
    return true;
  } catch (err) {
    console.log('cordova command not found!');
    return false;
  }
}

export function *cordovaCreate(name) {
  yield new Promise((resolve, reject) => {
    cp.spawn('cordova', ['create', name], {
      stdio: 'inherit'
    }).on('exit', resolve)
      .on('error', reject);
  });
  yield cordovaRename(name);
}

function *cordovaRename(name) {
  let cf = path.resolve(process.cwd(), name, 'config.xml');
  if(yield cofs.exists(cf)) {
    let configString = ( yield cofs.readFile(cf) ).toString();
    configString = configString.replace('<name>HelloCordova</name>', `<name>${name}</name>`);
    yield cofs.writeFile(cf, configString, 'utf8');
  }
}

