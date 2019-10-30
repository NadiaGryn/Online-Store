const gulp = require('gulp'); //Gulp
const sass = require('gulp-sass');  //sass
const browserSync =  require('browser-sync').create();//живая перезагрузка после изменения файла(ов)
const uglify = require('gulp-uglify');//минификация js
const cleanCSS = require('gulp-clean-css');//минификация css
const clean = require('gulp-clean');// чистка файлов перед buildом
const concat = require('gulp-concat');//объединяет несколько файлов в один
const sourcemaps = require('gulp-sourcemaps'); //карта источников файла после их конкатенации, чтобы легче править код.
const imagemin = require('gulp-imagemin'); ////оптимизация изображений
const autoprefixer = require('gulp-autoprefixer'); //обеспечивают поддержку браузерами CSS3 свойств и автоматически ее проставляет




// const path = {
//     app: {
//         html:   'src/index.html',
//         js:     'src/js/**/*.js',
//         styles: 'src/scss/**/*.scss',
//         img:    'src/img/**/*.*',
//     },
//     dist: {
//         html:   'dist',
//         js:     'dist/js',
//         styles: 'dist/css',
//         img:    'dist/images',
//     },
//     clean: 'dist/*'
// }

gulp.task('clean', function(){                          //очистка папки dist
    return gulp.src('/dist', {read: false})
        .pipe(clean());
});

gulp.task('html', function () {
    return gulp.src('./app/index.html')
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});



gulp.task('sass', function () {                     //компиляция scss файлов в css
    return gulp.src('./app/scss/*.scss')
        // .pipe(sourcemaps.init())
        .pipe(sass())  //из scss в .css
        .pipe(autoprefixer({                        //добавление вендорных префиксов к CSS свойствам для поддержки последних нескольких версий каждого из браузеров
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(cleanCSS())             //минификация css
        .pipe(concat('style.min.css'))  //конкатенация
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'))  
        .pipe(browserSync.stream());
});

gulp.task('uglify', function () {
    gulp.src('./app/js/**/*.js')
    //   .pipe(concat('main.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js'))
      .pipe(browserSync.stream());
}); // объединяем файлы JS в один, минифицируем, записываем в dist

gulp.task('imagemin', function () {  //минифицирует изображения
    return gulp.src('./app/img/*')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }]
        }))
        .pipe(gulp.dest('./dist/img'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function(){
    gulp.watch('app/scss/**/*.*', gulp.series('sass'));
    gulp.watch('app/img/**/*.*', gulp.series('imagemin'));
    gulp.watch('app/js/**/*.js', gulp.series('uglify'));
    gulp.watch('app/*.html', gulp.series('html'));
});




gulp.task('serve', function () {
    browserSync.init({
        
            server: {
                baseDir: "app/"
            }
        })
        
    })                                  //запускаем статический сервер и на нем содержимое папки 'dist'
    browserSync.watch('dist/**/*.*').on('change', browserSync.reload); //броузерсинковский вотчер следит за файлами 'dist/**/*.*' и при событии 'change' вызывает функцию reload, которой в качестве аргумента будет передан путь к изменненному файлу




// gulp.task('build', gulp.series('clean', gulp.series(sass, uglify, imagemin)));
// gulp.task('dev', gulp.series('build', watch));


gulp.task('default', gulp.series('serve', function(){
    console.log('=== ALL DONE ===')
  }));
  
  

