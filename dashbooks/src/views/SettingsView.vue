<template>
    <div class="pageHome">
        <div id="settings_nav">
            <q-toolbar class="bg-secondary text-white shadow-2 rounded-borders glossy">
            <q-tabs v-model="tab" shrink style="width:100%">
                <q-tab name="Projects" label="Projects" @click="settingsPage = `projects`"/>
                <q-tab name="Invoicing" label="Invoicing" @click="settingsPage = `invoicing`"/>
                <q-tab name="Records" label="Records" @click="settingsPage = `records`"/>
                <q-tab name="Archive" label="Archive" @click="settingsPage = `archive`"/>
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
                    <div class="item_container">
                        <div class="items">
                            <div v-for="(projectDict, projectID) in userObj['projects']" :key="projectDict" class="list_item" :data="projectID" @click="editProject($event, `editProject`)" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
                                <div style="pointer-events: none;">
                                    <p style="pointer-events: none;">{{ projectDict.name }}</p>
                                    <p style="font-size: small; pointer-events: none;">Duration: {{ projectDict.duration }} Weeks</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="settings_container">
                    <div class="settings_bottom_control">
                        <p>You Have {{ (Object.keys(userObj['colours']).length - 1) == 1 ? (Object.keys(userObj['colours']).length - 1) + ' Colour' : (Object.keys(userObj['colours']).length - 1) + ' Colours' }}</p>
                        <q-btn class="glossy" rounded color="primary" label="Create Colour" @click="projectRequest=`createColour`" style="width: 95%;"/>
                    </div>
                    <div class="item_container">
                        <div class="items">
                            <template v-for="(colourDict, colourID) in userObj['colours']" :key="colourDict">
                                <div v-if="colourID != `colourWhite`" class="list_item" :data="colourID" @click="editProject($event, `editColour`)" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
                                    <div class="colour_preview" :style="{backgroundColor: colourDict['colour']}" style="margin-right:auto;"></div>
                                    <div style="pointer-events: none;">
                                        <p style="pointer-events: none;">{{ colourDict.name }}</p>
                                        <p style="font-size: small;">${{ colourDict.rate }}</p>
                                    </div>
                                    <div class="colour_preview" :style="{backgroundColor: colourDict['colour']}" style="margin-left:auto; opacity: 0;"></div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
               
                <ProjectForms :projectForm="projectRequest" @cancelled="projectRequest=``"/>
            </div>
            <div id="archive_container" v-if="settingsPage == `archive`">
                <div class="settings_container">
                    <div class="settings_bottom_control">
                    <p>You Have {{ Object.keys(userObj['archive']['projects']).length == 1 ? Object.keys(userObj['archive']['projects']).length + ' Archived Project' : Object.keys(userObj['archive']['projects']).length + ' Archived Projects' }}</p>
                    </div>
                    <div class="item_container">
                        <div class="items" style="width: 100%">
                            <div v-for="(archiveDict, projectID) in userObj['archive']['projects']" :key="archiveDict" class="list_item" :data="projectID" @click="editArchive($event, `editArchive`)" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%); width: 95%">
                                <div style="pointer-events: none;">
                                    <p style="pointer-events: none;">{{ archiveDict.name }}</p>
                                    <p style="font-size: small; pointer-events: none;">Duration: {{ archiveDict.duration }} Weeks</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ArchiveForms :archiveForm="archiveRequest" @cancelled="archiveRequest=``"/>
            </div>
            <div id="invoicing_container" v-if="settingsPage == `invoicing`">
                <div class="settings_container">
                    <div class="settings_bottom_control">
                        <p>You Have {{ Object.keys(userObj['users']).length == 1 ? Object.keys(userObj['users']).length + ' User' : Object.keys(userObj['users']).length + ' Users' }}</p>
                        <q-btn class="glossy" rounded color="primary" label="Create User" @click="invoiceRequest=`createUser`" style="width: 95%;"/>
                    </div>
                    <div class="item_container">
                        <div class="items">
                            <div v-for="(userDict, userID) in userObj['users']" :key="userDict" class="list_item" :data="userID" @click="editInvoice($event, `editUser`)" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">{{ userDict.user }}</div>
                        </div>
                    </div>
                </div>
                <div class="settings_container">
                    <div class="settings_bottom_control">
                        <p>You Have {{ Object.keys(userObj['clients']).length == 1 ? Object.keys(userObj['clients']).length + ' Client' : Object.keys(userObj['clients']).length + ' Clients' }}</p>
                        <q-btn class="glossy" rounded color="primary" label="Create Client" @click="invoiceRequest=`createClient`" style="width: 95%;"/>
                    </div>
                    <div class="item_container">
                        <div class="items">
                            <div v-for="(clientDict, clientID) in userObj['clients']" :key="clientDict" class="list_item" :data="clientID" @click="editInvoice($event, `editClient`)" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">{{ clientDict.client }}</div>
                        </div>
                    </div>
                </div>
                <InvoiceForms :invoiceForm="invoiceRequest" @cancelled="invoiceRequest=``"/>
            </div>
            <div id="records_container" v-if="settingsPage == `records`">
                <div class="settings_container">
                    <div class="settings_bottom_control">
                        <p>You Have {{(Object.keys(userObj['records']['categories']).length) == 1 ? (Object.keys(userObj['records']['categories']).length) + ' Category' : (Object.keys(userObj['records']['categories']).length) + ' Categories' }}</p>
                        <q-btn class="glossy" rounded color="primary" label="Create Category" @click="recordRequest=`createCategory`" style="width: 95%;"/>
                    </div>
                    <div class="item_container">
                        <div class="items">
                            <template v-for="(status, Category) in userObj['records']['categories']" :key="Category">
                                <div class="list_item" :data="Category" :category="Category" @click="editRecords($event, `editCategory`)" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
                                    {{ Category }}
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="settings_container">
                    <div class="settings_bottom_control">
                        <p>You Have {{ ((userObj['records']['payee']).length) == 1 ? ((userObj['records']['payee']).length) + ' Payee' : ((userObj['records']['payee']).length) + ' Payees' }}</p>
                        <q-btn class="glossy" rounded color="primary" label="Create Payee" @click="recordRequest=`createPayee`" style="width: 95%;"/>
                    </div>
                    <div class="item_container">
                        <div class="items">
                            <template v-for="payee in userObj['records']['payee']" :key="payee">
                                <div class="list_item" :data="`payee`" :payee="payee" @click="editRecords($event, `editPayee`)" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
                                    {{ payee }}
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="settings_container">
                    <div class="settings_bottom_control">
                        <p>You Have {{ ((userObj['records']['accounts']).length) == 1 ? ((userObj['records']['accounts']).length) + ' Account' : ((userObj['records']['accounts']).length) + ' Accounts' }}</p>
                        <q-btn class="glossy" rounded color="primary" label="Create Account" @click="recordRequest=`createAccount`" style="width: 95%;"/>
                    </div>
                    <div class="item_container">
                        <div class="items">
                            <template v-for="Account in userObj['records']['accounts']" :key="Account">
                                <div class="list_item" :data="`accounts`" :account="Account" @click="editRecords($event, `editAccount`)" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
                                    {{ Account }}
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <RecordForms :recordForm="recordRequest" @cancelled="recordRequest=``"/>
            </div>
        </div>
    </div>
