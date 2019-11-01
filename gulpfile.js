const gulp = require('gulp');
const sass = require('gulp-sass');							//sass
const browserSync = require('browser-sync').create();		//runtime watcher and changer
const clean = require('gulp-clean');						//cleaner product directory "dev"
const cleanCSS = require('gulp-clean-css');					//CSS minifier
const rigger = require('gulp-rigger');                      //включение кусков html в другой
const rename = require("gulp-rename");						//rename files after minify
const concat = require('gulp-concat');						//concat for js
const terser = require('gulp-terser');						//minify for js
const autoprefixer = require('gulp-autoprefixer');			//cross-browser compatibility css
const imagemin = require('gulp-imagemin');                  // mini images

const fontsFiles = [					
   		//составляем массив переменних с все файлов шрифтов, для переноса в папку разработки
	'./app/fonts/**.woff',
];

const imgFiles = [
    
    './app/img/**/**.jpg',
    './app/img/**/**.png'
];

const paths = {
    html: {
        
        src: './app/templates/*.html',
        build: './dist/'
    },
    styles: {
        src: './app/scss/**/*.scss',
        build: './dist/css/'
    },
    scripts: {
        src: './app/js/**/*.js',
        build: './dist/js/'
    },
    img: {
        src: './app/img/*',
        build: './dist/img/'
    }
};


function cleandev() {										//модуль отчистки папки перед каждой расспаковкой
    return gulp.src('./dist', {read: false})
        .pipe(clean());
};

function img() {											//модуль переноса картинок
    return gulp.src(imgFiles)
    .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'))
}

function fonts () {											//Copy fonts to dir "dev"
    return gulp.src(fontsFiles)
        .pipe(gulp.dest('./dist/fonts'))
}

function js () {											//Copy fonts to dir "dev"
    return gulp.src('./app/js/*.js')
        .pipe(gulp.dest('./dist/js'))
}

function scripts () {
    
    return gulp.src('./app/js/**/*.js')
        .pipe(terser({											//terser
			toplevel: true
		}))														//minify js
        .pipe(concat('all.js'))									//concat all js files
		.pipe(rename(function (path) {							// function of rename extname for .css
            path.extname = ".min.js";
        }))
        .pipe(gulp.dest('./dist/js'))
		.pipe(browserSync.stream());
}

function html() {
    return gulp.src("./app/templates/index.html")
        .pipe(rigger())
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream());
}


function forSass() {
    return gulp.src('./app/scss/*.scss')
        .pipe(sass())
        .pipe(cleanCSS({level: 2}))								// minifyCSS
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],								// для браузеров которые использует 0.1%
			cascade: false
        }))
        .pipe(rename(function (path) {							// function of rename extname for .css
            path.extname = ".min.css";
        }))
        .pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
}

function watch() {
	browserSync.init({											// инструмент для live reload
		server: {
			baseDir: "./"
		}
	});

	gulp.watch('./app/**/*.scss', forSass);				// ставим watcher для слежения за изменениями в файлах
	gulp.watch('./app/**/*.js', scripts);
}

gulp.task('cleandev', cleandev);
gulp.task('img', img);
gulp.task('scripts', scripts);
gulp.task('sass', forSass);
gulp.task('html', html);
gulp.task('watch', watch);
gulp.task('fonts', fonts);
gulp.task('js', js);
gulp.task('build', gulp.series('cleandev', gulp.parallel(img, fonts, scripts, html, forSass)));
gulp.task('dev', gulp.series('build', watch));