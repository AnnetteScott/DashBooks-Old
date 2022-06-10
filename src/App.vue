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
import { settingsDict, userDict, saveChecker } from './main.js';
import SavingPopup from '@/components/SavingPopup.vue';
import ApplicationForms from '@/components/ApplicationForms.vue';

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
			application_Form: ''
		}
    },
    setup () {
        return {
            tab: ref('')
        }
    },
    mounted(){
        console.log(settingsDict)
        let autoSave = settingsDict['autoSaveTime'] ? settingsDict['autoSaveTime'] : 5;
        let oneMin = 60 * 1000
        let ref = this;
        setInterval(function() {
            ref.saveUserDict();
        }, oneMin * autoSave);
        console.log(userDict)
    },
    methods: {
        changeAutoSave(){
            this.application_Form = `changeAutoSave`
        },
        loadUser(){
            let ref = this;
            confirm(`Are you sure you want to proceed? This will replace all you current data. Please use the manual save function to avoid data loss.`).then(function(outcome) {
                if(outcome){
                    dialog.open({"directory": true}).then(function(userFilePath) {
                        console.log(`${userFilePath}/`)
                        console.log(settingsDict['saveFilePath'])
                        if(userFilePath != null && `${userFilePath}/` != settingsDict['saveFilePath']){
                            fs.readDir(userFilePath).then(function(dataPath) {
                                for(const[objKey, objDict] of Object.entries(dataPath)){
                                    if(objDict['name'] == "userData.ssdb"){
                                        fs.readTextFile(objDict['path']).then(function(loadContent) {
                                            let userContents = JSON.parse(loadContent)
                                            userContents = saveChecker(userContents)
                                            for(const[key, entry] of Object.entries(userContents)){
                                                userDict[key] = entry;
                                            }
                                            window.location.reload();
                                            ref.saveUserDict()
                                        })
                                    }else if(objDict['name'] == 'Receipts'){
                                        fs.readDir(objDict['path']).then(function(receiptPath) {
                                            path.dataDir().then(function(roaming) {
                                                //Reset Romaing Dir
                                                fs.removeDir(roaming + `DashBooks/Receipts/`, {recursive: true})
                                                fs.createDir(roaming + `DashBooks/Receipts`)
                                                if(roaming + `DashBooks/Receipts` != settingsDict['saveFilePath'] + `Receipts`){
                                                    fs.removeDir(settingsDict['saveFilePath'] + `Receipts`, {recursive: true})
                                                    fs.createDir(settingsDict['saveFilePath'] + `Receipts`)
                                                }
                                                for(const[objKey, objDict] of Object.entries(receiptPath)){
                                                    fs.copyFile(objDict['path'], roaming + `DashBooks/Receipts/${objDict['name']}`)
                                                    if(roaming + `DashBooks/Receipts` != settingsDict['saveFilePath'] + `Receipts`){
                                                        fs.copyFile(objDict['path'], settingsDict['saveFilePath'] + `Receipts/${objDict['name']}`)
                                                    }
                                                }
                                            });
                                        });
                                    }
                                }
                            });
                        }
                        
                    });
                }
            });
        },
        saveUserDict(){
            this.saving_in_progress = true;
			window.setTimeout(function() {
				this.saving_in_progress = false;
			}.bind(this), 1500);

            fs.writeFile({path: settingsDict['saveFilePath'] + 'userData.ssdb', contents: JSON.stringify(userDict)})
            path.dataDir().then(function(dataPath) {
                fs.writeFile({path: dataPath + "DashBooks/userData.ssdb", contents: JSON.stringify(userDict)})
            })
        },
        manualSave(){
            this.saveUserDict();
            dialog.open({"directory": true}).then(function(userFilePath) {
                if(userFilePath != null){
                    fs.createDir(`${userFilePath}/DashBooks Save`)
                    fs.createDir(`${userFilePath}/DashBooks Save/Receipts`)
                    fs.writeFile({path: `${userFilePath}/DashBooks Save/userSave.ssdb`, contents: JSON.stringify(userDict)});
                    path.dataDir().then(function(roaming) {
                        fs.readDir(`${roaming}DashBooks/Receipts`).then(function(DashBooks) {
                            for(const[objKey, objDict] of Object.entries(DashBooks)){
                                fs.copyFile(objDict['path'], `${`${userFilePath}/DashBooks Save/Receipts/`}${objDict['name']}`)
                            }
                        })
                    })
                }
                
            });
        },
        changeSaveLocation(){
            let ref = this;
            dialog.open({"directory": true}).then(function(userFilePath) {
                if(userFilePath != null){
                    let filePath = userFilePath + "\\DashBooks Data/"
                    settingsDict['saveFilePath'] = filePath;
                    let foundDashBooks = false;
                    fs.readDir(userFilePath).then(function(dataPath) {
                        for(const[objKey, objDict] of Object.entries(dataPath)){
                            if(objDict['name'] == 'DashBooks'){
                                foundDashBooks = true;
                            }
                        }
                        if(!foundDashBooks){
                            fs.createDir(userFilePath + "/DashBooks Data")
                            fs.createDir(userFilePath + "/DashBooks Data/Receipts")
                        }
                        path.dataDir().then(function(dataPath) {
                            fs.writeFile({path: dataPath + "DashBooks/settings.ssdb", contents: JSON.stringify(settingsDict)})
                            ref.saveUserDict();
                            console.log(settingsDict)

                        })
                    });
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
	height: calc(100% - 55px);
	display: flex;
	justify-content: center;
    min-width: 1438px;
    overflow-y: auto;
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
</style>
