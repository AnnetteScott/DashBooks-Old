<template>
    <div id="navbar">
        <div class="page_nav_buttons_container" style="gap: 10px; margin-right: 0px;">
            <div class="page_nav_buttons more_options" title="Load" @click="loadUser"> <q-icon name="o_file_open" size="sm" style="pointer-events: none"/> </div>
            <div class="page_nav_buttons more_options" title="Save" @click="saveUserDict"> <q-icon name="o_save" size="sm" style="pointer-events: none"/> </div>
            <div class="page_nav_buttons more_options" title="Save As" @click="manualSave"> <q-icon name="o_archive" size="sm" style="pointer-events: none"/> </div>
            <div class="page_nav_buttons more_options" title="Change Save Location" @click="changeSaveLocation"> <q-icon name="o_drive_file_move" size="sm" style="pointer-events: none"/> </div>
        </div>
        <template v-if="update">
            <div id="update">
                <template v-if="settingsObj['showNavBarText']">
                    There is an update available. Go to&nbsp;<a href="https://github.com/NotNatural21/DashBooks/releases/latest/" target="_blank">DashBooks latest release</a> to get {{updateVersion}}.
                </template>
                <template v-else>
                    <a href="https://github.com/NotNatural21/DashBooks/releases/latest/" target="_blank">Update</a>
                </template>
                
            </div>
        </template>
        <div class="page_nav_buttons_container">
            <RouterLink v-for="(dict, name) in navPages" :key="name" :to="dict.route" style="text-decoration: none;" @click="currentPage = name">
                <div class="page_nav_buttons" :title="name" :style="`${currentPage == name ? 'border: 1px solid #fffa;' : ''}`">
                    <q-icon :name="dict.icon" style="height: 1.2em;"/>
                    <template v-if="settingsObj['showNavBarText'] && name != 'Help' && name != 'Settings'">
                        {{name}}
                    </template>
                </div>
            </RouterLink>
        </div>
    </div>
    <SavingPopup :savingStatus="saving_in_progress" />
    <SavedPopup :savingStatus="savedUser" />
    <router-view />
</template>

<script>
import JSZip from 'jszip';
import { settingsDict, userDict, saveChecker } from './main.js';
import SavingPopup from '@/components/SavingPopup.vue';
import SavedPopup from '@/components/SavedPopup.vue';
import $ from 'jquery'
import { appWindow } from '@tauri-apps/api/window'
const dialog = window.__TAURI__.dialog;
const fs = window.__TAURI__.fs;
export default {
    name: 'App',
    components: {
        SavingPopup,
        SavedPopup
    },
    data() {
        return {
			saving_in_progress: false,
            currentPage: 'DashBoard',
			savedUser: false,
            update: false,
            settingsObj: settingsDict,
            showNavBarText: settingsDict['showNavBarText'],
            updateVersion: 'v1.2.3',
            userObj: userDict,
            windowWidth: window.innerWidth,
            navPages: {
                "DashBoard": {"icon": "o_dashboard", "route": "/"}, 
                "Projects": {"icon": "o_schedule", "route": "/projects"}, 
                "Tools": {"icon": "o_handyman", "route": "/tools"}, 
                "Invoicing": {"icon": "o_receipt", "route": "/invoice"}, 
                "Records": {"icon": "o_inventory_2", "route": "/records"}, 
                "Settings": {"icon": "o_settings", "route": "/settings"}, 
                "Help": {"icon": "o_help_outline", "route": "/help"}
            }
		}
    },
    mounted(){
        console.log(userDict)
        console.log(settingsDict)
        settingsDict['autoSaveTime'] ? delete settingsDict['autoSaveTime'] : '';
        this.checkForUpdates();
        appWindow.listen('tauri://close-requested', ({ event, payload }) => {                    
            this.saveUserDict("closeProgram");
        })
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        })
        if(this.windowWidth <= 1750){
            settingsDict['showNavBarText'] = false;
        }
        
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
                    if(latest_version[0] > current_version[0] || latest_version[1] > current_version[1] || latest_version[2] > current_version[2] && latest_version[1] >= current_version[1]){
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
        async saveUserDict(option){
            let ref = this;
            this.saving_in_progress = true;
            await fs.writeFile({path: settingsDict['roaming'] + "DashBooks/settings.ssdb", contents: JSON.stringify(settingsDict)})
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
                        ref.savedUser = true;
                        setTimeout(() =>{
                            ref.savedUser = false;
                        }, 3000)
                        if(option == "closeProgram"){
                            appWindow.close();
                        }
                    })
                });
            }else {
                ref.saving_in_progress = false;
                ref.savedUser = true;
                setTimeout(() =>{
                    ref.savedUser = false;
                }, 3000)
                if(option == "closeProgram"){
                    appWindow.close();
                }
            }
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
        },
        onResize(){
            this.windowWidth = window.innerWidth;
            if(this.windowWidth <= 1750){
                settingsDict['showNavBarText'] = false;
            }
            else {
                settingsDict['showNavBarText'] = true;
            }
        }
        
    }
}
</script>

<style lang="scss">
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

#navbar {
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
	background-color: #027BE3;
}

.page_nav_buttons_container{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: var(--navbar_height);
    gap: 30px;
    margin-right: 25px;
}

.page_nav_buttons{
    cursor: pointer;
    font-size: 1.2rem;
    user-select: none;
    padding: 5px 10px;
    border: 1px solid #0002;
    border-radius: 8px;
    color: white;
}

.page_nav_buttons:hover{
    border: 1px solid #000a;
}

.more_options{
    font-size: 0.9rem;
    padding: 5px;
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
