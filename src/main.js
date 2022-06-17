import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options';
import { reactive } from 'vue';
import JSZip from 'jszip';

//Set variables for getting and process user data
const path = window.__TAURI__.path;
const fs = window.__TAURI__.fs;
let pjson = require('../package.json');
const userDictMaster = {"projects": {}, "clients": {}, "colours": {'colourWhite':{'name': 'Clear', 'colour': '#ffffff'}}, "users": {}, "records": {"accounts": [],"payee": [], "categories": {}, 'savedTransactions': {}, 'headingStates': [ 'month', 'date', 'type', 'account', 'category', 'item', 'payee', 'amount', "receiptID" ]}, "saveVersion": 22, "showGST": true, "version": pjson.version, "timeLogged": {"01/01/1970": {'hours': 0, 'pay': 0}}, 'archive': {'projects': {}}}
let userDictRead = undefined;

//Check a dashbooks directory is present in appdata/roaming and create it if not
let dataPath = await path.dataDir();
let foundDashBooks = false;
let roaming = await fs.readDir(dataPath);
for(const[objKey, objDict] of Object.entries(roaming)){
    if(objDict['name'] == 'DashBooks'){
        foundDashBooks = true;
    }
}
if(!foundDashBooks){
    fs.createDir(dataPath + "DashBooks")
    fs.createDir(dataPath + "DashBooks/Receipts")
    fs.writeFile({path: dataPath + "DashBooks/settings.ssdb", contents: JSON.stringify({'saveFilePath': `${dataPath + "DashBooks/"}`, 'autoSaveTime': 5})})
    fs.writeFile({path: dataPath + "DashBooks/userData.ssdb", contents: JSON.stringify(userDictMaster)})
}

//Check Dashbooks directory contains all files
let dashbooks = await fs.readDir(dataPath + "DashBooks");
if(dashbooks.find(x => x.name == "Receipts") == undefined){
    fs.createDir(dataPath + "DashBooks/Receipts")
}else if(dashbooks.find(x => x.name == "settings.ssdb") == undefined){
    fs.writeFile({path: dataPath + "DashBooks/settings.ssdb", contents: JSON.stringify({'saveFilePath': `${dataPath + "DashBooks/"}`, 'autoSaveTime': 5})})
}else if(dashbooks.find(x => x.name == "userData.ssdb") == undefined){
    fs.writeFile({path: dataPath + "DashBooks/userData.ssdb", contents: JSON.stringify(userDictMaster)})
}

//Get the settings data
let settingsObjs = await fs.readTextFile(dataPath + "DashBooks/settings.ssdb");
settingsObjs = (JSON.parse(settingsObjs))
settingsObjs['roaming'] = dataPath
const settingsObj = {...settingsObjs};
let saveFiles = {};
try {
    let saveFileDirectory = settingsObj['saveFilePath'].split('/')[0]
    //Check the save file is present otherwise read from backup
    saveFiles = await fs.readDir(saveFileDirectory);
    let saveFileFound = false;
    for(const[objKey, objDict] of Object.entries(saveFiles)){
        if(objDict['name'] == 'DBsave.dbss'){
            saveFileFound = true
        }
    }
    if(saveFileFound){//read from custom save file
        let u8arr = await fs.readBinaryFile(settingsObj['saveFilePath']);
        let zipFile = await JSZip.loadAsync(u8arr);
        console.log(zipFile)
        let u8data = zipFile.files['userData.ssdb']._data.compressedContent;
        let string = new TextDecoder().decode(u8data);
        userDictRead = JSON.parse(string);
    }else{
        let rawUser = await fs.readTextFile(dataPath + "DashBooks/userData.ssdb");//user hasn't set custom save file
        userDictRead = JSON.parse(rawUser);
        settingsObj['saveFilePath'] = dataPath + "DashBooks/";
    }
} catch (error) {
    if(userDictRead == undefined){ //If reading from save file fails, read from the roaming directory.
        let rawUser = await fs.readTextFile(dataPath + "DashBooks/userData.ssdb");
        userDictRead = JSON.parse(rawUser);
        settingsObj['saveFilePath'] = dataPath + "DashBooks/";
    }
}


