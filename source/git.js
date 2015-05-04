import cp from 'child_process';
import co from 'co';
import gulp from 'gulp';
import { cofs } from 'greasebox';
import { tempdir, repos, gitSettings } from './config';
import path from 'path';
import chalk from 'chalk';

export function * detectGit() {
  //detect git
  try {
    cp.execSync('which git');
    return true;
  } catch (err) {
    console.log('git command not found!');
    return false;
  }
}

export function * copyRepo(repo, name) {
  if(!repos[repo]) {
    console.log('repo is not recognized!');
    return;
  }
  let dir = `${tempdir}/${repos[repo].split('/').pop()}`;

  if(!(yield cofs.exists(dir))) {
    yield clone(repo);
  } else {
    console.log(`pulling ${repo}`);
      yield new Promise((resolve, reject) => {
        //git pull
        cp.spawn('git', ['pull', `${gitSettings.protocol}/${repos[repo]}`], {
          stdio: 'inherit',
          cwd: dir
        }).on('exit', resolve)
        .on('error', reject);
      });
  }
  console.log(`copying ${repo}`);

  yield new Promise((resolve, reject) => {
    gulp.src([`${dir}/**`, `!${dir}/.git`, `!${dir}/.git/**`])
      .pipe(gulp.dest(name))
      .on('end', resolve)
      .on('error', reject);
  });

  yield renamePackage(name);

  console.log('complete');

}

function * clone(repo) {
  console.log(`cloning ${repo}`);
  yield new Promise((resolve, reject) => {
    cp.spawn('git', ['clone', `${gitSettings.protocol}/${repos[repo]}`], {
      stdio: 'inherit',
      cwd: tempdir
    }).on('end', resolve)
      .on('error', reject);
  });
}

function * renamePackage(name) {
  let cf = path.resolve(process.cwd(), name, 'package.json');
  let json =  JSON.parse(yield cofs.readFile(cf));
  json.name = name;
  yield cofs.writeFile(cf, JSON.stringify(json, null, 2), 'utf8');
}
