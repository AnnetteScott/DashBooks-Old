<template>
    <nav>
        <div>
            <q-toolbar class="bg-primary text-white shadow-2 glossy">
                <q-btn-dropdown stretch flat label="More">
                    <q-list>
                        <q-item clickable v-close-popup tabindex="0">
                            <q-item-section>
                            <q-item-label @click="loadUser">Load</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup tabindex="0">
                            <q-item-section>
                            <q-item-label @click="manualSave">Manual Save</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup tabindex="0">
                            <q-item-section>
                                <q-item-label @click="changeSaveLocation">Change Save Location</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup tabindex="0">
                            <q-item-section>
                                <q-item-label @click="changeAutoSave">Change Auto Save Time Period</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
                <q-btn flat label="Save" @click="saveUserDict"/>
                <q-space />
                <template v-if="update">
                    <div id="update">
                        There is an update available. Go to&nbsp;<a href="https://github.com/NotNatural21/DashBooks/releases/latest/" target="_blank">DashBooks latest release</a> to get {{updateVersion}}.
                    </div>
                </template>
                <q-space />
                <q-tabs v-model="tab" shrink>
                    <q-route-tab name="DashBoard" label="DashBoard" to="/"/>
                    <q-route-tab name="Settings" label="Settings" to="/settings"/>
                    <q-route-tab name="Projects" label="TimeSheets" to="/projects"/>
                    <q-route-tab name="Invoicing" label="Invoicing" to="/invoice"/>
                    <q-route-tab name="Records" label="Records" to="/records"/>
                    <q-route-tab name="Help" label="Help" to="/help"/>
                </q-tabs>
            </q-toolbar>
        </div>
    </nav>
    <SavingPopup :savingStatus="saving_in_progress" />
    <ApplicationForms :ApplicationForm="application_Form" @cancelled="application_Form=``"/>
    <router-view />
</template>

<script>
import { ref } from 'vue'
import JSZip from 'jszip';
import { settingsDict, userDict, saveChecker } from './main.js';
import SavingPopup from '@/components/SavingPopup.vue';
import ApplicationForms from '@/components/ApplicationForms.vue';
import $ from 'jquery'

