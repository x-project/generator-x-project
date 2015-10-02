'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var merge = require('merge');

var files = {
  to_template: [
    'server/config.json',
    'server/datasources.json'
  ],
  to_copy: [
   'server/boot/authentication.js',
   'server/boot/explorer.js',
   'server/boot/rest-api.js',
   'server/boot/root.js',
   'server/middleware.json',
   'server/model-config.json',
   'server/server.js'
  ]
};

var tmpl = function (filename) {
  this.fs.copyTpl(
    this.templatePath(filename),
    this.destinationPath(filename),
    this.answers
  );
};

var cpy = function (filename) {
  this.fs.copy(
    this.templatePath(filename),
    this.destinationPath(filename)
  );
};


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
        type: 'input',
        name: 'port',
        message: 'Which ' + chalk.blue('port') + ' would you like to bind?',
        default: 3000
      }
    ];

    this.prompt(prompts, function (answers) {
      // to access answers later use:
      //   this.answers.port;
      //   ...

      this.answers = merge(this.answers, answers);

      // save answers
      this.config.set(answers);
      this.config.save();

      done();
    }.bind(this));
  },

  writing: {
    server: function () {
      files.to_template.forEach(tmpl, this);
      files.to_copy.forEach(cpy, this);
    }

  }
});
