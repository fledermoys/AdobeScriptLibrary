//created by Max Grünwald
//LinkedIn: https://www.linkedin.com/in/max-grünwald-437692225/
//Behance: https://www.behance.net/maxgr

// This script will reset all layer names in the active composition to their source names.
// This script is useful for cleaning up layer names after a project has been worked on for a while.


if (app.project && app.project.activeItem && app.project.activeItem instanceof CompItem) {
    var comp = app.project.activeItem;
    app.beginUndoGroup("Reset Layer Names");

    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        layer.name = ""; // Delete the current name to reset to source name
    }
    app.endUndoGroup();
} else {
    alert("Please select a composition.");
}