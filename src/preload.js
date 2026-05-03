import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('test', "My name is emon")

//listening from main process
ipcRenderer.on('fromMain', (event, data)=> {
    console.log(data)
})

// received with call back
// contextBridge.exposeInMainWorld("api", {
//   onFromMain: (callback) => {
//     ipcRenderer.on("fromMain", (event, data) => {
//       callback(data);
//     });
//   }
// });

// sending data to main process
// contextBridge.exposeInMainWorld('api', {
//     SendToMain:() => {
//         ipcRenderer.send('fromPreload', "Data from preload")
//     }
// }
// )

// sending data to main process two way
contextBridge.exposeInMainWorld('apiTwoWay', {
    // SendToMainTwoWay: async () => {
    //     const returnData = await ipcRenderer.invoke('fromPreloadTwoWay', "Two way data from preload ")
    //     console.log(returnData)
    // },

    closeTheApp: async () => {
        await ipcRenderer.invoke('close');
    },

    minimizeTheApp: async () => {
        await ipcRenderer.invoke('app-minimize');
    }
}
)
