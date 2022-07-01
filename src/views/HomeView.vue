<template>
	<div class="pageHome">
		<div class="inner">
			<h4>Welcome To DashBooks!</h4>
			<div id="tile_container">
				<div id="records_container">
				    <div class="tile">
                        <div class="top_display">
							<p>Income: {{ currentYear }}</p>
							<div>
								<q-btn-dropdown color="primary" label="Years">
								<q-list>
									<template v-for="yearID in years" :key="yearID">
										<q-item clickable v-close-popup @click="loadNetData" :data="yearID">
											<q-item-section style="pointer-events: none;">
												<q-item-label style="pointer-events: none;">{{ yearID }}</q-item-label>
											</q-item-section>
										</q-item>
									</template>
								</q-list>
								</q-btn-dropdown>
							</div>
						</div>
                        <div class="mid_display">
							<p style="font-size: large">${{ numberWithCommas(netData.income) }}</p>
                            <p>Total Income for {{ currentYear }}</p>
						</div>
                        <div class="bar_grapgh" style="overflow-y: auto; justify-content: flex-start; margin-top: 10px;">
                            <template v-for="incDict in incomeArray" :key="incDict">
                                <div class="incomeBar" :style="{width: `${(220 * Math.abs(incDict.amount / netData.income))}px`}">{{ incDict.key }}: ${{ numberWithCommas(incDict.amount) }}</div>
                            </template>
						</div>
                    </div>
                    <div class="tile">
                        <div class="top_display">
							<p>Expenses: {{ currentYear }}</p>
							<div>
								<q-btn-dropdown color="primary" label="Years">
								<q-list>
									<template v-for="yearID in years" :key="yearID">
										<q-item clickable v-close-popup @click="loadNetData" :data="yearID">
											<q-item-section style="pointer-events: none;">
												<q-item-label style="pointer-events: none;">{{ yearID }}</q-item-label>
											</q-item-section>
										</q-item>
									</template>
								</q-list>
								</q-btn-dropdown>
							</div>
						</div>
                        <div class="mid_display">
							<p style="font-size: large">${{ numberWithCommas(netData.expenses) }}</p>
                            <p>Total Expenses for {{ currentYear }}</p>
						</div>
                        <div class="bar_grapgh" style="overflow-y: auto; justify-content: flex-start; margin-top: 10px;">
                            <template v-for="expDict in expensesArray" :key="expDict">
                                <div class="expenseBar" :style="{width: `${(220 * Math.abs(expDict.amount / netData.expenses))}px`}">{{ expDict.key }}: ${{ numberWithCommas(expDict.amount) }}</div>
                            </template>
						</div>
                    </div>
                    <div class="tile">
						<div class="top_display">
							<p>Net Profit: {{ currentYear }}</p>
							<div>
								<q-btn-dropdown color="primary" label="Years">
								<q-list>
									<template v-for="yearID in years" :key="yearID">
										<q-item clickable v-close-popup @click="loadNetData" :data="yearID">
											<q-item-section style="pointer-events: none;">
												<q-item-label style="pointer-events: none;">{{ yearID }}</q-item-label>
											</q-item-section>
										</q-item>
									</template>
								</q-list>
								</q-btn-dropdown>
							</div>
						</div>
						<div class="mid_display">
							<p style="font-size: large">${{ numberWithCommas(netData.income + netData.expenses) }}</p>
                            <p>Net Profit for {{ currentYear }}</p>
						</div>
						<div class="bar_grapgh" style="height: 160px">
                            <div class="incomeBar" :style="{width: `${(Math.min(370 * Math.abs(netData.income / netData.expenses), 370))}px`}">Income: &nbsp; &nbsp; ${{ numberWithCommas(netData.income) }}</div>
                            <div class="expenseBar" :style="{width: `${(Math.min(370 * Math.abs(netData.expenses / netData.income), 370))}px`}">Expenses: ${{ numberWithCommas(netData.expenses) }}</div>
						</div>
					</div>
				</div>
                <div id="project_container">
                    <div class="inner_project_tiles">
                        <template v-for="(item, projID) in projectDict" :key="projID">
                            <div class="tile">
                                <div class="top_display">
                                    <p style="font-size:x-large; border-bottom: 1px solid black;">{{ item.name }}</p>
                                </div>
                                WEEKS:
                                <div class="weeks_container">
                                    <div class="inner_weeks">
                                        <template v-for="(weekDict, week) in item.weeks" :key="week">
                                            <div class="week" :style="`${weekDict.invoiced ? 'background-color: #53b700': !weekDict.invoiced && weekDict.invoiceSent ? 'background-color: #FFB135' : '' }`">
                                                <p style="font-size:large;">{{ week }} : {{ weekDict.startDate }}</p>
                                                <p class="week_total" @click="totalWeeks" :amount="weekDict.total" :hours="weekDict.totalHours">${{ numberWithCommas(weekDict.total) }}</p>
                                                <p v-if="!weekDict.invoiceSent && checkDate(projID, week) && parseFloat(weekDict.total) != 0" style="color:#FF4F00">Invoice Is Due!</p>
                                                <p v-else-if="!weekDict.invoiced && weekDict.invoiceSent" class="mark_done right_width" @click="markDone(event, projID, week)">Mark As Paid</p>
                                                <p v-else="" class="right_width"></p>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    
                </div>
			</div>
            <div id="total_container" v-if="showTotal">
                <div id="total_amount" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)" @click="removeTotal">
                    <p>Total Pay: ${{ numberWithCommas(total) }}</p>
                    <p>Total Hours: {{ numberWithCommas(totalHours) }}H</p>
                </div>
            </div>
		</div>
	</div>
