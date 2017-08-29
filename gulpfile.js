/**
 * Gulpfile.
 *
 * Gulp with WordPress.
 *
 * Implements:
 *      1. Live reloads browser with BrowserSync.
 *      2. CSS: Sass to CSS conversion, error catching, Autoprefixing, Sourcemaps,
 *         CSS minification, and Merge Media Queries.
 *      3. Js: Concatenates & uglifies Vendor and Custom Js files.
 *      4. Images: Minifies PNG, JPEG, GIF and SVG images.
 *      5. Watches files for changes in CSS or Js.
 *      6. Watches files for changes in PHP.
 *      7. Corrects the line endings.
 *      8. InjectCSS instead of browser page reload.
 *      9. Generates .pot file for i18n and l10n.
 *
 * @author Ahmad Awais (@ahmadawais)
 * @version 1.0.3
 */

/**
 * Configuration.
 *
 * Project Configuration for gulp tasks.
 *
 * In paths you can add <<glob or array of globs>>. Edit the variables as per your project requirements.
 */

// START Editing Project Variables.
// Project related.
var project                 = 'wpshala'; // Project Name.
var projectURL              = 'yanwhite2.dev'; // Project URL. Could be something like localhost:8888.
var productURL              = './'; // Theme/Plugin URL. Leave it like it is, since our gulpfile.js lives in the root folder.

// Translation related.
var text_domain             = 'wpshala'; // Your textdomain here.
var destFile                = 'wpshala.pot'; // Name of the transalation file.
var packageName             = 'wpshala'; // Package name.
var bugReport               = 'https://AhmadAwais.com/contact/'; // Where can users report bugs.
var lastTranslator          = 'Ahmad Awais <your_email@email.com>'; // Last translator Email ID.
var team                    = 'WPTie <your_email@email.com>'; // Team's Email ID.
var translatePath           = './languages' // Where to save the translation files.

// Style related.
var styleSRC                = './assets/css/style.scss'; // Path to main .scss file.
var styleDestination        = './'; // Path to place the compiled CSS file.

// Defualt set to root folder.

// Js Vendor related.
var jsVendorSRC             = './assets/js/vendor/*.js'; // Path to Js vendor folder.
var jsVendorDestination     = './assets/js/'; // Path to place the compiled Js vendors file.
var jsVendorFile            = 'vendors'; // Compiled Js vendors file name.
// Default set to vendors i.e. vendors.js.

// Js Custom related.
var jsCustomSRC             = './assets/js/custom/*.js'; // Path to Js custom scripts folder.
var jsCustomDestination     = './assets/js/'; // Path to place the compiled Js custom scripts file.
var jsCustomFile            = 'custom'; // Compiled Js custom file name.
// Default set to custom i.e. custom.js.

// Bootstrap Style (importing in SASS for now)
// var bootstrapSass           = './node_modules/bootstrap-sass/';
// var bootstrapSassDest       = './';

// Bootstrap Js
// var bootstrapJsSRC          = './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js';
// var bootstrapJsDestination  = './assets/js/';
// var bootstrapJsFile         = 'bootstrap';

// Images related.
var imagesSRC               = './assets/img/raw/**/*.{png,jpg,gif,svg}'; // Source folder of images which should be optimized.
var imagesDestination       = './assets/img/'; // Destination folder of optimized images. Must be different from the imagesSRC folder.

// Watch files paths.
var styleWatchFiles         = './assets/css/**/*.scss'; // Path to all *.scss files inside css folder and inside them.
var vendorJsWatchFiles      = './assets/js/vendor/*.js'; // Path to all vendor Js files.
var customJsWatchFiles      = './assets/js/custom/*.js'; // Path to all custom Js files.
var bootstrapJsWatchFiles   = './assets/js/bootstrap/*.js'; // Path to all bootstrap Js files.
var projectPHPWatchFiles    = './**/*.php'; // Path to all PHP files.


// Browsers you care about for autoprefixing.
// Browserlist https://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
'last 2 version',
'> 1%',
'ie >= 9',
'ie_mob >= 10',
'ff >= 30',
'chrome >= 34',
'safari >= 7',
'opera >= 23',
'ios >= 7',
'android >= 4',
'bb >= 10'
];

// STOP Editing Project Variables.

/**
 * Load Plugins.
 *
 * Load gulp plugins and assign them semantic names.
 */
var gulp         = require('gulp'); // Gulp of-course

// CSS related plugins.
var sass         = require('gulp-sass'); // Gulp pluign for Sass compilation.
var minifycss    = require('gulp-uglifycss'); // Minifies CSS files.
var autoprefixer = require('gulp-autoprefixer'); // Autoprefixing magic.
var mmq          = require('gulp-merge-media-queries'); // Combine matching media queries into one media query definition.

