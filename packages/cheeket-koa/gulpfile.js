const fs = require('fs');
const path = require("path");

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');
const changed = require('gulp-changed');
const merge = require('deepmerge');

function getTsconfigName() {
  if (!process.env.NODE_ENV) return 'tsconfig.json';

  const specificConfig = `tsconfig.${process.env.NODE_ENV.toLowerCase()}.json`;
  if (fs.existsSync(specificConfig)) {
    return specificConfig;
  }

  return 'tsconfig.json';
}

function getFinalTsConfig(config, currentPath) {
  const { extends: parentConfigPath, ...rest } = config;

  if (parentConfigPath) {
    const finalParentConfigPath = path.join(currentPath, parentConfigPath);
    const parentProject = ts.createProject(finalParentConfigPath);

    const parentConfig = getFinalTsConfig(parentProject.rawConfig, parentProject.projectDirectory);
    return merge(parentConfig, rest);
  }
  return rest;
}

function getTsconfig(tsProject) {
  return getFinalTsConfig(tsProject.rawConfig, tsProject.projectDirectory);
}

const tsProject = ts.createProject(getTsconfigName());
const tsconfig = getTsconfig(tsProject);

function compile() {
  const useSourcemaps = tsconfig.compilerOptions.sourceMap;

  return tsProject.src()
    .pipe(changed(tsconfig.compilerOptions.outDir, { extension: '.js' }))
    .pipe(gulpif(useSourcemaps, sourcemaps.init()))
    .pipe(tsProject())
    .pipe(gulpif(useSourcemaps, sourcemaps.write('.')))
    .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
}

function compression() {
  const isProduction = process.env.NODE_ENV === 'production';

  return gulp.src(path.join(tsconfig.compilerOptions.outDir, '**/*.js'))
    .pipe(changed(tsconfig.compilerOptions.outDir, { extension: '.js' }))
    .pipe(gulpif(isProduction, sourcemaps.init()))
    .pipe(gulpif(isProduction, uglify({ compress: { awaits: false } })))
    .pipe(gulpif(isProduction, sourcemaps.write('.')))
    .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
}

const build = gulp.series(compile, compression);

function watch() {
  gulp.watch(tsconfig.include, build);
}

exports.watch = watch
exports.default = build;
