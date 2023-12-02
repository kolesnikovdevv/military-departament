const { src, dest, parallel, watch } = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const fileInclude = require("gulp-file-include");
const svgmin = require("gulp-svgmin");
const sprite = require("gulp-svg-sprite");
const bulk = require("gulp-sass-bulk-importer");
const prefixer = require("gulp-autoprefixer");
const clean = require("gulp-clean-css");
const map = require("gulp-sourcemaps");

const sourceFiles = "build";

function styles() {
  return src("src/scss/**/*.scss", "!src/components/**/*.scss")
    .pipe(map.init())
    .pipe(bulk())
    .pipe(
      scss({
        outputStyle: "compressed",
      }).on("error", scss.logError)
    )
    .pipe(
      prefixer({
        overrideBrowserslist: ["last 8 versions"],
        browsers: [
          "Android >= 4",
          "Chrome >= 20",
          "Firefox >= 24",
          "Explorer >= 11",
          "iOS >= 6",
          "Opera >= 12",
          "Safari >= 6",
        ],
      })
    )
    .pipe(clean({ level: 2 }))
    .pipe(concat("style.min.css"))
    .pipe(map.write("../sourcemaps/"))
    .pipe(fileInclude())
    .pipe(dest(sourceFiles + "/css"))
    .pipe(browserSync.stream());
}

function browserSyncF() {
  browserSync.init({
    server: {
      baseDir: "build/",
    },
  });
}

function svgSprite() {
  return src("src/svg/**/*.svg")
    .pipe(
      svgmin({
        plugins: [
          {
            removeComments: true,
          },
          {
            removeEmptyContainers: true,
          },
        ],
      })
    )
    .pipe(
      sprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(dest("src/images"));
}

function html() {
  return src("src/*.html", "src/**/*.html", "!src/components/**/*.html")
    .pipe(fileInclude())
    .pipe(dest(sourceFiles))
    .pipe(browserSync.stream());
}

function img() {
  return src(["src/images/**/*.{gif,jpg,png,svg,ico}"]).pipe(
    dest(sourceFiles + "/images")
  );
}

function watching() {
  watch(["src/scss/**/*.scss", "**/*.scss"], styles, browserSync.reload);
  watch(["src/*.html"], html, browserSync.reload);
  watch(["src/images/**/*.{gif,jpg,png,svg,ico}"], img, browserSync.reload);
  watch(["src/svg/**/*.svg"], svgSprite, browserSync.reload);
  watch(["src/components/**/*.html"], html, browserSync.reload);
}

function vendorJS() {
  // const modules = [];
  // return src(modules).pipe(dest("build/js"));
}

function vendorCSS() {
  // const modules = [];
  // return src(modules).pipe(dest("build/css"));
}

exports.default = parallel(
  styles,
  html,
  img,
  browserSyncF,
  watching,
  svgSprite
);

exports.build = parallel(styles, html, img);
