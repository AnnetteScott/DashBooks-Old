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
                            <template v-for="(item, keys) in incomeSum" :key="keys">
                                <div class="incomeBar" :style="{width: `${(350 * Math.abs(item / netData.income))}px`}">{{ keys }}: {{ item }}</div>
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
                            <template v-for="(item, keys) in expenseSum" :key="keys">
                                <div class="expenseBar" :style="{width: `${(350 * Math.abs(item / netData.expenses))}px`}">{{ keys }}: {{ item }}</div>
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
                        <template v-for="(item, keys) in projectDict" :key="keys">
                            <div class="tile">
                                <div class="top_display">
                                    <p style="font-size:x-large; border-bottom: 1px solid black;">{{ item.name }}</p>
                                </div>
                                WEEKS:
                                <div class="weeks_container">
                                    <div class="inner_weeks">
                                        <template v-for="(weekDict, week) in item.weeks" :key="week">
                                        
                                            <div class="week">
                                                <template v-if="weekDict.invoiced">
                                                    <p style="font-size:large; color: #53b700">{{ week }} : {{ weekDict.startDate }}</p>
                                                </template>
                                                <template v-else>
                                                    <p style="font-size:large">{{ week }} : {{ weekDict.startDate }}</p>
                                                </template>
                                                <p v-if="!weekDict.invoiced && checkDate(weekDict.startDate)" style="color: #FF4F00">Invoice Is Due!</p>
                                                <p v-else="" style="width: 88px"></p>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    
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
	components: {

	},
	data(){
		return{
			currentYear: '',
			netData: {'income': 0, 'expenses': 0},
            expenseSum: {},
            incomeSum: {},
			years: [],
            projectDict: {},
            loaded: false
		}
	},
	mounted(){
        let date = new Date();
        let month = date.getMonth();
        let thisYear = date.getFullYear();
        if(month < 3){
            this.currentYear = `${thisYear - 1} - ${thisYear}`;
        }else{
            this.currentYear = `${thisYear} - ${thisYear + 1}`;
        }
		for(const objKey of Object.keys(userDict['records'])){
			if(objKey != 'accounts' && objKey != 'categories' && objKey != 'payee' && objKey != 'savedTransactions'){
				this.years.push(objKey)
			}
            
		}
        this.projectDict = {...userDict['projects']}
        this.netData.income = 0;
        this.netData.expenses = 0;
        this.expenseSum = {};
        this.incomeSum = {};
        if (this.currentYear in userDict['records']){
            for(const [objKey, objDict] of Object.entries(userDict['records'][this.currentYear]['transactions'])){
                if(objDict.type == 'Credit'){
                    this.netData.income += objDict.amount;
                    objDict.category in this.incomeSum ? this.incomeSum[objDict.category] += 0: this.incomeSum[objDict.category] = 0;
                    this.incomeSum[objDict.category] += objDict.amount;
                }else if(objDict.type == 'Debit'){
                    this.netData.expenses += objDict.amount;
                    objDict.category in this.expenseSum ? this.expenseSum[objDict.category] += 0: this.expenseSum[objDict.category] = 0;
                    this.expenseSum[objDict.category] += objDict.amount;
                }
            }
        }
	},
	methods: {
        numberWithCommas(num) {
			return ((parseFloat(num).toFixed(2)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
		},
        checkDate(date){
            let newDate = date.split('/');
            newDate = `${newDate[1]}/${newDate[0]}/${newDate[2]}`;
            const d = new Date(newDate);
            const t = new Date();
            const date2 = new Date(d.getTime() + 12096e5);
            if(date2.getTime() <= t.getTime()){
                return true
            }else{
                return false
            }

        },
		loadNetData(event){
			this.currentYear = $(event.target).attr('data');
            this.netData.income = 0;
            this.netData.expenses = 0;
            this.expenseSum = {};
            this.incomeSum = {};
			for(const [objKey, objDict] of Object.entries(userDict['records'][this.currentYear]['transactions'])){
				if(objDict.type == 'Credit'){
					this.netData.income += objDict.amount;
                    objDict.category in this.incomeSum ? this.incomeSum[objDict.category] += 0: this.incomeSum[objDict.category] = 0;
                    this.incomeSum[objDict.category] += objDict.amount;
				}else if(objDict.type == 'Debit'){
					this.netData.expenses += objDict.amount
                    objDict.category in this.expenseSum ? this.expenseSum[objDict.category] += 0: this.expenseSum[objDict.category] = 0;
                    this.expenseSum[objDict.category] += objDict.amount 
				}
			}
		}
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
}

h4{
	margin: 2px 0px;
}

.tile{
	width: 400px;
	min-width: 400px;
	height: 400px;
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
    height: 260px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-evenly;
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
    height: 220px;
    overflow-y: auto;
    
}
.inner_weeks{
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
}
.week{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 15px;
}
.week > p:first-child{
    display: flex;
    justify-content: flex-end;
    width: 50%;
}
</style>