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
                <div class="settings_container">
                    <div class="settings_bottom_control">
                    <p>You Have {{ Object.keys(userObj['projects']).length == 1 ? Object.keys(userObj['projects']).length + ' Project' : Object.keys(userObj['projects']).length + ' Projects' }}</p>
                    <q-btn class="glossy" rounded color="primary" label="Create Project" @click="projectRequest=`createProject`" style="width: 95%;"/>
                    </div>
                    <div class="items">
                        <div v-for="(projectDict, projectID) in userObj['projects']" :key="projectDict" class="list_item" :data="projectID" @click="editProject($event, `editProject`)" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">{{ projectDict.name }}</div>
                    </div>
                </div>
                <div class="settings_container">
                    <div class="settings_bottom_control">
                        <p>You Have {{ (Object.keys(userObj['colours']).length - 1) == 1 ? (Object.keys(userObj['colours']).length - 1) + ' Colour' : (Object.keys(userObj['colours']).length - 1) + ' Colours' }}</p>
                        <q-btn class="glossy" rounded color="primary" label="Create Colour" @click="projectRequest=`createColour`" style="width: 95%;"/>
                    </div>
                    <div class="items">
                        <template v-for="(colourDict, colourID) in userObj['colours']" :key="colourDict">
                            <div v-if="colourID != `colourWhite`" class="list_item" :data="colourID" @click="editProject($event, `editColour`)" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
                                <div class="colour_preview" :style="{backgroundColor: colourDict['colour']}" style="margin-right:auto;"></div>
                                <p>{{ colourDict.name }}</p>
                                <div class="colour_preview" :style="{backgroundColor: colourDict['colour']}" style="margin-left:auto; opacity: 0;"></div>
                            </div>
                        </template>
                    </div>
                </div>
               
                <ProjectForms :projectForm="projectRequest" @cancelled="projectRequest=``"/>
            </div>
            <div id="invoicing_container" v-if="settingsPage == `invoicing`">
                <div class="settings_container">
                    <div class="settings_bottom_control">
                        <p>You Have {{ Object.keys(userObj['users']).length == 1 ? Object.keys(userObj['users']).length + ' User' : Object.keys(userObj['users']).length + ' Users' }}</p>
                        <q-btn class="glossy" rounded color="primary" label="Create User" @click="invoiceRequest=`createUser`" style="width: 95%;"/>
                    </div>
                    <div class="items">
                        <div v-for="(userDict, userID) in userObj['users']" :key="userDict" class="list_item" :data="userID" @click="editInvoice($event, `editUser`)" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">{{ userDict.user }}</div>
                    </div>
                </div>
                <div class="settings_container">
                    <div class="settings_bottom_control">
                        <p>You Have {{ Object.keys(userObj['clients']).length == 1 ? Object.keys(userObj['clients']).length + ' Client' : Object.keys(userObj['clients']).length + ' Clients' }}</p>
                        <q-btn class="glossy" rounded color="primary" label="Create Client" @click="invoiceRequest=`createClient`" style="width: 95%;"/>
                    </div>
                    <div class="items">
                        <div v-for="(clientDict, clientID) in userObj['clients']" :key="clientDict" class="list_item" :data="clientID" @click="editInvoice($event, `editClient`)" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">{{ clientDict.client }}</div>
                    </div>
                </div>
                <InvoiceForms :invoiceForm="invoiceRequest" @cancelled="invoiceRequest=``"/>
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
import InvoiceForms from '../components/InvoiceForms'
import $ from 'jquery'

