'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    newer = require('gulp-newer'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    postcssPartialImport = require('postcss-partial-import'),
    cssbeautify = require('gulp-cssbeautify'),
    concat = require('gulp-concat'),
    uncss = require('gulp-uncss'),
    csscomb = require('gulp-csscomb'),
    unusedImages = require('gulp-unused-images'),
    nunjucks = require('gulp-nunjucks'),
    htmlprettify = require('gulp-html-prettify'),
    htmlmin = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css');

var processors = [
    postcssPartialImport
];


var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        style: 'src/style/*.scss',
        plugin: 'src/style/plugins.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "daze"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});



gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(plumber())
        //.pipe(rigger())
        .pipe(nunjucks.compile())
        .pipe(htmlmin({
            /* preserveLineBreaks:true,*/
            collapseWhitespace: true,
            minifyCSS:true,
            minifyJS:true,
            minifyURLs:true,
            /* removeOptionalTags:true,
             removeRedundantAttributes:true,*/
            removeComments:false
        }))
        .pipe(htmlprettify({indent_char: ' ', indent_size: 4}))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}))
        .pipe(browserSync.stream());
});

gulp.task('js:build', function () {
  /*  gulp.src('bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest(path.build.js));*/
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {



    gulp.src(path.src.style)
        /*.pipe(rigger())*/
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sass({
            includePaths: ['src/style/'],
          /*  outputStyle: 'compressed',*/
            sourceMap: true,
            errLogToConsole: true
        }))
       /* .pipe(uncss({
        html: [path.build.html+'*.html','http://localhost:9000'],
            outtime:2000
        }))*/
        .pipe(cleanCSS({keepBreaks:true}))
        .pipe(prefixer({browsers: ['last 3 version','ie >= 11']}))
      /*  .pipe(csscomb())*/

        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}))
        .pipe(browserSync.stream());


});




gulp.task('image:build', function () {
     gulp.src(path.src.img)
        .pipe(newer(path.build.img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));


});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('image:filter', function () {
    return gulp.src([path.build.img+'**/*', path.build.css+'*.css', path.build.html+'*.html'])
        .pipe(plumber())
        .pipe(unusedImages({}))
        .pipe(plumber.stop());
});




gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });

});


gulp.task('default', ['build', 'webserver', 'watch']);

