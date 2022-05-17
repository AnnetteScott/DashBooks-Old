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
                <q-route-tab name="To Do" label="To Do" to="/todo"/>
                <q-route-tab name="Help" label="Help" to="/help"/>
            </q-tabs>
            </q-toolbar>
        </div>
    </nav>
  <router-view/>
</template>

<script>
import { ref } from 'vue'
import { settingsDict, userDict, saveChecker } from './main.js';
const dialog = window.__TAURI__.dialog;
const fs = window.__TAURI__.fs;
const path = window.__TAURI__.path;
export default {
    name: 'HomeView',
    components: {

    },
    setup () {
        return {
            tab: ref('')
        }
    },
    methods: {
        loadUser(){
            let ref = this;
            dialog.open().then(function(userFilePath) {
                if(userFilePath != null){
                    fs.readTextFile(userFilePath).then(function(userFileContents) {
                        let userContents = JSON.parse(userFileContents)
                        userContents = saveChecker(userContents)
                        for(const[key, entry] of Object.entries(userContents)){
                            userDict[key] = entry;
                        }
                        window.location.reload();
                        ref.saveUserDict()
                    })
                }
                
            });
        },
        saveUserDict(){
            fs.writeFile({path: settingsDict['saveFilePath'], contents: JSON.stringify(userDict)})
            path.dataDir().then(function(dataPath) {
                fs.writeFile({path: dataPath + "DashBooks/userData.ssdb", contents: JSON.stringify(userDict)})
            })
        },
        manualSave(){
            this.saveUserDict();
            dialog.save().then(function(userFilePath) {
                if(userFilePath != null){
                    fs.writeFile({path: userFilePath, contents: JSON.stringify(userDict)})
                }
                
            });
        },
        changeSaveLocation(){
            dialog.open({"directory": true}).then(function(userFilePath) {
                if(userFilePath != null){
                    userFilePath = userFilePath + "/userData.ssdb"
                    settingsDict['saveFilePath'] = userFilePath;
                    path.dataDir().then(function(dataPath) {
                        fs.writeFile({path: dataPath + "DashBooks/settings.ssdb", contents: JSON.stringify(settingsDict)})
                    })
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
}

p{
    margin: 0px !important;
}
h4{
    margin: 0px;
}
</style>
