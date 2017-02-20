'use strict';

const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const readPkg = require('read-pkg');
const inquirer = require('inquirer');

module.exports = run;

function run(cwd) {
  cwd = cwd ? path.resolve(process.cwd(), cwd) : process.cwd();
  return getPkg(cwd).then(pkg => {
    return inquirer.prompt([{
      type: 'list',
      name: 'script',
      message: 'Select a script to run',
      choices: getChoices(pkg && pkg.scripts || {}),
    }]).then(answers => {
      return execa.shell(answers.script, { cwd: cwd, stdio: 'inherit' });
    });
  });
}

function getPkg(cwd) {
  return readPkg(cwd).catch(err => {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  })
}

function getChoices(scripts) {
  const names = Object.keys(scripts);
  if (names.length === 0) {
    return [
      {
        name: 'init ' + chalk.gray('create a package.json'),
        value: 'npm init .',
      },
      {
        name: 'init -y ' + chalk.gray('yes to all'),
        value: 'npm init . -y',
      },
    ];
  }
  return names.map(name => {
    return {
      name: name + ' ' + chalk.gray(scripts[name]),
      value: 'npm run ' + name,
    };
  });
}
