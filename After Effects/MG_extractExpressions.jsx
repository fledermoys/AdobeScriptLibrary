var project = app.project;
if (!project) {
    alert("No project open.");
} else {
    // Use project file name if available.
    var projectName = project.file ? project.file.name : "untitled project";
    var expressions = {}; // key: expression, value: array of metadata objects
    var projectPath = project.file ? project.file.path : Folder.myDocuments.fsName;
    var outputFile = new File(projectPath + "/ExtractedExpressions_" + projectName + ".jsx");

    function scanProperties(prop, context) {
        if (prop.canSetExpression && prop.expression) {
            var expr = prop.expression;
            // Determine effect info if available.
            var effectName = "";
            if (prop.parentProperty && prop.parentProperty.matchName === "ADBE Effect Parade") {
                effectName = prop.parentProperty.name;
            }
            if (!expressions[expr]) expressions[expr] = [];
            expressions[expr].push({
                property: prop.name,
                effect: effectName,
                layer: context.layer,
                comp: context.comp,
                project: context.project
            });
        }
        // Traverse children if they exist.
        if (prop.numProperties) {
            for (var i = 1; i <= prop.numProperties; i++) {
                scanProperties(prop.property(i), context);
            }
        }
    }

    function extractExpressionsFromComp(comp) {
        for (var i = 1; i <= comp.numLayers; i++) {
            var layer = comp.layer(i);
            // Build context for this layer.
            var context = {
                layer: layer.name,
                comp: comp.name,
                project: projectName
            };
            scanProperties(layer, context);
        }
    }

    for (var i = 1; i <= project.numItems; i++) {
        var item = project.item(i);
        if (item instanceof CompItem) {
            extractExpressionsFromComp(item);
        }
    }

    if (outputFile.open("w")) {
        outputFile.writeln("// Extracted Expressions\n");
        // Iterate over each unique expression.
        for (var expr in expressions) {
            var meta = expressions[expr][0]; // Use the first occurrence only.
            var divider = "//-------- in \"" + meta.project + "\"; from comp:\"" + meta.comp + "\"; layer:\"" + meta.layer + "\"";
            if(meta.effect) {
                divider += "; effect:\"" + meta.effect + "\"";
            }
            divider += "; property:\"" + meta.property + "\" --------";
            outputFile.writeln(divider);
            outputFile.writeln(expr.replace(/\n/g, "\n") + "\n");
        }
        outputFile.close();
        alert("Expressions extracted to: " + outputFile.fsName);
    } else {
        alert("Failed to write file.");
    }
}
