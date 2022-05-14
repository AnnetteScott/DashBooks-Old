<template>
	<div class="home">
		<div class="inner">
			<h4>Welcome To DashBooks!</h4>
			<div class="tile_container">
				<div id="records_container">
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
						<div class="bar_grapgh">
                            <div class="incomeBar" :style="{width: `${(Math.min(275 * Math.abs(netData.income / netData.expenses), 275))}px`}">Income: &nbsp; &nbsp; ${{ numberWithCommas(netData.income) }}</div>
                            <div class="expenseBar" :style="{width: `${(Math.min(275 * Math.abs(netData.expenses / netData.income), 275))}px`}">Expenses: ${{ numberWithCommas(netData.expenses) }}</div>
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
                                <div class="expenseBar" :style="{width: `${(260 * Math.abs(item / netData.expenses))}px`}">{{ keys }}: {{ item }}</div>
                            </template>
						</div>
                    </div>
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
                                <div class="incomeBar" :style="{width: `${(260 * Math.abs(item / netData.income))}px`}">{{ keys }}: {{ item }}</div>
                            </template>
						</div>
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
			currentYear: '2022 - 2023',
			netData: {'income': 0, 'expenses': 0},
            expenseSum: {},
            incomeSum: {},
			years: []
		}
	},
	mounted(){
		console.log(userDict)
		for(const objKey of Object.keys(userDict['records'])){
			if(objKey != 'accounts' && objKey != 'categories' && objKey != 'payee' && objKey != 'savedTransactions'){
				this.years.push(objKey)
			}
            
		}
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
                this.netData.expenses += objDict.amount;
                objDict.category in this.expenseSum ? this.expenseSum[objDict.category] += 0: this.expenseSum[objDict.category] = 0;
                this.expenseSum[objDict.category] += objDict.amount;
            }
        }
	},
	methods: {
        numberWithCommas(num) {
			return ((parseFloat(num).toFixed(2)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
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
					this.netData.expenses += objDict.amount;
                    objDict.category in this.expenseSum ? this.expenseSum[objDict.category] += 0: this.expenseSum[objDict.category] = 0;
                    this.expenseSum[objDict.category] += objDict.amount
				}
			}
		}
	}
}
</script>


<style scoped>
.home{
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
}
.inner{
	margin: 10px;
	width: 100%;
	height: calc(100% - 20px - var(--navbar_height));
	
}
.tile_container{
	width: 100%;
	height: 95%;
	overflow-y: scroll;
	padding-top: 10px;
}
#records_container{
    display: flex;
    justify-content: space-evenly;
}
h4{
	margin: 2px 0px;
}

.tile{
	width: 300px;
	min-width: 300px;
	height: 300px;
	background-color: white;
	box-shadow: 0px 0px 10px -5px white inset, 10px 14px 16px -16px black;
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
    height: 160px;
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


</style>