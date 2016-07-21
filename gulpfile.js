var gulp = require('gulp');

gulp.task('buildjs', function (cb) {
  var Builder = require('systemjs-builder');
  var builder = new Builder("./","systemjs.config.js");

  builder.reset();

  builder.buildStatic("app", "dist/app.min.js", {minify: true})
    .then(console.log("finished"))
  .catch(function(err) {
    console.log(err);
    cb(err);
  });
});