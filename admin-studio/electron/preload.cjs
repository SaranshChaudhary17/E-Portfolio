const {contextBridge}=require('electron');contextBridge.exposeInMainWorld('studio',{version:require('../package.json').version});
