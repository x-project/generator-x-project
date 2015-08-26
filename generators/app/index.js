'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

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
      name: 'name',
      message: 'What is the ' + chalk.blue('name') + ' of your brand new application?',
      // validate: ... TO DO
      default: defaultAppName
    }, {
      type: 'input',
      name: 'version',
      message: 'What is the ' + chalk.blue('version') + ' of your application?',
      // validate: ... TO DO
      default: '0.0.1'
    },
    {
      type: 'confirm',
      name: 'header',
      message: 'Would you like to add a ' + chalk.blue('header') + ' to each page?',
      default: true
    }, {
      type: 'confirm',
      name: 'footer',
      message: 'Would you like to add a ' + chalk.blue('footer') + ' to each page?',
      default: true
    }, {
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
    }];

    this.prompt(prompts, function (props) {
      // to access props later use:
      //   this.props.header;
      //   this.props.footer;
      //   ...
      this.props = props;

      // save props
      this.config.set(props);
      this.config.save();

      done();
    }.bind(this));
  },

  configuring: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this.props
      );

      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        this.props
      );

      this.fs.copy(
        this.templatePath('_bowerrc'),
        this.destinationPath('.bowerrc')
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    }
  },

  writing: {
    elements: function () {
      var tmpl = function (el_name) {
        var path = 'elements/' + el_name + '/' + el_name + '.html';
        this.fs.copyTpl(
          this.templatePath(path),
          this.destinationPath(path),
          this.props
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
      if (this.props.header) {
        elements.push('part-header');
      }

      // part-footer
      if (this.props.footer) {
        elements.push('part-footer');
      }

      // selected elements
      elements.forEach(tmpl, this)

      // user selected pages
      this.props.pages.forEach(tmpl, this);
    },

    index: function () {
      this.fs.copy(
        this.templatePath('index.html'),
        this.destinationPath('index.html')
      );
    }

  },

  install: function () {
    this.installDependencies();
  }
});
