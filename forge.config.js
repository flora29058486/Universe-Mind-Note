module.exports = {
  packagerConfig: {
    asar: true,
    icon: "./icons8-nebula.ico",
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: "UniverseMindNote",
        setupExe: "UMNSetup.exe",
        setupIcon: "./icons8-nebula-16.ico",
      },
    },
    {
      name: '@electron-forge/maker-zip',
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/index.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js'
              },
            },
          ],
        },
      },
    },
  ],
};
