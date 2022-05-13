import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options';
import { reactive } from 'vue';

const path = window.__TAURI__.path;
const fs = window.__TAURI__.fs;

let pjson = require('../package.json');
const userDictMaster = {"projects": {}, "clients": {}, "colours": {'colourWhite':{'name': 'Clear', 'colour': '#ffffff'}}, "users": {}, "records": {"accounts": [], "categories": {}, 'savedTransactions': {}}, "saveVersion": 15, "showGST": true, "version": pjson.version}

function read_file(path){
    return fs.readTextFile(path);
}


const dataPath = "$DATA/saveData";
console.log(fs.readDir(""))

/* if(!fs.readDir(dataPath)){
    fs.createDir(dataPath);
    fs.writeFile({path: dataPath + "\\settings.json", contents: JSON.stringify({'saveFilePath': `${dataPath + "\\userData.json"}`})});
    fs.writeFile({path: dataPath + "\\userData.json", contents: JSON.stringify(userDictMaster)});
} */ 

const settingsObj = JSON.parse(read_file(dataPath + "/settings.json"));

const userDictRead = JSON.parse(read_file(settingsObj['saveFilePath']));
userDictRead['version'] = pjson.version;



export const userDict = reactive({...userDictRead})

let myApp = createApp(App)
myApp.use(Quasar, quasarUserOptions).use(router).mount('#app')