</template>

<script>
import { userDict } from '../main.js'
import { ref } from 'vue'
import ProjectForms from '../components/ProjectForms'
import InvoiceForms from '../components/InvoiceForms'
import RecordForms from '../components/RecordForms'
import ArchiveForms from '../components/ArchiveForms'
import $ from 'jquery'

export default {
    name: 'SettingsView',
    components: {
        ProjectForms,
        InvoiceForms,
        RecordForms,
        ArchiveForms
    },
    data(){
        return{
            settingsPage: '',
            projectRequest: '',
            invoiceRequest: '',
            recordRequest: '',
            archiveRequest: '',
            userObj: userDict
        }
    },
    mounted(){
    },
    methods: {
        editArchive(event, form){
            const ID = $(event.target).attr('data');
            this.archiveRequest = form;
            this.$nextTick(() => {
                $(`#edit_projectID_archive`).attr(`projectid`, ID);
            });
        },
        editProject(event, form){
            const ID = $(event.target).attr('data');
            this.projectRequest = form;
            this.$nextTick(() => {
                if(form.includes('Project')){
                    $(`#edit_projectID`).attr(`projectid`, ID);
                    $(`#edit_project_name`).val(userDict['projects'][ID]['name']);
                    $(`#edit_project_duration`).val(userDict['projects'][ID]['duration']);
                    $(`#edit_project_target`).val(userDict['projects'][ID]['targetHours']);
                    $('#edit_project_archive').prop('checked', false);
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
            this.recordRequest = form;
            this.$nextTick(() => {
                if(form.includes('Category')){
					let category = $(event.target).attr(`category`)
                    $(`#edit_category_old`).attr(`oldcategory`, category);
                    $(`#edit_category`).val(category);
                    $(`#edit_category_status`).prop('checked', userDict['records']['categories'][category]);
                }else if(form.includes('Payee')){
                    let payee = $(event.target).attr(`payee`);
                    $(`#edit_payee_old`).attr(`oldpayee`, payee);
                    $(`#edit_payee`).val(payee);
                }else{
                    let account = $(event.target).attr(`account`)
                    $(`#edit_account_old`).attr(`oldaccount`, account);
                    $(`#edit_account`).val(account);
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
    gap: 7px;
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
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 15px;
    width: 95%;
}
.list_item{
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 45%;
    height: 110px;
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
.item_container{
    width: 100%;
    height: calc(100vh - var(--navbar_height) - 180px - 18px);
    overflow-y: auto;
}
</style>