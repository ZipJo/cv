/* ################ */
/* ### Includes ### */
/* ################ */

const gulp = require('gulp');
const browserSync = require('browser-sync');
const connect = require('gulp-connect-php');
const rename = require('gulp-rename');
const filter = require('gulp-ignore');
const minifyInline = require('gulp-minify-inline');
const htmlmin = require('gulp-htmlmin');
const fileinclude = require('gulp-file-include');
const sftp = require('gulp-sftp-up4');



/* ################# */
/* ### Variables ### */
/* ################# */

let developmentFolder = 'src';
let productionFolder = 'dist';
let moveFiles = [
			'*.png',
			'*.ico',
			'*.svg',
			'*.ttf',
			'*.woff',
			'*.woff2',
];


/* ############# */
/* ### Tasks ### */
/* ############# */

// -----------------
// development-tasks
// -----------------

//resolve index_dev file-includes
gulp.task('fileinclude', function() {
	return gulp.src(developmentFolder+"/index_dev.html")
		.pipe(rename("index.html"))
		.pipe(fileinclude())
		.pipe(gulp.dest(developmentFolder)); 
});

//start server
gulp.task('serve', function() {
	connect.server({
		base: developmentFolder,
		port: 4000,
		stdio: 'ignore'
	}, function (){
		browserSync({
			proxy: 'localhost:4000'
		});
	});
});

//reload browser
gulp.task('reload', function(done){
	browserSync.reload();
	done();
});

//change-watchers
gulp.task('watch', function() {
	gulp.watch(developmentFolder+'/index_*.html', gulp.series('fileinclude','reload'));
});

//main dev task -  compile stuff and start server and watchers
gulp.task('dev',
	gulp.series(
		gulp.parallel('fileinclude'),
		gulp.parallel('watch','serve')
	)
);

// ------------------------
// push to production-tasks
// ------------------------

//push all web-files, together with (files & inline) minified css and js dependencies to production 
gulp.task('compile-index', function () {
	return gulp.src(developmentFolder+"/index.html")
		.pipe(minifyInline())
		.pipe(gulp.dest(productionFolder))
});

gulp.task('minify-index', function() {
	return gulp.src(productionFolder+'/index.html')
		.pipe(htmlmin({
			removeComments: true,
			removeEmptyAttributes: true,
			collapseWhitespace: true
		}))
		.pipe(gulp.dest(productionFolder))
});

//push files to production
gulp.task('move', function(){
	return gulp.src(developmentFolder+'/**', { dot: true })
		.pipe(filter.include(moveFiles))
		.pipe(gulp.dest(productionFolder))
});

//main build task
gulp.task('build', gulp.series('compile-index', 'minify-index', 'move'));

// ------------
// upload-tasks
// ------------

let sftpParams = {
	host: 'jonas-brueggen.de',
	remotePath: '/cv.jonas-brueggen.de/httpdocs/',
	auth: 'connectionParams'
};

gulp.task('sftp', function () {
	return gulp.src(productionFolder+"/**", { dot: true })
		.pipe(sftp(sftpParams));
});

gulp.task('build-sftp', gulp.series('build', 'sftp'));
