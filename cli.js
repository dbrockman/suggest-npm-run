#!/usr/bin/env node

'use strict';

const meow = require('meow');
const chalk = require('chalk');
const run = require('./index.js');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({ pkg }).notify();

const cli = meow(`
  Usage
    $ suggest-npm-run <cwd>
  Examples
    $ suggest-npm-run
`);

run(cli.input[0]).then(() => {
  process.exit();
}, err => {
  console.error(chalk.bgRed.white.bold('ERROR') + ' ' + err.message);
  process.exit(1);
});
