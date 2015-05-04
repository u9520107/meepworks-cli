import { cofs } from 'greasebox';
import { tempdir, repos, defaultProjectType } from './config';
import gulp from 'gulp';
import cmd from './cmd';

import {
  detectGit,
  copyRepo
} from './git';
import {
  detectCordova,
  cordovaCreate
} from './cordova';

export default function *init() {
  if(!(cmd.length > 0)) {
    console.log('please specify a project name');
    return;
  }

  let name = cmd.shift();
  let type = cmd.params['-t'] ? cmd.params['-t'].toLowerCase() : defaultProjectType;

  if(yield detectGit()) {
    if((yield cofs.exists(name)) && (yield cofs.readdir(name)).length > 0 ) {
      console.log(`folder "${name}" already exists and is not empty!`);
      return;
    }
    switch(type) {
      case 'isomorphic':
        yield copyRepo('isomorphic', name);
      break;
      case 'cordova':
        yield initCordova(name);
      break;
    }
  }
}

function * initCordova(name) {
  if(yield detectCordova()) {
    yield cordovaCreate(name);
    yield copyRepo('cordova', name);
  }
}


