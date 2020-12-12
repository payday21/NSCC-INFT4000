//imports
const path = require('path');
const url = require('url');

//deconstruct imports
const { app, BrowserWindow, Menu, ipcMain } = require('electron');

//variables for windows
let mainWindow;
let addWindow;

//function to create main window
function createWindow() {
  mainWindow = new BrowserWindow( {
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('login.html')
  
  mainWindow.on('closed', function() {
    app.quit();
  });


  ipcMain.on('item:add', function(e, name ) {
    console.log(name);//test data got here to main
    mainWindow.webContents.send('item:add', name);
  
  });
 
  let menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu)

}//end createWindow

//function to create window for Adding
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 700,
    height: 500,
    title: 'Add Item',
    webPreferences: {
      nodeIntegration: true
    }
  });
//section is tell the addwindow in the 
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  addWindow.on('close', function() {
    addWindow = null;
  });

}//end create addWindow

function clearWindow()
{
    mainWindow.webContents.send('item:clear');
}//end function clearWindow


//template for menu
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add',
        click() {createAddWindow()}
      },
      {
        label: 'Clear',
        click(){clearWindow()}
      },
      {
        label: 'Quit',
        click(){app.quit()}
      }
    ]
  }
];
//dd dev to menu at run time . - note unshift is an array method 
//places a new element on the front end of an array.
//All menu items are objects. accelerator can be used for not-keys

mainMenuTemplate.push({
	label: 'Dev Tools',
		submenu:[
		{
			label: 'Toggle Dev Tools',
			//accelerator would go here
			click(item,focusedWindow)
			{
				focusedWindow.toggleDevTools();
			}
		},
			{
				role:'reload'
			}
			]
	
});

app.on('ready', createWindow)