export function saveChecker(saveFile){
    let pjson = require('../package.json');
    if(saveFile['saveVersion'] == 4){
        saveFile['records']['accounts'] = [];
        saveFile['records']['categories'] = ['Contract Work'];
        saveFile['saveVersion'] = 5;
    }
    if(saveFile['saveVersion'] == 5){
        saveFile['records']['homeExpenses'] = {};
        saveFile['saveVersion'] = 6;
    }
    if(saveFile['saveVersion'] == 6){
        saveFile['colours']['colourWhite']['name'] = 'Clear';
        for(const[projectID, projectDict] of Object.entries(saveFile['projects'])){
            for(const[weekID, weekDict] of Object.entries(projectDict['weeks'])){
                weekDict['invoiced'] = false;
            }
        }
        saveFile['saveVersion'] = 7;
    }
    if(saveFile['saveVersion'] == 7){
        for(const[projectID, projectDict] of Object.entries(saveFile['projects'])){
            projectDict['targetHours'] = 0;
        }
        saveFile['saveVersion'] = 8;
    }
    if(saveFile['saveVersion'] == 8){
        for(const[yearID, recordsDict] of Object.entries(saveFile['records'])){
            if(yearID != 'accounts' && yearID != 'categories' && yearID != 'homeExpenses'){
                if(recordsDict['transactions'] != undefined){
                    for(const[transID, transDict] of Object.entries(recordsDict['transactions'])){
                        transDict['receiptID'] = '';
                    }
                }
                
            }
        }
        saveFile['saveVersion'] = 9;
    }
    if(saveFile['saveVersion'] == 9){
        delete saveFile['records']['homeExpenses']
        saveFile['records']['savedTransactions'] = {}
        saveFile['saveVersion'] = 10;
    }
    if(saveFile['saveVersion'] == 10){
        let categoryCopy = [... saveFile['records']['categories']];
        saveFile['records']['categories'] = {};
        categoryCopy.forEach(item => {
            saveFile['records']['categories'][item] = true;
        });
        saveFile['saveVersion'] = 11;
    }
    if(saveFile['saveVersion'] == 11){
        saveFile['records']['payee'] = [];
        saveFile['saveVersion'] = 12;
    }
    if(saveFile['saveVersion'] == 12){
        for(const[yearID, recordsDict] of Object.entries(saveFile['records'])){
            if(yearID != 'accounts' && yearID != 'categories' && yearID != 'homeExpenses'){
                if(recordsDict['transactions'] != undefined){
                    for(const[transID, transDict] of Object.entries(recordsDict['transactions'])){
                        transDict['payee'] = '';
                        transID;
                    }
                }
            }
        }
        saveFile['saveVersion'] = 13;
    }
    if(saveFile['saveVersion'] == 13){
        saveFile['showGST'] = true;
        saveFile['saveVersion'] = 14;
    }
    if(saveFile['saveVersion'] == 14){
        saveFile['version'] = pjson.version;
        saveFile['saveVersion'] = 15;
    }
    if(saveFile['saveVersion'] == 15){
        for(const[projectID, projectDict] of Object.entries(saveFile['projects'])){
            for(const[weekID, weekDict] of Object.entries(projectDict['weeks'])){
                for(const[colourID, cellsArr] of Object.entries(weekDict['colouredCells'])){
                    cellsArr.forEach((cellID, i) => {
                        let cellInt = parseInt(cellID.substring(1)) - 1;
                        let cellCol = cellID.charAt(0);
                        cellsArr[i] = `${cellCol}${cellInt}`
                    })
                }
            }
        }
        saveFile['saveVersion'] = 16;
    }
    if(saveFile['saveVersion'] == 16){
        saveFile['timeLogged'] = {"01/01/1970": 0}
        saveFile['saveVersion'] = 17
    }
    if(saveFile['saveVersion'] == 17){
        for(const[objKey, objDict] of Object.entries(saveFile['timeLogged'])){
            saveFile['timeLogged'][objKey] = {'hours': objDict, 'pay': 0}
        }
        saveFile['saveVersion'] = 18
    }
    if(saveFile['saveVersion'] == 18){
        for(const[projectID, projectDict] of Object.entries(saveFile['projects'])){
            for(const[weekID, weekDict] of Object.entries(projectDict['weeks'])){
                let weekTotal = 0
                for(const [colourID, cellList] of Object.entries(weekDict['colouredCells'])){
                    if(cellList.length != 0){
                        let qty = (Math.round((1/(60/projectDict['timeInterval'])) * 1000) / 1000) * cellList.length;
                        let total = qty * parseFloat(saveFile['colours'][colourID]['rate']);
                        weekTotal += total
                    }
                } 
                weekDict['total'] = weekTotal.toFixed(2)
            }
        }
        saveFile['saveVersion'] = 19
    }
    if(saveFile['saveVersion'] == 19){
        saveFile['archive'] = {}
        saveFile['archive']['projects'] = {}
        saveFile['saveVersion'] = 20
    }
    if(saveFile['saveVersion'] == 20){
        for(const[projectID, projectDict] of Object.entries(saveFile['projects'])){
            delete projectDict['colours'];
            projectDict['colour'] = ["#014a88", '#35a2ff']
        }
        saveFile['saveVersion'] = 21
    }
    if(saveFile['saveVersion'] == 21){
        for(const[yearID, recordsDict] of Object.entries(saveFile['records'])){
            if(yearID != 'accounts' && yearID != 'categories' && yearID != 'homeExpenses'){
                if(recordsDict['transactions'] != undefined){
                    for(const[transID, transDict] of Object.entries(recordsDict['transactions'])){
                        transDict['receiptID'] = '';
                        transDict['id'] = transID;
                    }
                }
                
            }
        }
        saveFile['records']['headingStates'] = [ 'month', 'date', 'type', 'account', 'category', 'item', 'payee', 'amount', "receiptID" ]
        saveFile['saveVersion'] = 22
    }
    if(saveFile['saveVersion'] == 22){
        for(const[projectID, projectDict] of Object.entries(saveFile['projects'])){
            for(const[weekID, weekDict] of Object.entries(projectDict['weeks'])){
                if(weekDict['invoiced']){
                    weekDict['invoiceSent'] = true;
                }else{
                    weekDict['invoiceSent'] = false;
                }
            }
        }
        saveFile['saveVersion'] = 23
    }
    saveFile['version'] = pjson.version;
    return saveFile
}
userDictRead = saveChecker(userDictRead);

