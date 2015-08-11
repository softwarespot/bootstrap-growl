
module.exports = function(grunt) {

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        // watch for changes and trigger compass, jshint, uglify and livereload
        watch: {
            js: {
                files: ['jquery.bootstrap-growl.js'],
                tasks: ['uglify','jshint'],
                options: {
                    livereload: true,
                },
            }
        },

        // uglify to concat & minify
        uglify: {
            js: {
                files: {
                    'jquery.bootstrap-growl.min.js': 'jquery.bootstrap-growl.js',
                },
                options: {
                    compress: {
                        comparisons: true,
                        conditionals: true,
                        dead_code: true,
                        drop_console: true,
                        unsafe: true,
                        unused: true
                    }
                }
            }
        },

        jshint: {
            all: ['jquery.bootstrap-growl.js'],
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                notypeof: true,
                undef: true,
                browser: true,
                globals: {
                  jQuery: true,
                  '$': true
                }
            }
        }

    });

    // register task
    grunt.registerTask('default', ['watch']);
};
