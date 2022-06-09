<template>
    <div class="pageHome">
        <div class="inner">
            <h4>Welcome To DashBooks Help!</h4>
            <br>
            <div class="section">
                <img src="../assets/settingsProject.webp" alt="Girl in a jacket" width="1000" height="357" />
                <div>
                    <p> To get started with DashBooks, begin by heading to the "Settings" Tab. If you'd like to use the timesheet and invoicing feature, click on the "Projects" tab, then click "Create Project" and fill out the form that appears.</p>
                    <p>If you've made a mistake, just click on the tile and you'll be able to edit the name, duration (can only increase), target hours and the project colour.</p>
                    <br>
                    <p>You'll also need to create "Colours" as these are what you use to fill out the timesheet. They allow you to charge different rates for hours worked.</p>
                    <br>
                    <p>If you only want to use the Records section of DashBooks, that's absolutely fine! Just head into the settings section and create Categories, Payees and Bank Accounts that you need. E.g:</p>
                    <p>If you're a contractor, you might create a category for Contract Work, Low value assets (LVA), etc. If you want to keep track of who the is paying you, you'd create a payee. To keep track of which bank account the money is going into or out of, create an "Account".</p>
                </div> 
            </div>
            <br>
            <div class="section">
                <img src="../assets/settingsProject2.webp" alt="Girl in a jacket" width="212" height="351" />
                <div>
                    <p>In order to keep your application tidy, you can archive projects. To do this, simply heading to settings, click on the project you'd like to archive and then check the checkbox.</p>
                </div> 
            </div>
            <br>
            <div class="section">
                <img src="../assets/timesheet.webp" alt="Girl in a jacket" width="904" height="319" />
                <div>
                    <p>To begin logging hours, heading to the "TimeSheet" section. This displays a list of you're projects along with the amount of hours you've logged today and the amount earnt.</p>
                    <p>Just click on the project you'd like to log hours for.</p>
                </div> 
            </div>
            <br>
            <div class="section">
                <img src="../assets/weekselection.webp" alt="Girl in a jacket" width="561" height="700" />
                <div>
                    <p>Select the week you'd like to log hours for from the list on the left hand side.</p>
                </div> 
            </div>
            <br>
            <div class="section">
                <img src="../assets/timesheetDrag.webp" alt="Girl in a jacket" width="495" height="401" />
                <div>
                    <p>Select the week you'd like to log hours for from the list on the left hand side.</p>
                </div> 
            </div>
        </div>
    </div>
</template>

<script>
import { userDict } from '../main.js'
export default {
    name: 'HelpView',
    components: {

    },
    data(){
        return{
            
        }
    },
    mounted(){

    },
    methods: {
        
    }
}
</script>
<style scoped lan="scss">
.section{
    width: 100%;
    display: flex;
}

img{
    margin-left: 20px;
}
p{
    margin: 10px !important;
}
</style>
