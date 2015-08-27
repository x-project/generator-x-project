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
    var hasHeader = this.config.get('header');
    var hasFooter = this.config.get('footer');

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the doozie ' + chalk.red('x-project:page') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What is the ' + chalk.blue('name') + ' of your brand new page?',
      default: 'test'
      // validate: ... TO DO
    }];

    if (hasHeader) {
      prompts.push({
        type: 'confirm',
        name: 'header',
        message: 'Would you like to add a link to the new page in the ' + chalk.blue('header') + '?',
        default: true
      });
    }

    if (hasFooter) {
      prompts.push({
        type: 'confirm',
        name: 'footer',
        message: 'Would you like to add a link to the new page in the ' + chalk.blue('footer') + '?',
        default: true
      });
    }

    this.prompt(prompts, function (props) {
      // to access props later use:
      //   this.props.page;
      this.props = props;

      // merge general and generator-specific props

      // - appname
      props.appname = this.config.get('appname');

      // - pages
      props.pages = this.config.get('pages') || [];
      props.pages.push({
        name: 'page-' + props.name,
        label: props.name,
        inHeader: props.header,
        inFooter: props.footer
      });
      this.config.set('pages', props.pages);

      // ensure props consistency
      this.config.save();

      done();
    }.bind(this));
  },

  writing: {
    page: function () {
      this.conflicter.force = true;
      var name = this.props.name;

      var fromPath = 'elements/page-x/page-x.html';
      var toPath = 'elements/page-' + name + '/page-' + name + '.html';

      var bootToPath = 'elements/app-boot/app-boot.html'
      var bootFromPath = '../../app/templates/' + bootToPath;

      var headerToPath = 'elements/part-header/part-header.html'
      var headerFromPath = '../../app/templates/' + headerToPath;

      var footerToPath = 'elements/part-footer/part-footer.html'
      var footerFromPath = '../../app/templates/' + footerToPath;



      this.fs.copyTpl(
        this.templatePath(fromPath),
        this.destinationPath(toPath),
        this.props
      );

      this.fs.copyTpl(
        this.templatePath(bootFromPath),
        this.destinationPath(bootToPath),
        this.props
      );

      if (this.props.header) {
        this.fs.copyTpl(
          this.templatePath(headerFromPath),
          this.destinationPath(headerToPath),
          this.props
        );
      }

      if (this.props.footer) {
        this.fs.copyTpl(
          this.templatePath(footerFromPath),
          this.destinationPath(footerToPath),
          this.props
        );
      }
    }
  },

  install: function () {
    this.installDependencies();
  }
});
