const { app, BrowserWindow, ipcMain, dialog, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const nativeImage = require('electron').nativeImage

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
    });
  } else if (platform === 'darwin') {
    // macOS 使用 open 命令打開檔案
    execFile(`open "" "${filepath}"`, (err, stdout, stderr) => {
      if (err) {
        console.error('Error opening the file:', err);
        return;
      }
    });
  } else if (platform === 'linux') {
    // Linux 使用 xdg-open 命令打開檔案
    execFile(`xdg-open "" "${filepath}"`, (err, stdout, stderr) => {
      if (err) {
        console.error('Error opening the file:', err);
        return;
      }
    });
  } else {
    console.error('Unsupported platform');
  }
}

const handleLoadFileIcon = async (_, filePath) => {
  try {
    // 進行相應的操作，這裡可以是讀取文件的圖示等
    const icon = await app.getFileIcon(filePath, { size: 'normal' });
    const iconData = icon.toDataURL();
    // 返回文件圖示的 base64 字符串給呼叫方（preload）
    return iconData;
  } catch (error) {
    console.error('Error while loading FileIcons:', error);
    throw error;
  }
}

const createWindow = () => {
  // Import Folder files
  ipcMain.handle('dialog:openFolder', handleOpenFolder);
  // Open File
  ipcMain.handle('main:openFile', handleOpenFile);
  // Load FileIcon
  ipcMain.handle('main:loadIcon', handleLoadFileIcon);

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    width: 1920,
    height: 1080,
    // icon: `${__dirname}/dist/assets/imgs/logo.png`, // 使用绝对路径
    // backgroundColor: 'blue',
    backgroundMaterial: 'acrylic',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      // nodeIntegration: true,
    }
  });

  // Remove the menu bar
  mainWindow.setMenu(null);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

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