</template>

<script>
import { userDict } from '../main.js';
import $ from 'jquery';
export default {
	name: 'HomeView',
	data(){
		return{
			currentYear: '',
			netData: {'income': 0, 'expenses': 0},
            incomeArray: {},
            expensesArray: {},
			total: 0,
			totalHours: 0,
			years: [],
            projectDict: {},
            showTotal: false,
		}
	},
	mounted(){
        this.loadPage();
	},
	methods: {
        markDone(event, projectID, weekID){
            userDict['projects'][projectID]['weeks'][weekID]['invoiced'] = true; 
        },
        removeTotal(){
            this.showTotal = false;
            this.total = 0
            this.totalHours = 0
        },
        totalWeeks(event){
            this.showTotal = true;
            this.total += parseFloat($(event.target).attr('amount'))
            this.totalHours += parseFloat($(event.target).attr('hours'))
        },
        numberWithCommas(num) {
			return ((parseFloat(num).toFixed(2)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
		},
        checkDate(projectID, weekID){
            let weekDict = userDict['projects'][projectID]['weeks'][weekID]
            let newDate = weekDict['startDate'].split('/');
            newDate = `${newDate[1]}/${newDate[0]}/${newDate[2]}`;
            const d = new Date(newDate);
            const t = new Date();
            const date2 = new Date(d.getTime() + 12096e5);
            if(date2.getTime() <= t.getTime()){
                if(parseFloat(weekDict['total']) == 0){
                    userDict['projects'][projectID]['weeks'][weekID]['invoiced'] = true;
                    userDict['projects'][projectID]['weeks'][weekID]['invoiceSent'] = true;
                }
                return true
            }else{
                return false
            }

        },
		loadNetData(event){
			this.currentYear = $(event.target).attr('data');
            this.netData.income = 0;
            this.netData.expenses = 0;

            let expenseSum = {};
            let incomeSum = {};
			for(const [objKey, OBJDICT] of Object.entries(userDict['records'][this.currentYear]['transactions'])){
                if(userDict['records']['categories'][OBJDICT.category]){
                    if(OBJDICT.type == 'Credit'){
                        this.netData.income += OBJDICT.amount;
                        OBJDICT.category in incomeSum ? incomeSum[OBJDICT.category] += 0: incomeSum[OBJDICT.category] = 0;
                        incomeSum[OBJDICT.category] += OBJDICT.amount;
                    }else if(OBJDICT.type == 'Debit'){
                        objKey;
                        this.netData.expenses += OBJDICT.amount
                        OBJDICT.category in expenseSum ? expenseSum[OBJDICT.category] += 0: expenseSum[OBJDICT.category] = 0;
                        expenseSum[OBJDICT.category] += OBJDICT.amount 
                    }
                }
			}
            this.incomeArray = Object.entries(incomeSum).map(( [key, amount] ) => ({ key, amount }));
            this.expensesArray = Object.entries(expenseSum).map(( [key, amount] ) => ({ key, amount }));
            this.sortAmount();
		},
        loadPage(){
            console.log("loadPage Ran")
            let date = new Date();
            let month = date.getMonth();
            let thisYear = date.getFullYear();
            if(month < 3){
                this.currentYear = `${thisYear - 1} - ${thisYear}`;
            }else{
                this.currentYear = `${thisYear} - ${thisYear + 1}`;
            }
            for(const objKey of Object.keys(userDict['records'])){
                if(objKey != 'accounts' && objKey != 'categories' && objKey != 'headingStates' && objKey != 'payee' && objKey != 'savedTransactions'){
                    this.years.push(objKey)
                }
                
            }
            this.projectDict = userDict['projects']
            this.netData.income = 0;
            this.netData.expenses = 0;

            let expenseSum = {};
            let incomeSum = {};
            if(this.currentYear in userDict['records']){
                for(const [objKey, OBJDICT] of Object.entries(userDict['records'][this.currentYear]['transactions'])){
                    if(userDict['records']['categories'][OBJDICT.category]){
                        if(OBJDICT.type == 'Credit'){
                            this.netData.income += OBJDICT.amount;
                            OBJDICT.category in incomeSum ? incomeSum[OBJDICT.category] += 0: incomeSum[OBJDICT.category] = 0;
                            incomeSum[OBJDICT.category] += OBJDICT.amount;
                        }else if(OBJDICT.type == 'Debit'){
                            objKey;
                            this.netData.expenses += OBJDICT.amount
                            OBJDICT.category in expenseSum ? expenseSum[OBJDICT.category] += 0: expenseSum[OBJDICT.category] = 0;
                            expenseSum[OBJDICT.category] += OBJDICT.amount 
                        }
                    }
                }
            } else {
                userDict['records'][this.currentYear] = {assets: {}, transactions: {}}
            }
            this.incomeArray = Object.entries(incomeSum).map(( [key, amount] ) => ({ key, amount }));
            this.expensesArray = Object.entries(expenseSum).map(( [key, amount] ) => ({ key, amount }));
            this.sortAmount();

        },
        sortAmount(){
            this.incomeArray.sort((a, b) => a.amount - b.amount);
            this.expensesArray.sort((a, b) => a.amount - b.amount);
        },
	}
}
</script>


<style scoped lang="scss">
.inner{
	margin: 10px;
	width: 100%;
	height: calc(100% - 20px - var(--navbar_height));
	
}
#tile_container{
	width: 100%;
    height: 95%;
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
}

#tile_container > div{
	display: flex;
    justify-content: center;
    margin-bottom: 15px;
    height: 420px;
    width: 100%;
    overflow-x: auto;
    gap: 40px;
}

