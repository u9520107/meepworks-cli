#!/usr/bin/env node

import cp from 'child_process';
import co from 'co';
import { cofs } from 'greasebox';
import chalk from 'chalk';
import help from './help';
import init from './init';
import { tempdir } from './config';

import cmd from './cmd';

co(function * () {

  if(!(yield cofs.exists(tempdir))) {
    yield cofs.mkdir(tempdir);
  }

  //determine command
  if(cmd.length === 0 || cmd.params['-h']) {
    yield help();
  } else {
    switch(cmd.shift()) {
      case 'init':
        yield init();
        break;
      default:
        yield help();
      break;
    }
  }

}).catch((err) => {
  console.log(err);
});