// Js related plugins.
var concat       = require('gulp-concat'); // Concatenates Js files
var uglify       = require('gulp-uglify'); // Minifies Js files
// var bootstrap-sass    = require('bootstrap-sass'); // 

// Image realted plugins.
var imagemin     = require('gulp-imagemin'); // Minify PNG, JPEG, GIF and SVG images with imagemin.

// Utility related plugins.
var rename       = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
var lineec       = require('gulp-line-ending-corrector'); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings)
var filter       = require('gulp-filter'); // Enables you to work on a subset of the original files by filtering them using globbing.
var sourcemaps   = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
var notify       = require('gulp-notify'); // Sends message notification to you
var browserSync  = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var reload       = browserSync.reload; // For manual browser reload.
var wpPot        = require('gulp-wp-pot'); // For generating the .pot file.
var sort         = require('gulp-sort'); // Recommended to prevent unnecessary changes in pot-file.


/**
 * Task: `copy-assets`.
 *
 * Grab pkgd js files from node_modules
 *
 */

gulp.task('copy-assets', function () {
  return gulp.src([
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
    './node_modules/imagesloaded/imagesloaded.pkgd.min.js',
    './node_modules/isotope-layout/dist/isotope.pkgd.min.js'

  ])
  
  .pipe(gulp.dest('./assets/js/'));
});


/**
 * Task: `browser-sync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 *
 * This task does the following:
 *    1. Sets the project URL
 *    2. Sets inject CSS
 *    3. You may define a custom port
 *    4. You may want to stop the browser from openning automatically
 */

 gulp.task( 'browser-sync', function() {
  browserSync.init( {

    // For more options
    // @link http://www.browsersync.io/docs/options/

    // Project URL.
    proxy: projectURL,

    // `true` Automatically open the browser with BrowserSync live server.
    // `false` Stop the browser from automatically opening.
    open: false,

    // Inject CSS changes.
    // Comment it to reload browser for every CSS change.
    injectChanges: true,

    // Use a specific port (instead of the one auto-detected by Browsersync).
    // port: 7000,

  } );
});


/**
 * Task: `styles`.
 *
 * Compiles Sass, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source scss file
 *    2. Compiles Sass to CSS
 *    3. Writes Sourcemaps for it
 *    4. Autoprefixes it and generates style.css
 *    5. Renames the CSS file with suffix .min.css
 *    6. Minifies the CSS file and generates style.min.css
 *    7. Injects CSS or reloads the browser via browserSync
 */
 
 gulp.task('styles', function () {
  gulp.src( styleSRC )
  .pipe( sourcemaps.init() )
  .pipe( sass( {
    errLogToConsole: true,
    outputStyle: 'compact',
      //outputStyle: 'compressed',
      // outputStyle: 'nested',
      // outputStyle: 'expanded',
      precision: 10
    } ) )
  .on('error', console.error.bind(console))
  .pipe( sourcemaps.write( { includeContent: false } ) )
  .pipe( sourcemaps.init( { loadMaps: true } ) )
  .pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )

  .pipe( sourcemaps.write ( styleDestination ) )
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( styleDestination ) )

    .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files
    .pipe( mmq( { log: true } ) ) // Merge Media Queries only for .min.css version.

    .pipe( browserSync.stream() ) // Reloads style.css if that is enqueued.

    .pipe( rename( { suffix: '.min' } ) )
    .pipe( minifycss( {
      maxLineLen: 10
    }))
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( styleDestination ) )

    .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files
    .pipe( browserSync.stream() )// Reloads style.min.css if that is enqueued.
    .pipe( notify( { message: 'TASK: "styles" Completed! 💯', onLast: true } ) )
  });


 /**
  * Task: `vendorJs`.
  *
  * Concatenate and uglify vendor Js scripts.
  *
  * This task does the following:
  *     1. Gets the source folder for Js vendor files
  *     2. Concatenates all the files and generates vendors.js
  *     3. Renames the Js file with suffix .min.js
  *     4. Uglifes/Minifies the Js file and generates vendors.min.js
  */

  gulp.task( 'vendorsJs', function() {
    gulp.src( jsVendorSRC )
    .pipe( concat( jsVendorFile + '.js' ) )
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( jsVendorDestination ) )
    .pipe( rename( {
      basename: jsVendorFile,
      suffix: '.min'
    }))
    .pipe( uglify() )
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( jsVendorDestination ) )
    .pipe( notify( { message: 'TASK: "vendorsJs" Completed! 💯', onLast: true } ) );
  });


 /**
  * Task: `customJs`.
  *
  * Concatenate and uglify custom Js scripts.
  *
  * This task does the following:
  *     1. Gets the source folder for Js custom files
  *     2. Concatenates all the files and generates custom.js
  *     3. Renames the Js file with suffix .min.js
  *     4. Uglifes/Minifies the Js file and generates custom.min.js
  */

  gulp.task( 'customJs', function() {
    gulp.src( jsCustomSRC )
    .pipe( concat( jsCustomFile + '.js' ) )
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( jsCustomDestination ) )
    .pipe( rename( {
      basename: jsCustomFile,
      suffix: '.min'
    }))
    .pipe( uglify() )
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( jsCustomDestination ) )
    .pipe( notify( { message: 'TASK: "customJs" Completed! 💯', onLast: true } ) );
  });


