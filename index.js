var fs = require('fs');
var R = require('ramda');
var kicadBomGenerator = require('kicad-bom-generator');

module.exports = function(bomFiles) {
    var components = [];
    bomFiles.forEach(function(bomFile) {
        var kicadComponents = fs.readFileSync(bomFile.components, {encoding:'utf8'});
        var kicadNetlist = fs.readFileSync(bomFile.netlist, {encoding:'utf8'});
        var newComponents = kicadBomGenerator(kicadComponents, kicadNetlist);
        newComponents.forEach(function(newComponent) {
            newComponent.file = bomFile.name;
        });
        components = components.concat(newComponents);
    });

    components = components.map(function(component) {
        var type = R.uniq([component.libsource.part, component.value, component.component.module]).join(' ');
        return {
            type: type,
            reference: component.ref,
            file: component.file
        };
    });

    var componentTypes = R.uniq(components.map(R.prop('type'))).sort();

    var componentsStatistics = [R.concat(  // Table header
        ['part', 'total QTY'],
        bomFiles.length > 1 ? R.pluck('name', bomFiles).map(R.replace(/(.*)/, '$1 QTY')) : []
    )];

    componentTypes.forEach(function(componentType) {
        componentsStatistics.push([R.concat(
            [
                componentType,
                components.filter(R.propEq('type', componentType)).length
            ],
            bomFiles.length > 1
                ? bomFiles.map(function(bomFile) {
                    return components.filter(R.where({type:componentType, file:bomFile.name})).length
                  })
                : []
        )]);
    });

    return componentsStatistics;
};
