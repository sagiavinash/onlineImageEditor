module.exports = function(grunt) {
  grunt.initConfig({
    "pkg" : grunt.file.readJSON('package.json'),
    "less" : {
      "dev" : {
        "options" : {
          //"sourceMap" : true,
          //"sourceMapFilename" : "style.css.map"
        },
        "files" : {
          "../build/app.css": "../src/app.less"
        }
      }
    },
    "browserify" : {
      "options" : {
        "transform" : [ require('grunt-react').browserify ]
      },
      "client" : {
        "src" : ['../src/app.js'],
        "dest" : '../build/app.js'
      }
    },
    "watch" : {
      "react" : {
        "files" : '../src/**/*.js',
        "tasks" : ['browserify']
      },
      "less" : {
        "files" : ['../src/app.less'],
        "tasks" : ['less:dev'],
      }
    }
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["browserify", "less:dev", "watch:react", "watch:less"]);
};