export const userDict = reactive({...userDictRead})
export const settingsDict = reactive({...settingsObj})

//Save on exit
import { appWindow } from '@tauri-apps/api/window'
appWindow.listen('tauri://close-requested', ({ event, payload }) => {                    
    //Save Settings File
    fs.writeFile({path: settingsDict['roaming'] + "DashBooks/settings.ssdb", contents: JSON.stringify(settingsDict)});
    fs.writeFile({path: settingsDict['roaming'] + "DashBooks/userData.ssdb", contents: JSON.stringify(userDict)});
    if(`${settingsDict['roaming']}DashBooks/` != settingsDict['saveFilePath']){//User Has custom save location
        let uint8array = new TextEncoder("utf-8").encode(JSON.stringify(userDict));
        let zip = new JSZip();
        zip.file("userData.ssdb", uint8array)
        const receipt = zip.folder("Receipts")
        fs.readDir(`${settingsDict['roaming']}DashBooks/Receipts`).then(function(receiptFiles) {
            for(const[index, fileObj] of Object.entries(receiptFiles)){
                fs.readBinaryFile(fileObj['path']).then(function(imageArr) {
                    receipt.file(fileObj['name'], imageArr, {base64: false})
                })
            }
            zip.generateAsync({type:"uint8array"}).then(function(cont) {
                fs.writeBinaryFile({path: `${settingsDict['saveFilePath']}`, contents: cont})
                appWindow.close();
            });
        });
    }else{
        appWindow.close();
    }
})

let myApp = createApp(App)
myApp.use(Quasar, quasarUserOptions).use(router).mount('#app')