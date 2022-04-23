module.exports = function(grunt) {
    grunt.initConfig({

        watch: {
            css: {
                files: ['assets/css/*.scss'],
                tasks: ['sass', 'concat', 'cssmin'],
                options: {
                    livereload: true,
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'node_modules/bootstrap/scss/bootstrap.css': 'node_modules/bootstrap/scss/bootstrap.scss',
                    'node_modules/bootstrap/scss/bootstrap-grid.css': 'node_modules/bootstrap/scss/bootstrap-grid.scss',
                    'node_modules/bootstrap/scss/bootstrap-reboot.css': 'node_modules/bootstrap/scss/bootstrap-reboot.scss',
                    'node_modules/bootstrap/scss/bootstrap-utilities.css': 'node_modules/bootstrap/scss/bootstrap-utilities.scss',
                    'assets/css/main.css': 'assets/css/main.scss'
                },
                options: {
                    style: 'expanded'
                }
            }
        },
        concat: {
            dist: {
                src: 'node_modules/bootstrap/scss/bootstrap*.css',
                dest: 'assets/css/bootstrap.main.css'
            }
        },
        cssmin: {
            dist: {
                files: {
                    'assets/css/bootstrap.main.min.css': 'assets/css/bootstrap.main.css',
                    'assets/css/main.min.css': 'assets/css/main.css'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['sass', 'concat', 'cssmin']);
};