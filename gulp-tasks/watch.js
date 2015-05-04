import gulp from 'gulp';
import co from 'co';
import { cofs } from 'greasebox';
import path from 'path';
import plumber from 'gulp-plumber';
import * as config from './config';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';




const sourceDir = path.resolve(__dirname, `../${config.paths.source}`) + path.sep;
const sourceDirCheck = new RegExp('^' + escapeRegExp(sourceDir.replace('/', '\/')), 'i');
const jsCheck = /\.(js|jsx)$/i;

function escapeRegExp(str) {
  return str.replace(/([.*+?^${}|\[\]\/\\])/g, "\\$1");
}

function isSource(path) {
  return sourceDirCheck.test(path);
}

function isJavascript(path) {
  return jsCheck.test(path);
}


gulp.task('watch', ['build'], () => {
  gulp.watch(`${config.paths.source}/**`)
    .on('change', (change) => {
        if(isSource(change.path) &&
          (change.type === 'renamed' || change.type === 'added' || change.type === 'changed')) {
          if(isJavascript(change.path)) {
            console.log(`building: ${change.path}`);
            co(function * () {
              yield new Promise((resolve) => {
                gulp.src(change.path, {
                  base: sourceDir
                })
                .pipe(plumber({
                  errorHandler: (err) => {
                    console.log(err);
                    resolve();
                  }
                }))
                .pipe(sourcemaps.init())
                .pipe(babel(config.babelOptions))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(config.paths.dist))
                .on('end', () => {
                  if(change.path.indexOf('cli.js') > -1) {
                    let f = path.resolve(__dirname, `../${config.paths.dist}/cli.js`);
                    co(function *() {
                      if(yield cofs.exists(f)) {
                        yield cofs.chmod(f, '0775');
                      }
                    }).then(resolve)
                    .catch(resolve);

                  } else {
                    resolve();
                  }
                });
              });
            });
          } else {
            console.log(`copy: ${change.path}`);
            co(function * () {
              yield new Promise((resolve) => {
                gulp.src(change.path, {
                  base: sourceDir
                })
                .pipe(plumber({
                  errorHandler: (err) => {
                    console.log(err);
                    resolve();
                  }
                }))
                .pipe(gulp.dest(config.paths.dist))
                .on('end', resolve);
              });
            });
          }
        }
    })
    .on('error', console.log);
});
