const customTitlebar = require('custom-electron-titlebar');

new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#2c354b'),
    menu: false,
    titleHorizontalAlignment: 'left'
});
