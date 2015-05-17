#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var kicadFilesToBom = require(__dirname + '/../index.js');
var argv = process.argv;
var programName = path.basename(argv[1]);

if (argv.length < 3) {
    console.error('Usage: %s bom-files.json', programName);
    process.exit(1);
}

var bomFileName = argv[2];
var bomFileContent = fs.readFileSync(bomFileName, {encoding:'utf8'});
var bomFiles = JSON.parse(bomFileContent);
var componentsStatistics = kicadFilesToBom(bomFiles);

var componentStatisticsCsv = componentsStatistics.map(function(componentStatistic) {
    return componentStatistic.join(',');
}).join('\n');

console.log(componentStatisticsCsv);
