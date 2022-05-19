<template>
    <div class="pageHome">
        <div id="selection_container">
            <q-btn-dropdown color="primary" label="Years">
                <q-list>
                    <template v-for="yearID in years" :key="yearID">
                        <q-item clickable v-close-popup @click="" :data="yearID">
                            <q-item-section style="pointer-events: none;">
                                <q-item-label style="pointer-events: none;">{{ yearID }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-list>
            </q-btn-dropdown>
            <template v-for="month in monthNames" :key="month">
                <q-btn class="glossy green_button" :label="month" />
            </template>
        </div>
        <div id="content_container" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%); color: white;}"></div>
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
            years: [],
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            currentYear: 2022
        }
    },
    mounted(){
        let date = new Date();
        this.currentYear = date.getFullYear();
        userDict['budgets'] = {}
        for(const objKey of Object.keys(userDict['records'])){
			if(objKey != 'accounts' && objKey != 'categories' && objKey != 'payee' && objKey != 'savedTransactions'){
				let yearsKey = objKey.split(" - ")
                if(!(this.years.includes(yearsKey[0]))){
                    this.years.push(yearsKey[0])
                }
                if(!(this.years.includes(yearsKey[1]))){
                    this.years.push(yearsKey[1])
                }
                if(!(yearsKey[0] in userDict['budgets'])){
                    userDict['budgets'][yearsKey[0]] = {}
					userDict['budgets'][yearsKey[0]] = this.getAllMondays(parseInt(yearsKey[0]))
                }
                if(!(yearsKey[1] in userDict['budgets'])){
                    userDict['budgets'][yearsKey[1]] = {}
					userDict['budgets'][yearsKey[1]] = this.getAllMondays(parseInt(yearsKey[1]))
                }
			}
            
		}
        console.log(userDict)
    },
    methods: {
        getAllMondays(year){
            let d = new Date();
            let months = {"Jan": {}, "Feb": {}, "Mar": {}, "Apr": {}, "May": {}, "Jun": {}, "Jul": {}, "Aug": {}, "Sep": {}, "Oct": {}, "Nov": {}, "Dec": {}};

            d.setDate(1);
            d.setMonth(0);
            d.setFullYear(year)
            

            // Get the first Monday in the month
            while (d.getDay() !== 1) {
                d.setDate(d.getDate() + 1);
            }

            let backUpCounter = 0
            // Get all the other Mondays in the month
            while (d.getFullYear() === year && backUpCounter < 60) {
                let currentMonth = this.monthNames[d.getMonth()];
                let today = new Date(d.getTime());
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                months[currentMonth][`${dd}/${mm}`] = {'income': 0, 'expenses': 0, 'accountTotal': 0}
                d.setDate(d.getDate() + 7);
                backUpCounter++; 
            }
            console.log(months)
            return months
        }
    }
}
</script>
<style scoped lan="scss">
.pageHome{
    align-items: center;
    gap: 50px;
}
#selection_container{
    width: 12%;
    height: 90%;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

#content_container{
    width: 80%;
    height: 90%;
    border-radius: 25px;
}

.green_button{
    background-color: #2FB022;
}
</style>
