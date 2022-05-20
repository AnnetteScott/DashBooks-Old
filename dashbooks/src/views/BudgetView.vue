<template>
    <div class="pageHome">
        <div id="selection_container">
            <q-btn-dropdown color="primary" label="Years">
                <q-list>
                    <template v-for="yearID in years" :key="yearID">
                        <q-item clickable v-close-popup @click="loadYears" :data="yearID">
                            <q-item-section style="pointer-events: none;">
                                <q-item-label style="pointer-events: none;">{{ yearID }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-list>
            </q-btn-dropdown>
            <div id="months_container">
                <template v-if="currentYear != 0">
                        <template v-for="month in monthNames" :key="month">
                            <div class="glossy green_button" :data="month" @click="loadMonth">{{month}}</div>
                        </template>
                </template>
            </div>
        </div>
        <div id="content_container" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%); color: white;">
            <div id="info">Select A Year To Get Started!</div>
            <div id="budget_display" v-if="budgetDict != ''">
                <template v-for="(heading, index) in headings" :key="heading">
                    <div class="column_budget">
                        <template v-if="heading == `Start Date`">
                            <div>Start Date</div>
                            <div v-for="(item, keys) in budgetDict" :key="keys">{{ keys }}</div>
                        </template>
                        <template v-if="heading == `Income`">
                            <div>Income</div>
                            <div v-for="(item, keys) in budgetDict" :key="keys" :startdate="keys">{{ item.income }}</div>
                        </template>
                        <template v-if="heading == `Expenses`">
                            <div>Expenses</div>
                            <div v-for="(item, keys) in budgetDict" :key="keys" :startdate="keys">{{ item.expenses }}</div>
                        </template>
                        <template v-if="heading == `Difference`">
                            <div>Difference</div>
                            <div v-for="(item, keys) in budgetDict" :key="keys" :startdate="keys">{{ item.income + item.expenses }}</div>
                        </template>
                        <template v-if="heading == `Account Total`">
                            <div>Account Total</div>
                            <div v-for="(item, keys) in budgetDict" :key="keys" :startdate="keys" @click="editTotal">{{ item.accountTotal }}</div>
                        </template>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { userDict } from '../main.js'
import $ from 'jquery'
export default {
    name: 'HelpView',
    components: {

    },
    data(){
        return{
            years: [],
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            currentYear: 0,
            currentMonth: '',
            budgetDict: '',
            headings: ['Start Date', 'Income', 'Expenses', 'Difference', 'Account Total']
        }
    },
    mounted(){
        let date = new Date();
        this.currentYear = date.getFullYear();
        userDict['budgets'] = {}
        if(!(this.currentYear in userDict['budgets'])){
            userDict['budgets'][this.currentYear] = {}
            userDict['budgets'][this.currentYear] = this.getAllMondays(this.currentYear)
        }
        this.years = Object.keys(userDict['budgets'])
        $('#info').text(`Year: ${this.currentYear}`)
        console.log(userDict);
        
    },
    methods: {
        editTotal(event){
            let startDate = $(event.target).attr('startdate');
            //userDict['budgets'][this.currentYear][this.currentMonth][startDate]['accountTotal'] += 1
            this.addToTotal(startDate, 10)
        },
        loadYears(event){
            this.currentYear = parseInt($(event.target).attr('data'));
            $('#info').text(`Year: ${this.currentYear}`)
        },
        loadMonth(event){
            this.currentMonth = (this.monthNames.indexOf($(event.target).attr('data')) + 1).toString().padStart(2, '0');
            $('#info').text(`Year: ${this.currentYear} Month: ${this.monthNames[parseInt(this.currentMonth - 1)]}`);
            this.budgetDict = userDict['budgets'][this.currentYear][this.currentMonth];
            $('.green_button').each((index, weekButton) => {
				$(weekButton).removeClass('active_button');
			});
			$(event.target).addClass('active_button')
        },
        getAllMondays(year){
            let d = new Date();
            let months = {"01": {}, "02": {}, "03": {}, "04": {}, "05": {}, "06": {}, "07": {}, "08": {}, "09": {}, "10": {}, "11": {}, "12": {}};

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
                let today = new Date(d.getTime());
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                months[mm][`${dd}/${mm}/${d.getFullYear()}`] = {'income': 0, 'expenses': 0, 'accountTotal': 0}
                d.setDate(d.getDate() + 7);
                backUpCounter++; 
            }
            return months
        },
        addToTotal(sDate, amount){
            const date = new Date(this.convertDate(sDate));
            for(const[yearID, yearDict] of Object.entries(userDict['budgets'])){
                for(const[month, monthDict] of Object.entries(yearDict)){
                    for(const[startDate, dateDict] of Object.entries(monthDict)){
                        const newDate = new Date(this.convertDate(startDate));
                        if(date.getTime() <= newDate.getTime()){
                            dateDict['accountTotal'] += amount
                        }
                    }
                }
            }
        },
        convertDate(date){
            let newDate = date.split('/');
            return `${newDate[1]}/${newDate[0]}/${newDate[2]}`
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
}

#months_container{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

#months_container > div {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    cursor: pointer;
}

#content_container{
    width: 80%;
    height: 90%;
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.green_button{
    background-color: #2FB022;
}
#info{
    width: 95%;
}
#budget_display{
    width: 95%;
    height: 95%;
    display: flex;
}
.budget_line{
    display: flex;
    justify-content: space-evenly;
    width: 100%;
}
#info_container{
    display: flex;
}
.column_budget{
	width: 100%;
    height: 50%;
	z-index: 2;
	min-width: 90px;
	border-top: 1px solid black;
    margin-top: 10px;
}

.column_budget > div{
	background-color: white;
    border-bottom: 1px solid black;
    color: black;
    height: 16%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    cursor: pointer;
    user-select: none;
}
</style>
