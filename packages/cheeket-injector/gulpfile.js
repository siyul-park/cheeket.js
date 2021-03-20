const gulp = require('gulp');
const ts = require('gulp-typescript');

const tsProject = ts.createProject(
  process.env.NODE_ENV ? `tsconfig.${process.env.NODE_ENV.toLowerCase()}.json` : 'tsconfig.json'
);

gulp.task('default', () => {
  return tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest('dist')
    );
});

