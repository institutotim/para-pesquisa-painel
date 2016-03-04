'use strict';

var
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    ngConstant = require('gulp-ng-constant'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglifyjs'),
    del = require('del');

var env = process.env;
var isProduction = env.NODE_ENV === 'production';

if (!env.API_URL) {
    env.API_URL = 'REPLACE_API_ENDPOINT';
}

if (!env.API_VERSION) {
    env.API_VERSION = 'REPLACE_API_VERSION';
}

gulp.task('clean', function (cb) {
    return del([
        'app/dist/**/*.*',
        'app/dist/**'
    ], cb);
});

gulp.task('hint', ['clean'], function () {
    return gulp.src(['./app/js/**/*.js', 'gulpfile.js']).
        pipe(jshint()).
        pipe(jshint.reporter('default'));
});

gulp.task('config', function () {
    return gulp.src('./app/config.json').pipe(ngConstant({
        name: 'uppSocial',
        deps: [
            'uppSocial.filters',
            'uppSocial.services',
            'uppSocial.directives',
            'uppSocial.controllers',
            'ngCookies',
            'ngRoute',
            'ui.date',
            'angularFileUpload',
            'infinite-scroll',
            'pascalprecht.translate'
        ],
        wrap: 'commonjs',
        constants: {
            apiInfo: {
                url: env.API_URL,
                version: env.API_VERSION
            }
        }
    })).
    pipe(gulp.dest('./app/js/'));
});

gulp.task('copyDepsAndDistFiles', ['config'], function () {

    gulp.src('./app/lib/angularjs-file-upload/FileAPI.flash.swf').
        pipe(gulp.dest('./app/dist/js'));

    gulp.src('./app/lib/angularjs-file-upload/FileAPI.min.js').
        pipe(gulp.dest('./app/dist/js'));

    gulp.src('./app/fonts/*.*').
        pipe(gulp.dest('./app/dist/fonts'));

    gulp.src('./app/lib/tinymce/themes/modern/theme.min.js').
        pipe(rename('theme.js')).
        pipe(gulp.dest('./app/dist/js/themes/modern/'));

    gulp.src('./app/lib/tinymce/skins/**').
        pipe(gulp.dest('./app/dist/js/skins'));

    gulp.src('./config/tinymce/**').
        pipe(gulp.dest('./app/dist/js'));

    //Adicionando todas as dependencias no dist.
    gulp.src('./app/index.html').
        pipe(gulp.dest('./app/dist'));

    gulp.src('./app/partials/**').
        pipe(gulp.dest('./app/dist/partials'));

    gulp.src('./app/i18n/**').
        pipe(gulp.dest('./app/dist/i18n'));

    gulp.src('./app/lib/jquery-ui/themes/**').
        pipe(
        gulp.dest('./app/dist/lib/jquery-ui/themes/'));

    gulp.src('./app/csv-model-en.csv').
        pipe(gulp.dest('./app/dist'));

    gulp.src('./app/csv-model-pt.csv').
        pipe(gulp.dest('./app/dist'));

    return gulp.src('./app/img/**').pipe(gulp.dest('./app/dist/img'));
});

gulp.task('minify-css', function () {
    return gulp.src('./app/css/*.css').
        pipe(minifyCss()).
        pipe(rename('upp-social.min.css')).
        pipe(gulp.dest('./app/dist/css/'));
});

gulp.task('browserify', ['copyDepsAndDistFiles', 'minify-css'], function () {
    var bundleName = isProduction ? 'upp-social.js' :
                     'upp-social-bundle.js';
    return gulp.src('./app/js/app.js').
        pipe(browserify({
            insertGlobals: true,
            debug: !isProduction,
            shim: {
                angular: {
                    path: './app/lib/angular/angular.js',
                    exports: 'angular',
                    depends: {
                        jQuery: '$'
                    }

                },
                angularTranslate: {
                    path: './app/lib/angular-translate/angular-translate.js',
                    exports: 'angularTranslate',
                    depends: {
                        angular: 'angular'
                    }
                },
                angularTranslateLocalStorage: {
                    path: './app/lib/angular-translate-storage-local/' +
                           'angular-translate-storage-local.js',
                    exports: 'angularTranslateStorageLocal',
                    depends: {
                        angularTranslate: 'angularTranslate'
                    }
                },
                angularTranslateCookieStorage: {
                    path: './app/lib/angular-translate-storage-cookie/' +
                           'angular-translate-storage-cookie.js',
                    exports: 'angularTranslateStorageCookie',
                    depends: {
                        angularTranslate: 'angularTranslate'
                    }
                },
                angularTranslateLoaderPartial: {
                    path: './app/lib/angular-translate-loader-partial/' +
                           'angular-translate-loader-partial.js',
                    exports: 'angularTranslateLoaderPartial',
                    depends: {
                        angularTranslate: 'angularTranslate'
                    }
                },
                ngCookies: {
                    path: './app/lib/angular-cookies/angular-cookies.js',
                    exports: 'ngCookies',
                    depends: {
                        angular: 'angular'
                    }
                },
                ngRoute: {
                    path: './app/lib/angular-route/angular-route.js',
                    exports: 'ngRoute',
                    depends: {
                        angular: 'angular'
                    }
                },
                fileUpload: {
                    path: './app/lib/angularjs-file-upload/' +
                           'angular-file-upload.js',
                    exports: 'angularFileUpload',
                    depends: {
                        angular: 'angular'
                    }
                },

                bootstrap: {
                    path: './app/lib/bootstrap/dist/js/bootstrap.js',
                    exports: '$',
                    depends: {
                        jQuery: '$'
                    }
                },

                jQuery: {
                    path: './app/lib/jquery/dist/jquery.js',
                    exports: '$'
                },

                jQueryUi: {
                    path: './app/lib/jquery-ui/jquery-ui.js',
                    exports: '$',
                    depends: {
                        jQuery: '$'
                    }
                },

                uiDate: {
                    path: './app/lib/angular-ui-date/src/date.js',
                    exports: 'uiDate',
                    depends: {
                        angular: 'angular'
                    }
                },
                ngInfiniteScroll: {
                    path: './app/lib/ngInfiniteScroll/build/' +
                           'ng-infinite-scroll.js',
                    exports: 'infiniteScroll',
                    depends: {
                        angular: 'angular'
                    }
                },
                NProgress: {
                    path: './app/lib/nprogress/nprogress.js',
                    exports: 'NProgress'
                },
                tinymce: {
                    path: './app/lib/tinymce/tinymce.min.js',
                    exports: 'tinymce'
                }
            }
        })).
        pipe(concat(bundleName)).
        pipe(gulp.dest('./app/dist/js'));
});

gulp.task('minify-js', ['browserify'], function () {
    gulp.src('./app/dist/js/upp-social.js').
        pipe(uglify('upp-social-bundle.js', {
                 outSourceMap: false
             })).
        pipe(gulp.dest('./app/dist/js/'));
});

var tasks = [];

if (isProduction) {
    tasks.push('minify-js');
} else {
    tasks.push('browserify');
}

gulp.task('default', tasks);

