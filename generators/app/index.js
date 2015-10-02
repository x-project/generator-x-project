'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

var files = {
  to_template: [
    'bower.json',
    'package.json',
    'README.md'
  ],
  to_copy: [
    '.bowerrc',
    '.editorconfig',
    '.gitignore',
    '.jshintignore',
    '.jshintrc',
    '.npmignore'
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
  prompting: function () {
    var done = this.async();
    var destinationPath = this.destinationRoot();
    var defaultAppName = destinationPath.split(path.sep).pop();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the doozie ' + chalk.red('x-project') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'appname',
      message: 'What is the ' + chalk.blue('name') + ' of your brand new application?',
      // validate: ... TO DO
      default: defaultAppName
    }, {
      type: 'input',
      name: 'version',
      message: 'What is the ' + chalk.blue('version') + ' of your application?',
      // validate: ... TO DO
      default: '0.0.1'
    }, {
      type: 'input',
      name: 'description',
      message: 'Leave a short ' + chalk.blue('description') + ' of your application',
      // validate: ... TO DO
      default: 'Another awesome x-project based application.'
    }];

    this.prompt(prompts, function (answers) {
      // to access answers later use:
      //   this.answers.appname;
      //   this.answers.version;
      //   ...
      this.answers = answers;

      // save answers
      this.config.set(answers);
      this.config.save();

      this.composeWith('app:client', {
        options: {answers: answers}
      },
      {
        local: require.resolve('./client.js'),
        link: 'strong'
      });

      this.composeWith('app:server', {
        options: {answers: answers}
      },
      {
        local: require.resolve('./server.js'),
        link: 'strong'
      });

      done();
    }.bind(this));
  },

  configuring: {
    app: function () {
      files.to_template.forEach(tmpl, this);
    },

    projectfiles: function () {
      files.to_copy.forEach(cpy, this);
    }
  },

  writing: {},

  install: function () {
    this.installDependencies();
  }
});
