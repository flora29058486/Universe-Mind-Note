const { app, remote, BrowserWindow, ipcMain, dialog, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
// const nativeImage = require('electron').nativeImage

let isDataSaved = false;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

async function saveData(labels, nodes, stage) {
  try {
    // 將數據轉換為 JSON 字符串
    const dataToSave = JSON.stringify({ labels, nodes, stage }, null, 2); // 使用參數讓輸出更易於閱讀

    // 異步地寫入數據到文件
    const userDataPath = (app || remote.app).getPath('userData');
    const filePath = path.join(userDataPath, 'userData.json');

    await fs.writeFile(filePath, dataToSave);

  } catch (error) {
    // 處理可能出現的錯誤
    console.error('Error saving data:', error);
    throw error; // 可選：重新拋出錯誤，以便呼叫者可以處理或記錄
  }
}

// 在应用准备就绪时加载用户数据
const handleLoadUserData = async () => {
  try {
    // 获取应用数据存储目录
    const userDataPath = (app || remote.app).getPath('userData');
    const filePath = path.join(userDataPath, 'userData.json');

    // 尝试访问文件来检查其是否存在
    await fs.access(filePath);

    // 如果文件存在，读取并返回其内容
    const rawData = await fs.readFile(filePath, 'utf8');
    return rawData;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // 文件不存在时返回空的 JSON 对象
      console.log('File does not exist, returning empty JSON.');
      return JSON.stringify({});
    } else {
      // 其他错误
      console.error('Error loading user data:', error);
      throw error;
    }
  }
};

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

async function traverseFolder(rootPath) {
  const rootName = path.basename(rootPath);
  const rootNode = {
    id: rootPath,
    label: rootName,
    type: 'folder',
    children: [],
  };

  const files = await fs.readdir(rootPath);

  const childNodes = await Promise.all(files.map(async (file) => {
    const filePath = path.join(rootPath, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      return traverseFolder(filePath); // 遞迴處理資料夾
    } else if (stats.isFile()) {
      const fileName = path.basename(filePath);
      const fileExtension = path.extname(filePath);
      
      return {
        id: filePath,
        label: fileName,
        type: 'file',
        extension: fileExtension,
        lastModified: stats.mtime.getTime(),
      };
    }
  }));

  // 過濾未定義的節點（例如，如果有條件分支不返回值）
  const filteredNodes = childNodes.filter(node => node !== undefined);

  // 將節點分為文件夾和文件
  const folderNodes = filteredNodes.filter(node => node.type === 'folder');
  const fileNodes = filteredNodes.filter(node => node.type === 'file');

  // 按最後修改時間排序
  folderNodes.sort((a, b) => b.lastModified - a.lastModified);
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
      const files = await traverseFolder(absolutePath);
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
  // Save User Data
  ipcMain.on('save-user-data', async (event, { labels, nodes, stage }) => {
    // 這裡執行保存數據的邏輯
    await saveData(labels, nodes, stage);
  });
  // load userData
  ipcMain.handle('user-data-loaded', handleLoadUserData);
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
    resizable: true,
    fullscreenable: true,
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

  // 窗口要关闭的时候触发
  mainWindow.on('close', (e) => {
    if (!isDataSaved) {
      e.preventDefault(); // 阻止窗口立即關閉
      mainWindow.webContents.send('request-save-data');
  
      isDataSaved = true;
      mainWindow.close(); // 現在可以安全關閉窗口
    } else {
      // 如果數據已經保存，直接關閉窗口
      e.defaultPrevented = false; // 不再阻止窗口關閉
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


// 监听来自渲染进程的获取文件夹内容请求
// ipcMain.on('dialog:openFolder', handleOpenFolder);

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
