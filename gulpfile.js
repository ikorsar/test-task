'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const groupmedia = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const argv = require('yargs').argv;
const pug = require('gulp-pug');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const sourcemaps = require('gulp-sourcemaps');
const styleLint = require('gulp-stylelint');
const runSequence = require('run-sequence');
const changed = require('gulp-changed');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');

const host = argv.host || 'localhost';

const jsFiles = ['_src/scripts/*.js', '!_src/scripts/config.js'];
const jsDest = 'media/scripts';

gulp.task('connect', function() {
    connect.server({
        host: host,
        port: 4000,
        livereload: true,
    });
});

gulp.task('buildSvg', function() {
    return gulp
        .src('_src/svg/**/*.svg')
        .pipe(
            svgmin({
                js2svg: {
                    pretty: true,
                },
            })
        )
        .pipe(
            svgSprite({
                mode: {
                    symbol: {
                        sprite: '../../../../media/images/sprite.svg',
                        render: {
                            scss: {
                                dest: '../_sprite.scss',
                                template: '_src/svg/sprite_template.tpl',
                            },
                        },
                    },
                },
            })
        )
        .pipe(gulp.dest('_src/styles/sprite'))
        .pipe(connect.reload());
});

gulp.task('buildHtml', function() {
    gulp.src([
        '_src/pug/**/*.pug',
        '!_src/pug/_parts/*.pug',
        '!_src/pug/data/*.pug',
        '!_src/pug/_layout/*.pug',
    ])
        .pipe(plumber())
        .pipe(
            pug({
                pretty: true,
            })
        )
        .pipe(gulp.dest('./html'))
        .pipe(connect.reload());
});

gulp.task('LintScss', function sassLintTask() {
    return gulp.src('_src/styles/**/*.scss').pipe(
        styleLint({
            configFile: '.stylelintrc',
            failAfterError: false,
            debug: true,
            syntax: 'scss',
            reporters: [
                {
                    formatter: 'string',
                    console: true,
                },
            ],
        })
    );
});

gulp.task('buildCss', function() {
    return gulp
        .src('_src/styles/styles.scss')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(groupmedia())
        .pipe(autoprefixer())
        .pipe(
            cleanCSS({
                compatibility: 'ie8',
                level: {
                    1: {
                        specialComments: 0,
                        removeEmpty: true,
                        removeWhitespace: true,
                    },
                    2: {
                        mergeMedia: true,
                        removeEmpty: true,
                        removeDuplicateFontRules: true,
                        removeDuplicateMediaBlocks: true,
                        removeDuplicateRules: true,
                        removeUnusedAtRules: false,
                    },
                },
            })
        )
        .pipe(
            rename({
                suffix: '.min',
            })
        )
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('media/styles/'))
        .pipe(connect.reload());
});

gulp.task('buildJs', function jsTask() {
    return gulp
        .src('_src/scripts/*.js')
        .pipe(changed('_src/scripts/*.js'))
        .pipe(
            babel({
                presets: ['env'],
            })
        )
        .pipe(gulp.dest('media/scripts/'))
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(connect.reload());
});

gulp.task('min-scripts', function() {
    return gulp
        .src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest));
});

gulp.task('watch', function() {
    gulp.watch(['_src/pug/**/*.pug'], ['buildHtml']);
    gulp.watch(['_src/svg/**/*.svg'], ['buildSvg']);
    gulp.watch('_src/scripts/**/*.js', ['buildJs']);
    gulp.watch('_src/styles/**/*.scss', ['buildCss']);
});

gulp.task('default', function() {
    runSequence('buildSvg', 'buildHtml', 'LintScss', 'buildCss', 'buildJs', [
        'connect',
        'watch',
    ]);
});
