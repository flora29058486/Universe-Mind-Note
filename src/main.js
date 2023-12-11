const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


// 函数用于打开文件夹选择对话框
async function openFolderDialog() {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (!result.canceled) {
    const selectedFolder = result.filePaths[0];
    return selectedFolder;
  } else {
    return null;
  }
}

function traverseFolder(rootPath) {
  const rootName = path.basename(rootPath);
  const rootNode = {
    id: rootPath, // 資料夾絕對路徑作為 ID
    label: rootName, // 資料夾名稱作為標籤
    type: 'folder', // 標記這是一個資料夾節點
    children: [],
  };

  const files = fs.readdirSync(rootPath);

  const fileNodes = [];
  const folderNodes = [];

  files.forEach(file => {
    const filePath = path.join(rootPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const childNode = traverseFolder(filePath); // 遞迴處理資料夾
      folderNodes.push(childNode);
    } else if (stats.isFile()) {
      const fileName = path.basename(filePath);
      const fileExtension = path.extname(filePath);
      const fileId = filePath; // 檔案絕對路徑作為 ID

      const fileNode = {
        id: fileId,
        label: fileName,
        type: 'file', // 標記這是一個檔案節點
        extension: fileExtension, // 檔案副檔名
        lastModified: stats.mtime.getTime(), // 上次修改時間
      };

      fileNodes.push(fileNode);
    }
  });

  // Sort folders by last modified time
  folderNodes.sort((a, b) => b.lastModified - a.lastModified);

  // Sort files by last modified time
  fileNodes.sort((a, b) => b.lastModified - a.lastModified);

  rootNode.children = [...folderNodes, ...fileNodes];

  return rootNode;
}

async function handleOpenFolder() {
  const selectedFolder = await openFolderDialog();
  if (selectedFolder) {
    const absolutePath = path.resolve(selectedFolder);
    try {
      // const files = await fs.promises.readdir(absolutePath);
      const files = traverseFolder(absolutePath);
      console.log(absolutePath);
      return files;
    } catch (err) {
      console.error('Error reading folder:', err);
      return null;
    }
  } else {
    return null;
  }
}

const handleOpenFile = async (event, filePathToOpen) => {
  const filepath = filePathToOpen;

  // 檢查作業系統類型
  const platform = process.platform;

  if (platform === 'win32') {
    // Windows 使用 start 命令打開檔案
    exec(`start "" "${filepath}"`, (err, stdout, stderr) => {
      if (err) {
        console.error('Error opening the file:', err);
        return;
      }
      console.log('File opened successfully');
    });
  } else if (platform === 'darwin') {
    // macOS 使用 open 命令打開檔案
    execFile(`open "" "${filepath}"`, (err, stdout, stderr) => {
      if (err) {
        console.error('Error opening the file:', err);
        return;
      }
      console.log('File opened successfully');
    });
  } else if (platform === 'linux') {
    // Linux 使用 xdg-open 命令打開檔案
    execFile(`xdg-open "" "${filepath}"`, (err, stdout, stderr) => {
      if (err) {
        console.error('Error opening the file:', err);
        return;
      }
      console.log('File opened successfully');
    });
  } else {
    console.error('Unsupported platform');
  }
}

const createWindow = () => {
  // Import Folder files
  ipcMain.handle('dialog:openFolder', handleOpenFolder);
  // Open File
  ipcMain.handle('main:openFile', handleOpenFile);

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // backgroundColor: '#FF0000',
    // webPreferences: {
    //   preload: path.join(__dirname, 'preload.js')
    // }
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      // nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: path.join(__dirname, filePath),
    icon: iconName
  })
})



// 监听来自渲染进程的获取文件夹内容请求
// ipcMain.on('dialog:openFolder', handleOpenFolder);

// ipcMain.handle('dialog:openFolder', async (event) => {
//   console.log("on main");
//   const folderContents = await onFolderLoad();
//   mainWindow.webContents.send('foldercontents', folderContents);
//   // event.reply('foldercontents', folderContents);
//   // const folderContents = await loadFolder();
//   // event.reply('folderContents', folderContents);
// });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
