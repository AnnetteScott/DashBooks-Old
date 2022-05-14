<template>
    <div class="pageHome">
        <div id="settings_nav">
            <q-toolbar class="bg-secondary text-white shadow-2 rounded-borders glossy">
            <q-tabs v-model="tab" shrink style="width:100%">
                <q-tab name="Projects" label="Projects" @click="settingsPage = `projects`"/>
                <q-tab name="Invoicing" label="Invoicing" @click="settingsPage = `invoicing`"/>
                <q-tab name="Records" label="Records" @click="settingsPage = `records`"/>
            </q-tabs>
            </q-toolbar>
        </div>
        <div id="settings_section">
            <div id="projects_container" v-if="settingsPage == `projects`">
                <div id="project_settings">
                    <div class="settings_bottom_control">
                    <p>You Have {{ Object.keys(projectDict).length == 1 ? Object.keys(projectDict).length + ' Project' : Object.keys(projectDict).length + ' Projects' }}</p>
                    <q-btn class="glossy" rounded color="primary" label="Create Project" @click="projectRequest=`createProject`" style="width: 95%;"/>
                    </div>
                    <div class="items">
                        <div v-for="(projectDict, projectID) in projectDict" :key="projectDict" class="list_item" :data="projectID" @click="open_edit_form($event, `editProjectForm`, `projects`)">{{ projectDict.name }}</div>
                    </div>
                </div>
                <div id="project_settings">
                    <div class="settings_bottom_control">
                        <p>You Have {{ (Object.keys(coloursDict).length - 1) == 1 ? (Object.keys(coloursDict).length - 1) + ' Colour' : (Object.keys(coloursDict).length - 1) + ' Colours' }}</p>
                        <q-btn class="glossy" rounded color="primary" label="Create Colour" @click="projectRequest=`createColour`" style="width: 95%;"/>
                    </div>
                    <div class="items">
                        <template v-for="(colourDict, colourID) in coloursDict" :key="colourDict">
                            <div v-if="colourID != `colourWhite`" class="list_item" :data="colourID" @click="open_edit_form($event, `editColourForm`, `colours`)">
                                <div class="colour_preview" :style="{backgroundColor: colourDict['colour']}"></div>
                                <p>{{ colourDict.name }}</p>
                            </div>
                        </template>
                    </div>
                </div>
               
                <ProjectForms :projectForm="projectRequest" @cancelled="projectRequest=``"/>
            </div>
            <div id="invoicing_container" v-if="settingsPage == `invoicing`">
            
            </div>
            <div id="records_container" v-if="settingsPage == `records`">
            
            </div>
        </div>
    </div>
</template>

<script>
import { userDict } from '../main.js'
import { ref } from 'vue'
import ProjectForms from '../components/ProjectForms'

export default {
    name: 'SettingsView',
    components: {
    ProjectForms
},
    data(){
        return{
            settingsPage: '',
            projectDict: {},
            colourDict: {},
            projectRequest: ''
        }
    },
    mounted(){
        this.projectDict = {...userDict['projects']}
        this.coloursDict = {...userDict['colours']}
    },
    methods: {
        
    },
    setup () {
        return {
            tab: ref('')
        }  
    }
}
</script>
<style scoped>
.pageHome{
    flex-direction: column;
    align-items: center;
}
#settings_nav{
    width: 100%;
}
#settings_section{
    width: 100%;
    height: 100%;
    border-top: 1px solid black;
}
#settings_section > div{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100%;
}
#project_settings{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
}
.settings_bottom_control{
    font-family: 'Lato';
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 95%;
	height: 80px;
}
.items{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 95%;
}
.list_item{
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    width: 95%;
    height: 50px;
    padding: 0 20px;
    color: white;
    background-color: #2cb311;
    cursor: pointer;
    font-family: Lato;
    font-weight: 900;
    font-size: 1.6em;
    border-radius: 5px;
    gap: 10px;
}
.colour_preview {
    height: 70%;
    aspect-ratio: 1;
    margin-right: 0px;
    border-radius: 10px;
}
</style>