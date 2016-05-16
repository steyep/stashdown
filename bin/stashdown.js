#!/usr/bin/env node
var requirejs = require('requirejs');
var path = require('path');
var program = require('commander');
var server = require('../lib/server');

program
  .version('v1.0.0');

program
  .command('new', null, {isDefault: true})
  .description('Create a Markdown file from scratch')
  .action(function(){
    server.start();
  });

program
  .command('edit [file]')
  .description('Edit a Markdown file')
  .action(function(file){
    if (!file) {
      console.log('No file supplied!');
    }
    server.start(file);
  });

program
  .command('stop')
  .description('Shutdown a running server instance')
  .action(function(){
    server.stop();
  });

program.parse(process.argv);

if (program.args.length === 0) {
  server.start();
}