#tile_container > #project_container{
    justify-content: unset;
    display: unset;
}

.inner_project_tiles{
    display: flex;
    justify-content: center;
    width: fit-content;
    min-width: 100%;
    gap: 40px;
    height: 100%;
}

h4{
	margin: 2px 0px;
}

.tile{
	width: 400px;
	min-width: 400px;
	height: 100%;
    min-height: 290px;
    margin: 0px 15px;
	background-color: white;
	box-shadow: 2px 4px 10px -4px #000000a4;
    border: 1px solid $accent;
    border-radius: 0.3rem;
}

.top_display{
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 50px;
	width: 100%;
}
p{
	margin: 0px;
}
.mid_display{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-left: 13px;
}
.bar_grapgh{
    width: 100%;
    height: calc(100% - 110px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-evenly;
    overflow-y: auto;
}
.incomeBar{
    margin-left: 13px;
    background-color: #53b700;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    white-space: nowrap;
    padding-left: 7px;
}
.expenseBar{
    margin-left: 13px;
    background-color: #00a6a4;
    height: 30px;
    min-height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    white-space: nowrap;
    padding-left: 7px;
    margin-bottom: 2px;
}

.weeks_container{
    height: calc(100% - 80px);
    overflow-y: auto;
    
}
.inner_weeks{
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
    align-items: center;
    gap: 3px;
}
.week{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 15px;
    width: 95%;
}
.week > p:first-child{
    display: flex;
    justify-content: flex-end;
    width: 40%;
}

.week_total{
    cursor: pointer;
    width: 70px;
}
#total_container{
    z-index: 500;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    pointer-events: none;
}

#total_amount{
    width: 15%;
    height: 7%;
    min-height: 75px;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    color: white;
    border-radius: 25px 0px 0px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    pointer-events: all;
    font-size: larger;
}

.mark_done{
    cursor: pointer;
    border: 1px solid black;
    background-color: $primary;
    color: white;
    border-radius: 7px;
}

.right_width{
    min-width: 92.61px;
    width: 92.61px;
}
</style>