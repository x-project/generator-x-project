'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var path = require('path');
var merge = require('merge');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.option('answers');
  },

  initializing: function () {
    this.answers = this.options.answers;
  },

  prompting: function () {
    var done = this.async();
    var destinationPath = this.destinationRoot();

    var prompts = [
      {
        type: 'confirm',
        name: 'header',
        message: 'Would you like to add a ' + chalk.blue('header') + ' to each page?',
        default: true
      },
      {
        type: 'confirm',
        name: 'footer',
        message: 'Would you like to add a ' + chalk.blue('footer') + ' to each page?',
        default: true
      },
      {
        type: 'checkbox',
        name: 'pages',
        message: 'Which ' + chalk.blue('pages') + ' do you want to add, alongside the homepage?',
        choices: [
          'page-about',
          'page-privacy',
          'page-contact',
        ],
        default: [
          'page-contact'
        ]
      }
    ];

    this.prompt(prompts, function (answers) {
      // to access answers later use:
      //   this.answers.header;
      //   this.answers.footer;
      //   ...
      answers.pages = answers.pages.map(function (page) {
        return {
          name: page,
          label: page.replace('page-', ''),
          inHeader: true,
          inFooter: true
        }
      });
      this.answers = merge(this.answers, answers);

      // save answers
      this.config.set(answers);
      this.config.save();

      done();
    }.bind(this));
  },

  writing: {
    elements: function () {
      var tmpl = function (item) {
        var name = item.name ? item.name : item;
        var path = 'public/client/' + name + '/' + name + '.html';
        this.fs.copyTpl(
          this.templatePath(path),
          this.destinationPath(path),
          this.answers
        );
      }

      var elements = [
        'app-boot',
        'app-theme',
        'app-page',
        'page-home',
        'part-jumbotron'
      ];

      // part-header
      if (this.answers.header) {
        elements.push('part-header');
      }

      // part-footer
      if (this.answers.footer) {
        elements.push('part-footer');
      }

      // selected elements
      elements.forEach(tmpl, this)

      // user selected pages
      this.answers.pages.forEach(tmpl, this);
    },

    index: function () {
      this.fs.copy(
        this.templatePath('public/index.html'),
        this.destinationPath('public/index.html')
      );
    }

  }
});
