<template>
    <h4>TimeSheets:</h4>
    <p>You have logged {{ userObj['timeLogged'][today]['hours'] }}H and earnt ${{ userObj['timeLogged'][today]['pay'] }} today</p>
    <div class="pageHome">
        <div class="item_container">
            <div class="items">
                <div v-for="(projectDict, projectID) in userObj['projects']" :key="projectDict" class="list_item" :data="projectID" @click="$router.push({ name: 'timesheet', params: { 'projectID': projectID } })" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
                    <div>
                        <p>{{ projectDict.name }}</p>
                        <p style="font-size: small;">Duration: {{ projectDict.duration }} Weeks</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { userDict } from '../main.js'
export default {
    name: 'projectView',
    components: {

    },
    data(){
        return{
            userObj: userDict,
            today: ''
        }
    },
    beforeMount(){
        let date = new Date();
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = date.getFullYear();
        this.today = mm + '/' + dd + '/' + yyyy;
        if(!(this.today in userDict['timeLogged'])){
            userDict['timeLogged'] = {}
            userDict['timeLogged'][this.today] = {'hours': 0, 'pay': 0};
        }
        console.log(userDict)
    },
    methods: {
        
    }
}
</script>

<style scoped>
.item_container{
    width: 100%;
    height: calc(100vh - var(--navbar_height) - 150px - 18px);
    overflow-y: auto;
}
.items{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 15px;
    width: 100%;
}
.list_item{
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 90%;
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
</style>
