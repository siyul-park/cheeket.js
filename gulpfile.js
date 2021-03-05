const gulp = require('gulp');
const gulpif = require('gulp-if');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');

const tsProject = ts.createProject(
  process.env.NODE_ENV ? `tsconfig.${process.env.NODE_ENV.toLowerCase()}.json` : 'tsconfig.json'
);

gulp.task('build', () => {
  return tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest('dist'));
});

gulp.task('uglify', () => {
  return gulp.src('dist/**/*.js')
    .pipe(gulpif(process.env.NODE_ENV === 'production', uglify()))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('build', 'uglify'));
