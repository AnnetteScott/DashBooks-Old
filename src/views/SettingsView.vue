<template>
    <div class="pageHome">
        <div id="selection_container">
            <div>PROJECT:</div>
            <div v-for="colour, setting in projectList" :key="setting" class="setting_button" :style="`background-color: #${colour}`" @click="settingsPage = setting">{{setting}}</div>
            <div>ARCHIVE:</div>
            <div v-for="colour, setting in archiveList" :key="setting" class="setting_button" :style="`background-color: #${colour}`" @click="settingsPage = setting">{{setting}}</div>
            <div>INVOICING:</div>
            <div v-for="colour, setting in invoiceList" :key="setting" class="setting_button" :style="`background-color: #${colour}`" @click="settingsPage = setting">{{setting}}</div>
            <div>RECORD:</div>
            <div v-for="colour, setting in recordList" :key="setting" class="setting_button" :style="`background-color: #${colour}`" @click="settingsPage = setting">{{setting}}</div>
        </div>
        <div id="settings_section">
            <div id="projects_container" v-if="settingsPage == `Projects`">
                <div class="settings_container">
                    <div class="settings_bottom_control">
                    <p>You Have {{ Object.keys(userObj['projects']).length == 1 ? Object.keys(userObj['projects']).length + ' Project' : Object.keys(userObj['projects']).length + ' Projects' }}</p>
                    <q-btn class="glossy" rounded color="primary" label="Create Project" @click="projectRequest=`createProject`" style="width: 95%;"/>
                    </div>
                    <div class="item_container">
                        <div class="items">
                            <div v-for="(projectDict, projectID) in userObj['projects']" :key="projectDict" class="list_item" :data="projectID" @click="editProject($event, `editProject`)" :style="{background: `radial-gradient(circle, ${projectDict['colour'][1]} 0%, ${projectDict['colour'][0]} 100%)`, color: `${pickTextColorBasedOnBgColor(projectDict['colour'][1])}`}">
                                <div style="pointer-events: none;">
                                    <p style="pointer-events: none;">{{ projectDict.name }}</p>
                                    <p style="font-size: small; pointer-events: none;">Duration: {{ projectDict.duration }} Weeks</p>
                                    <p style="font-size: small; pointer-events: none;">Target Hours: {{ projectDict.targetHours }}H</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="archive_container" v-if="settingsPage == `Archived Projects`">
                <div class="settings_container">
                    <div class="settings_bottom_control">
                    <p>You Have {{ Object.keys(userObj['archive']['projects']).length == 1 ? Object.keys(userObj['archive']['projects']).length + ' Archived Project' : Object.keys(userObj['archive']['projects']).length + ' Archived Projects' }}</p>
                    </div>
                    <div class="item_container">
                        <div class="items" style="width: 100%">
                            <div v-for="(archiveDict, projectID) in userObj['archive']['projects']" :key="archiveDict" class="list_item" :data="projectID" @click="editArchive($event, `editArchive`)" :style="{background: `radial-gradient(circle, ${archiveDict['colour'][1]} 0%, ${archiveDict['colour'][0]} 100%)`, width: '95%', color: `${pickTextColorBasedOnBgColor(archiveDict['colour'][1])}`}">
                                <div style="pointer-events: none;">
                                    <p style="pointer-events: none;">{{ archiveDict.name }}</p>
                                    <p style="font-size: small; pointer-events: none;">Duration: {{ archiveDict.duration }} Weeks</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="colours_container" v-if="settingsPage == `Colours`">
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
            </div>
            <div id="user_container" v-if="settingsPage == `Users`">
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
            </div>
            <div id="client_container" v-if="settingsPage == `Clients`">
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
            </div>
            <div id="category_container" v-if="settingsPage == `Categories`">
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
            </div>
            <div id="payee_container" v-if="settingsPage == `Payees`">
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
            </div>
            <div id="accounts_container" v-if="settingsPage == `Accounts`">
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
            </div>
        </div>
    </div>
    <ArchiveForms :archiveForm="archiveRequest" @cancelled="archiveRequest=``"/>
    <ProjectForms :projectForm="projectRequest" @cancelled="projectRequest=``"/>
    <InvoiceForms :invoiceForm="invoiceRequest" @cancelled="invoiceRequest=``"/>
    <RecordForms :recordForm="recordRequest" @cancelled="recordRequest=``"/>
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
            userObj: userDict,
            projectList: {"Projects": "00D3DB", "Colours": "00D3DB"},
            archiveList: {"Archived Projects": "14DB00"},
            invoiceList: {"Users": "EEA700", "Clients": "EEA700"},
            recordList: {"Categories": "D200E2", "Accounts": "D200E2","Payees": "D200E2"}
        }
    },
    mounted(){
    },
    methods: {
        pickTextColorBasedOnBgColor(bgColor) {
            let color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
            let r = parseInt(color.substring(0, 2), 16); // hexToR
            let g = parseInt(color.substring(2, 4), 16); // hexToG
            let b = parseInt(color.substring(4, 6), 16); // hexToB
            let uicolors = [r / 255, g / 255, b / 255];
            let c = uicolors.map((col) => {
                if (col <= 0.03928) {
                return col / 12.92;
                }
                return Math.pow((col + 0.055) / 1.055, 2.4);
            });
            let L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
            return (L > 0.179) ? '#000000' : '#ffffff';
        },
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
                    $(`#edit_project_colour`).val(userDict['projects'][ID]['colour'][0]);
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
    watch:{
        settingsPage(newValue){
            console.log(newValue)
        }
    }
}
</script>
<style scoped lang="scss">
#selection_container{
    margin-top: 50px;
    margin-left: 10px;
    width: 250px;
    gap: 18px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.setting_button{
    border: 1px solid black;
    cursor: pointer;
    padding: 8px 0px;
    border-radius: 10px;
    user-select: none;
}
.setting_button:hover {
	box-shadow: 0 14px 28px rgba(0, 0, 0, 0.082), 0 10px 10px rgba(0, 0, 0, 0.11);
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