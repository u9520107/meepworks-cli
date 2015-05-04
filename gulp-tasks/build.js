import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import gulp from 'gulp';
import { cofs, rm } from 'greasebox';
import co from 'co';
import path from 'path';
import { paths, babelOptions } from './config'


gulp.task('clean', (cb) => {
  rm(path.resolve(__dirname, `../${paths.dist}`))
    .then(cb)
    .catch(cb);
});

gulp.task('build', ['clean'], (cb) => {
  gulp.src(`${paths.source}/**`)
    .pipe(sourcemaps.init())
    .pipe(babel(babelOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist))
    .on('end', () => {
      co(function *() {
        if(yield cofs.exists(path.resolve(__dirname, `../${paths.dist}/cli.js`))) {
          yield cofs.chmod(path.resolve(__dirname, `../${paths.dist}/cli.js`), '0775');
        }
      }).then(cb)
      .catch(cb);
    })
    .on('error', cb);
});

gulp.task('build-dist', ['clean'], (cb) => {
  gulp.src(`${paths.source}/**`)
    .pipe(babel(babelOptions))
    .pipe(gulp.dest(`${paths.dist}`))
    .on('end', () => {
      co(function *() {
        if(yield cofs.exists(path.resolve(__dirname, `../${paths.dist}/cli.js`))) {
          yield cofs.chmod(path.resolve(__dirname, `../${paths.dist}/cli.js`), '0775');
        }
      }).then(cb)
      .catch(cb);
    })
    .on('error', cb);
});
