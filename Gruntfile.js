module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            css: {
                files: ['assets/css/*.scss'],
                tasks: ['sass', 'concat', 'cssmin'],
                options: {
                    livereload: true,
                }
            },
            script: {
                files: ['assets/js/*.js'],
                tasks: ['concat', 'uglify']
            }
        },
        sass: {
            css: {
                src: 'assets/css/main.scss',
                dest: 'assets/css/main.css',
                options: {
                    style: 'expanded'
                }
            }
        },
        concat: {
            css: {
                src: 'node_modules/bootstrap/dist/css/bootstrap*.min.css',
                dest: 'assets/bootstrap/bootstrap.main.min.css'
            },
            script: {
                files: {
                    'assets/bootstrap/bootstrap.main.min.js': 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
                    'assets/js/main.js': 'assets/js/_*.js'
                }
            }
        },
        cssmin: {
            css: {
                src: 'assets/css/main.css',
                dest: 'assets/css/main.min.css'
            }
        },
        uglify: {
            script: {
                src: 'assets/js/main.js',
                dest: 'assets/js/main.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['sass', 'concat', 'cssmin', 'uglify']);
};