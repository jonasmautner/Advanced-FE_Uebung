module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            css: {
                files: ['assets/css/*.scss'],
                tasks: ['concat', 'sass', 'cssmin'],
                options: {
                    livereload: true,
                }
            },
            script: {
                files: ['assets/js/*.js'],
                tasks: ['concat', 'uglify']
            }
        },
        concat: {
            css: {
                src: 'assets/css/_*.scss',
                dest: 'assets/css/main.scss'
            },
            script: {
                files: {
                    'assets/bootstrap/bootstrap.main.min.js': 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
                    'assets/js/main.js': 'assets/js/_*.js'
                }
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
        },
        imagemin: {
            dynamic: {
                files: [{
                    cwd: './assets/images/src/',
                    expand: true,
                    src: ['**/*.{png,jpg}'],
                    dest: './assets/images/dest/',
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.registerTask('default', ['concat', 'sass', 'cssmin', 'uglify', 'imagemin']);
};
