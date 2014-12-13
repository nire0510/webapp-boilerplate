module.exports = function (grunt) {

  require('grunt-task-loader')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',

    clean: ['build/**/*', '.tmp/**/*'],

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'build/index.html': '.tmp/index.html'
        }
      }
    },

    replace: {
      package: {
        src: 'package.json',
        dest: 'package.json',
        replacements: [{
          from: /\"version\": \"([\d\.]+)\"/g,
          to: function (matchedWord, index, fullText, regexMatches) {   // callback replacement
            return '"version": "' + (parseFloat(regexMatches) + 0.1).toFixed(1) + '"';
          }
        }]
      },
      index: {
        src: 'app/index.html',
        dest: '.tmp/index.html',
        replacements: [{
          from: '<html lang="en" class="no-js">',
          to: '<html lang="en" class="no-js" manifest="my.appcache">'
        }, {
          from: '<title></title>',
          to: '<title><%= pkg.name %></title>'
        }, {
          from: '<meta name="description" content="">',
          to: '<meta name="description" content="<%= pkg.description %>">'
        }, {
          from: '<meta name="apple-mobile-web-app-title" content="">',
          to: '<meta name="apple-mobile-web-app-title" content="<%= pkg.name %>">'
        }]
      }
    },

    copy: {
      tmp2build: {
        files: [
          {
            expand: true,
            cwd: '.tmp',
            src: ['**/*.js', '**/*.css'],
            dest: 'build'
          }
        ]
      },
      app2build: {
        files: [
          {
            expand: true,
            cwd: 'app',
            src: ['favicon.ico', 'images/**/*'],
            dest: 'build'
          }
        ]
      }
    },

    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: '.tmp',
        root: 'app'
      }
    },

    usemin: {
      html: '.tmp/index.html'
    },

    'ftp-deploy': {
      build: {
        auth: {
          host: 'domain.com',
          port: 21,
          authKey: 'key'
        },
        src: 'build/',
        dest: '/public_html/project',
        exclusions: []
      }
    }
  });

  grunt.registerTask('build', [
    'clean',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'replace',
    'usemin',
    'htmlmin',
    'copy:temp2build',
    'copy:app2build'
  ]);

  grunt.registerTask('deploy', ['ftp-deploy']);

};