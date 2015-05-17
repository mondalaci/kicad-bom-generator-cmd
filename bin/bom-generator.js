#!/usr/bin/env node

var fs = require('fs');
var kicadFilesToBom = require(__dirname + '/../index.js');

var bomFiles = [
    {
        name: 'left-main',
        netlist: '../left-main/left-main.net',
        components: '../left-main/left-main.cmp'
    },
    {
        name: 'right-main',
        netlist: '../right-main/right-main.net',
        components: '../right-main/right-main.cmp'
    },
    {
        name: 'display',
        netlist: '../display/display.net',
        components: '../display/display.cmp'
    }
];

var componentsStatistics = kicadFilesToBom(bomFiles);

var componentStatisticsCsv = componentsStatistics.map(function(componentStatistic) {
    return componentStatistic.join(',');
}).join('\n');

fs.writeFileSync('bom.csv', componentStatisticsCsv);
