import gulp from 'gulp';

export const paths = {
  source: 'source',
  dist: 'dist'
};

export const babelOptions = {
  modules: 'common',
  optional: ['runtime']
};

gulp.task('config', () => {
  console.log(JSON.stringify({
    paths,
    babelOptions
  }, null, 2));
});