export default {
    name: 'SettingsView',
    components: {
    ProjectForms,
    InvoiceForms
},
    data(){
        return{
            settingsPage: '',
            projectRequest: '',
            invoiceRequest: '',
            userObj: userDict
        }
    },
    mounted(){
    },
    methods: {
        editProject(event, form){
            const ID = $(event.target).attr('data');
            console.log(ID)
            this.projectRequest = form;
            this.$nextTick(() => {
                if(form.includes('Project')){
                    $(`#edit_projectID`).attr(`projectid`, ID);
                    $(`#edit_project_name`).val(userDict['projects'][ID]['name']);
                    $(`#edit_project_duration`).val(userDict['projects'][ID]['duration']);
                    $(`#edit_project_target`).val(userDict['projects'][ID]['targetHours']);
                }else{
                    $(`#edit_colourID`).attr(`colourid`, ID);
					$(`#edit_colour_name`).val(userDict['colours'][ID]['name']);
					$(`#edit_colour_rate`).val(userDict['colours'][ID]['rate']);
					$(`#edit_colour_colour`).val(userDict['colours'][ID]['colour']);
                }
            });
        }, 
        editInvoice(event, form){
            const ID = $(event.target).attr('data');
            this.invoiceRequest = form;
            this.$nextTick(() => {
                if(form.includes('User')){
					$(`#edit_user`).val(userDict['users'][ID]['user']);
					$(`#edit_user_name`).val(userDict['users'][ID]['name']);
					$(`#edit_user_addOne`).val(userDict['users'][ID]['addOne']);
					$(`#edit_user_addTwo`).val(userDict['users'][ID]['addTwo']);
					$(`#edit_user_city`).val(userDict['users'][ID]['city']);
					$(`#edit_user_country`).val(userDict['users'][ID]['country']);
					$(`#edit_user_contact`).val(userDict['users'][ID]['contact']);
					$(`#edit_userID`).attr(`userid`, ID);
                }else{
					$(`#edit_client`).val(userDict['clients'][ID]['client']);
					$(`#edit_client_name`).val(userDict['clients'][ID]['name']);
					$(`#edit_client_addOne`).val(userDict['clients'][ID]['addOne']);
					$(`#edit_client_addTwo`).val(userDict['clients'][ID]['addTwo']);
					$(`#edit_client_city`).val(userDict['clients'][ID]['city']);
					$(`#edit_client_country`).val(userDict['clients'][ID]['country']);
					$(`#edit_client_contact`).val(userDict['clients'][ID]['contact']);
					$(`#edit_clientID`).attr(`clientid`, ID);
                }
            });
        },
        editRecords(event, form){
            const ID = $(event.target).attr('data');
            this.invoiceRequest = form;
            this.$nextTick(() => {
                if(form.includes('User')){
					$(`#edit_user`).val(userDict['users'][ID]['user']);
					$(`#edit_user_name`).val(userDict['users'][ID]['name']);
					$(`#edit_user_addOne`).val(userDict['users'][ID]['addOne']);
					$(`#edit_user_addTwo`).val(userDict['users'][ID]['addTwo']);
					$(`#edit_user_city`).val(userDict['users'][ID]['city']);
					$(`#edit_user_country`).val(userDict['users'][ID]['country']);
					$(`#edit_user_contact`).val(userDict['users'][ID]['contact']);
					$(`#edit_userID`).attr(`userid`, ID);
                }else{
					$(`#edit_client`).val(userDict['clients'][ID]['client']);
					$(`#edit_client_name`).val(userDict['clients'][ID]['name']);
					$(`#edit_client_addOne`).val(userDict['clients'][ID]['addOne']);
					$(`#edit_client_addTwo`).val(userDict['clients'][ID]['addTwo']);
					$(`#edit_client_city`).val(userDict['clients'][ID]['city']);
					$(`#edit_client_country`).val(userDict['clients'][ID]['country']);
					$(`#edit_client_contact`).val(userDict['clients'][ID]['contact']);
					$(`#edit_clientID`).attr(`clientid`, ID);
                }
            });
        },
    },
    setup () {
        return {
            tab: ref('')
        }  
    }
}
</script>
<style scoped lang="scss">
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
}
#settings_section > div{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100%;
}
.settings_container{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 18px;
    border: 1px solid $accent;
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
    gap: 15px;
    width: 95%;
    overflow-y: auto;
}
.list_item{
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 95%;
    height: 50px;
    padding: 0 20px;
    color: white;
    cursor: pointer;
    font-family: Lato;
    font-weight: 900;
    font-size: 1.6em;
    border-radius: 5px;
    gap: 10px;
}
.list_item:hover {
	box-shadow: 0 14px 28px rgba(0, 0, 0, 0.082), 0 10px 10px rgba(0, 0, 0, 0.11);
}
.colour_preview {
    height: 70%;
    aspect-ratio: 1;
    margin-right: 0px;
    border-radius: 10px;
    border: 1px solid black;
}
</style>