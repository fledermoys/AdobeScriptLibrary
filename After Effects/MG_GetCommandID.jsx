//returns the command ID of a menu item to further use it in one of your scripts.
//replace the "New Comp from Selection" with the name of the menu item you want to get the command ID of.
//the returned command can then be run with app.executeCommand(commandID);
alert(app.findMenuCommandId("New Comp from Selection"));