/**
  * Task: `bootstrapJs`.
  *
  * Concatenate and uglify custom Js scripts.
  *
  * This task does the following:
  *     1. Gets the source folder for Js custom files
  *     2. Concatenates all the files and generates custom.js
  *     3. Renames the Js file with suffix .min.js
  *     4. Uglifes/Minifies the Js file and generates custom.min.js
  */

 // gulp.task( 'bootstrapJs', function() {
 //    gulp.src( bootstrapJsSRC )
 //    .pipe( concat( bootstrapJsFile + '.js' ) )
 //    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
 //    .pipe( gulp.dest( bootstrapJsDestination ) )
 //    .pipe( rename( {
 //      basename: bootstrapJsFile,
 //      suffix: '.min'
 //    }))
 //    .pipe( uglify() )
 //    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
 //    .pipe( gulp.dest( bootstrapJsDestination ) )
 //    .pipe( notify( { message: 'TASK: "bootstrapJs" Completed! 💯', onLast: true } ) );
 // });


 // var bsConfig = require("gulp-bootstrap-configurator");

 // gulp.task('make-bootstrap-css', function(){
 //  return gulp.src("./config.json")
 //    .pipe(bsConfig.css())
 //    .pipe(gulp.dest("./assets"));
 //    // It will create `bootstrap.css` in directory `assets`. 
 // });

 // // For Js 
 // gulp.task('make-bootstrap-js', function(){
 //  return gulp.src("./config.json")
 //    .pipe(bsConfig.js())
 //    .pipe(gulp.dest("./assets"));
 //    // It will create `bootstrap.js` in directory `assets`. 
 // });


 /**
  * Task: `images`.
  *
  * Minifies PNG, JPEG, GIF and SVG images.
  *
  * This task does the following:
  *     1. Gets the source of images raw folder
  *     2. Minifies PNG, JPEG, GIF and SVG images
  *     3. Generates and saves the optimized images
  *
  * This task will run only once, if you want to run it
  * again, do it with the command `gulp images`.
  */

  gulp.task( 'images', function() {
    gulp.src( imagesSRC )
    .pipe( imagemin( {
      progressive: true,
          optimizationLevel: 3, // 0-7 low-high
          interlaced: true,
          svgoPlugins: [{removeViewBox: false}]
        } ) )
    .pipe(gulp.dest( imagesDestination ))
    .pipe( notify( { message: 'TASK: "images" Completed! 💯', onLast: true } ) );
  });


 /**
  * WP POT Translation File Generator.
  *
  * * This task does the following:
  *     1. Gets the source of all the PHP files
  *     2. Sort files in stream by path or any custom sort comparator
  *     3. Applies wpPot with the variable set at the top of this file
  *     4. Generate a .pot file of i18n that can be used for l10n to build .mo file
  */

  gulp.task( 'translate', function () {
   return gulp.src( projectPHPWatchFiles )
   .pipe(sort())
   .pipe(wpPot( {
     domain        : text_domain,
     destFile      : destFile,
     package       : packageName,
     bugReport     : bugReport,
     lastTranslator: lastTranslator,
     team          : team
   } ))
   .pipe(gulp.dest(translatePath))
   .pipe( notify( { message: 'TASK: "translate" Completed! 💯', onLast: true } ) )

 });


 /**
  * Watch Tasks.
  *
  * Watches for file changes and runs specific tasks.
  */
 // gulp.task( 'default', ['styles', 'vendorsJs', 'customJs', 'images', 'browser-sync'], function () {
  gulp.task( 'default', ['styles', 'vendorsJs', 'customJs', 'copy-assets'], function () {
  gulp.watch( projectPHPWatchFiles, reload ); // Reload on PHP file changes.
  gulp.watch( styleWatchFiles, [ 'styles' ] ); // Reload on SCSS file changes.
  gulp.watch( vendorJsWatchFiles, [ 'vendorsJs', reload ] ); // Reload on vendorsJs file changes.
  gulp.watch( customJsWatchFiles, [ 'customJs', reload ] ); // Reload on customJs file changes.
  // gulp.watch( bootstrapJsWatchFiles, [ 'bootstrapJs', reload ] ); // Reload on bootstrapJs file changes.
});