const dialog = window.__TAURI__.dialog;
const fs = window.__TAURI__.fs;
const path = window.__TAURI__.path;
export default {
    name: 'App',
    components: {
        SavingPopup,
        ApplicationForms
    },
    data() {
        return {
			saving_in_progress: false,
			application_Form: '',
            update: false,
            updateVersion: '',
            userObj: userDict
		}
    },
    setup () {
        return {
            tab: ref('')
        }
    },
    mounted(){
        console.log(userDict)
        console.log(settingsDict)
        settingsDict['autoSaveTime'] ? delete settingsDict['autoSaveTime'] : '';
        this.checkForUpdates();
    },
    methods: {
        checkForUpdates(){
            let masterDict = {...userDict}
            let updateData = undefined;
            let ref = this;
            $.ajax({
                dataType: "json",
                url: 'https://api.github.com/repos/NotNatural21/DashBooks/releases',
                cache: false,
                success: function (data){
                    updateData = data[0];
                    let current_version = [
                        parseInt(masterDict['version'].split('.')[0]), 
                        parseInt(masterDict['version'].split('.')[1]), 
                        parseInt(masterDict['version'].split('.')[2])
                    ];
                    let latest_version = [
                        parseInt(updateData.tag_name.split('v')[1].split('.')[0]), 
                        parseInt(updateData.tag_name.split('v')[1].split('.')[1]), 
                        parseInt(updateData.tag_name.split('v')[1].split('.')[2])
                    ];
                    if(latest_version[0] > current_version[0] || latest_version[1] > current_version[1] || latest_version[2] > current_version[2]){
                        ref.updateVar();
                        ref.updateVersion = updateData.tag_name
                    }

                },
                error: function (xhr){
                    console.log("Error " + xhr.status + ", could not check for updates.");
                }
            });
        },
        updateVar(){
            this.update = true;
        },
        changeAutoSave(){
            this.application_Form = `changeAutoSave`
        },
        async loadUser(){
            let ref = this;
            let outcome = await confirm(`Are you sure you want to proceed? This will replace all you current data. Please use the manual save function to avoid data loss.`)
            if(outcome){
                let userFilePath = await dialog.open() //TODO add filter for file type
                if(userFilePath != null && `${userFilePath}/` != settingsDict['saveFilePath']){
                    let u8arr = await fs.readBinaryFile(userFilePath)
                    let zipFile = await JSZip.loadAsync(u8arr);
                    let u8data = zipFile.files['userData.ssdb']._data.compressedContent;
                    let string = new TextDecoder().decode(u8data);
                    let userContents = JSON.parse(string);
                    userContents = saveChecker(userContents);
                    for(const[key, entry] of Object.entries(userContents)){
                        userDict[key] = entry;
                    }

                    await fs.removeDir(settingsDict['roaming'] + `DashBooks/Receipts/`, {recursive: true})
                    await fs.createDir(settingsDict['roaming'] + `DashBooks/Receipts`)
                    for(const[key, imgData] of Object.entries(zipFile.files)){
                        if(key.includes('Receipts/') && key != 'Receipts/'){
                            let imgName = key.split('/')[1]
                            await fs.writeBinaryFile({path: settingsDict['roaming'] + `DashBooks/Receipts/${imgName}`, contents: imgData._data.compressedContent})
                        }
                    }

                    ref.saveUserDict();                        
                }
            }
        },
        async saveUserDict(){
            let ref = this;
            this.saving_in_progress = true;
            await fs.writeFile({path: settingsDict['roaming'] + "DashBooks/userData.ssdb", contents: JSON.stringify(userDict)})
            if(`${settingsDict['roaming']}DashBooks/` != settingsDict['saveFilePath']){//User Has custom save location
                let zip = new JSZip();
                let roamingFiles = await fs.readDir(`${settingsDict['roaming']}DashBooks/`)
                for(const[index, fileObj] of Object.entries(roamingFiles)){
                    if(fileObj['name'] == 'userData.ssdb'){
                        let userData = await fs.readBinaryFile(fileObj['path'])
                        zip.file("userData.ssdb", userData)
                    }
                    else if(fileObj['name'] == 'Receipts'){
                        const receipt = zip.folder("Receipts")
                        let receiptFiles = await fs.readDir(`${settingsDict['roaming']}DashBooks/Receipts`)
                        for(const[index, fileObj] of Object.entries(receiptFiles)){
                            let imageArr = await fs.readBinaryFile(fileObj['path'])
                            receipt.file(fileObj['name'], imageArr, {base64: false})
                        }
                    }
                }
                zip.generateAsync({type:"uint8array"}).then(function(cont) {
                    fs.writeBinaryFile({path: `${settingsDict['saveFilePath']}`, contents: cont}).then(function(){
                        ref.saving_in_progress = false;
                    })
                });
            }
            ref.saving_in_progress = false;
            console.log("saved!")
        },
        async manualSave(){
            await fs.writeFile({path: settingsDict['roaming'] + "DashBooks/userData.ssdb", contents: JSON.stringify(userDict)})
            let userFilePath = await dialog.open({"directory": true})
            if(userFilePath != null){
                let ref = this;
                this.saving_in_progress = true;
                let zip = new JSZip();
                let roamingFiles = await fs.readDir(`${settingsDict['roaming']}DashBooks/`)
                for(const[index, fileObj] of Object.entries(roamingFiles)){
                    if(fileObj['name'] == 'userData.ssdb'){
                        let userData = await fs.readBinaryFile(fileObj['path'])
                        zip.file("userData.ssdb", userData)
                    }
                    else if(fileObj['name'] == 'Receipts'){
                        const receipt = zip.folder("Receipts")
                        let receiptFiles = await fs.readDir(`${settingsDict['roaming']}DashBooks/Receipts`)
                        for(const[index, fileObj] of Object.entries(receiptFiles)){
                            let imageArr = await fs.readBinaryFile(fileObj['path'])
                            receipt.file(fileObj['name'], imageArr, {base64: false})
                        }
                    }
                }
                zip.generateAsync({type:"uint8array"}).then(function(cont) {
                    fs.writeBinaryFile({path: `${userFilePath}/DBmanual.dbss`, contents: cont})
                    ref.saving_in_progress = false;
                });
            }
        },
        changeSaveLocation(){
            let ref = this;
            dialog.open({"directory": true}).then(function(userFilePath) {
                if(userFilePath != null){
                    settingsDict['saveFilePath'] = `${userFilePath}/DBsave.dbss`;
                    fs.writeFile({path: settingsDict['roaming'] + "DashBooks/settings.ssdb", contents: JSON.stringify(settingsDict)})
                    ref.saveUserDict();
                }
            })
        }
    }
}
</script>


<style>
@import url('../public/root.css');
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background-color: #f4f5f8;
    height: 100vh;
    margin-top: var(--navbar_height);
}

@media only screen and (max-width: 1438px) {
    #app {
        height: calc(100vh - var(--navbar_height));
        overflow-x: scroll;
    }
}

nav {
    position: fixed;
	z-index: 999;
	top: 0px;
	right: 0px;
	left: 0px;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
	height: var(--navbar_height);
	font-family: 'Lato';
	font-size: 0.9em;
    color: white;
	background-color: white;
}

.pageHome{
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
    min-width: 1438px;
    overflow-y: auto;
    overflow-x: hidden;
}

p{
    margin: 0px !important;
}
h4{
    margin: 0px;
}
.active_button{
    border: 3px solid black;
}

#update > a{
    color: rgb(82, 191, 228);
}

#update{
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    padding: 5px 30px;
    background-color: rgb(63, 63, 63);
    border-radius: 10px;
}

#showInfoAbout{
    z-index: 10;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(15px);
}

#showInfoAbout > div{
    padding: 50px;
    border: 1px solid black;
    border-radius: 10px;
    background-color: white;
    cursor: pointer;
}
</style>
