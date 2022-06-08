<template>
	<div id="inner">
		<div id="selectors">
			<div id="year_select">
				<label for="year_selection">Choose a Tax Year:</label>
				<select id="year_selection"  @change="onchange">
					<template v-for="(recordDict, recordYear) in userObj['records']" :key="recordDict" >
						<option v-if="recordYear !== 'categories' && recordYear !== 'accounts' && recordYear !== 'payee' && recordYear !== 'savedTransactions'" :data="recordYear">
							{{ recordYear }}
						</option>
					</template>
				</select>
			</div>
		</div>
		
		<div class="tables">
            <q-table style="height: 400px" title="Treats" :rows="rows" :columns="columns" row-key="index" virtual-scroll v-model:pagination="pagination" :rows-per-page-options="[0]" />
            <q-btn class="glossy" rounded color="primary" label="Create Transaction" @click="current_request_form = 'createTransaction'"/>
		</div>
		<div class="tables">
			<div id="home" class="outer_table">
				<div class="title">
					<p>Saved Transactions</p>
				</div>
				<div class="saved_row pivot_heading">
					<p>Account</p>
					<p>Type</p>
					<p>Item</p>
					<p>Category</p>
					<p>$</p>
					<p>Add &nbsp;&nbsp;| &nbsp;&nbsp;Edit</p>
				</div>
				<div v-for="(savedDict, savedID) in userObj['records']['savedTransactions']" :key="savedID" class="saved_row">
					<p>{{ savedDict['account'] }}</p>
					<p>{{ savedDict['type'] }}</p>
					<p>{{ savedDict['item'] }}</p>
					<p>{{ savedDict['category'] }}</p>
					<p>{{ savedDict['amount'] }}</p>
                    <p>
                        <div class="glossy button" @click="addSaved" :data="savedID">Add</div>
                        <div class="glossy button" @click="editSaved" :data="savedID">Edit</div>
					</p>
				</div>
			</div>
			<div id="assets" class="outer_table">
				<div class="title">
					<p>Assets</p>
				</div>
				<div class="asset_row pivot_heading">
					<p>Date</p>
					<p>Item Description</p>
					<p>Vendor</p>
					<p>Unit Cost</p>
					<p>Units</p>
					<p>Total</p>
					<p>Attached</p>
				</div>
				<div v-for="(assetDict, assetID) in recordDict['assets']" :key="assetID" class="asset_row" :data="assetID" @click="editAsset">
					<p>{{ assetDict['date'] }}</p>
					<p>{{ assetDict['item'] }}</p>
					<p>{{ assetDict['vendor'] }}</p>
					<p>{{ assetDict['unitCost'] }}</p>
					<p>{{ assetDict['units'] }}</p>
					<p>${{ assetDict['total'] }}</p>
					<p></p>
				</div>
			</div>
		</div>
		<div class="tables">
			<div id="pivot" class="outer_table">
				<div class="title">
					<p>Pivot Table</p>
					<div style="display: flex; align-items: center;"> 
						<label for="show_gst_checkbox" style="width: unset;">Show GST Inclusive:</label>
						<input id="show_gst_checkbox" type="checkbox" @click="changeCheckBox" checked/>
					</div>
				</div>
				<div class="pivot_row pivot_heading" style="height: 30px">
					<template v-if="userObj['showGST']">
						<p v-for="column in colNamesGST" :key="column" class="with_GST">
							{{ column }}
						</p>
					</template>
					<template v-else>
						<p v-for="column in colNames" :key="column" class="without_GST">
							{{ column }}
						</p>
					</template>
				</div>
				<div class="pivot_row" v-for="(categoryDict, category) in pivotDict['categories']" :key="category">
					<p>{{ category }}</p>
					<p>{{ numberWithCommas(categoryDict['Apr']) }}</p>
					<p>{{ numberWithCommas(categoryDict['May']) }}</p>
					<p>{{ numberWithCommas(categoryDict['Jun']) }}</p>
					<p>{{ numberWithCommas(categoryDict['Jul']) }}</p>
					<p>{{ numberWithCommas(categoryDict['Aug']) }}</p>
					<p>{{ numberWithCommas(categoryDict['Sep']) }}</p>
					<p>{{ numberWithCommas(categoryDict['Oct']) }}</p>
					<p>{{ numberWithCommas(categoryDict['Nov']) }}</p>
					<p>{{ numberWithCommas(categoryDict['Dec']) }}</p>
					<p>{{ numberWithCommas(categoryDict['Jan']) }}</p>
					<p>{{ numberWithCommas(categoryDict['Feb']) }}</p>
					<p>{{ numberWithCommas(categoryDict['Mar']) }}</p>
					<template v-if="userObj['showGST']">
						<p style="min-width: calc((100% - 30ch) / 14);">{{ numberWithCommas(categoryDict['grandTotal']) }}</p>	
						<p style="min-width: calc((100% - 30ch) / 14);">{{ numberWithCommas(categoryDict['grandTotal'] * 1.15) }}</p>
					</template>
					<template v-else>
						<p style="min-width: calc(((100% - 30ch) / 14) * 2 + 1px);">${{ numberWithCommas(categoryDict['grandTotal']) }}</p>
					</template>
				</div>
				<div class="pivot_row pivot_heading"> <!-- Total of each column -->
					<template v-if="loaded">
						<p>Grand Total</p>
						<p>${{ numberWithCommas(pivotDict['months']['Apr']) }}</p>
						<p>${{ numberWithCommas(pivotDict['months']['May']) }}</p>
						<p>${{ numberWithCommas(pivotDict['months']['Jun']) }}</p>
						<p>${{ numberWithCommas(pivotDict['months']['Jul']) }}</p>
						<p>${{ numberWithCommas(pivotDict['months']['Aug']) }}</p>
						<p>${{ numberWithCommas(pivotDict['months']['Sep']) }}</p>
						<p>${{ numberWithCommas(pivotDict['months']['Oct']) }}</p>
						<p>${{ numberWithCommas(pivotDict['months']['Nov']) }}</p>
						<p>${{ numberWithCommas(pivotDict['months']['Dec']) }}</p>
						<p>${{ numberWithCommas(pivotDict['months']['Jan']) }}</p>
						<p>${{ numberWithCommas(pivotDict['months']['Feb']) }}</p>
						<p>${{ numberWithCommas(pivotDict['months']['Mar']) }}</p>
						<template v-if="userObj['showGST']">
							<p style="min-width: calc((100% - 30ch) / 14);">${{ numberWithCommas(pivotDict['months']['grandTotal']) }}</p>
							<p style="min-width: calc((100% - 30ch) / 14);">${{ numberWithCommas(pivotDict['months']['grandTotal'] * 1.15) }}</p>
						</template>
						<template v-else>
							<p style="min-width: calc(((100% - 30ch) / 14) * 2 + 1px);">${{ numberWithCommas(pivotDict['months']['grandTotal']) }}</p>
						</template>
					</template>
				</div> 
				<div class="pivot_row pivot_heading" style="margin-top: 10px;">
					<template v-if="loaded">
						<p>Tax To Pay</p>
						<p>${{ numberWithCommas(calculateTax(pivotDict['months']['grandTotal'])) }}</p>
						<p>Effective Tax Rate: {{ (calculateTax(pivotDict['months']['grandTotal']) / pivotDict['months']['grandTotal'] * 100).toFixed(2) }}%</p>
					</template>
				</div>
				<div class="pivot_row pivot_heading">
					<template v-if="loaded">
						<template v-if="userObj['showGST']">
							<p>Take Home w/o GST</p>
						</template>
						<template v-else>
							<p>Take Home:</p>
						</template>
						<p>${{ numberWithCommas(pivotDict['months']['grandTotal'] - calculateTax(pivotDict['months']['grandTotal'])) }}</p>
					</template>
				</div>
				<template v-if="userObj['showGST']">
					<div class="pivot_row pivot_heading" style="margin-top: 5px;">
						<template v-if="loaded">
							<p>Tax To Pay inc. GST</p>
							<p>${{ numberWithCommas(calculateTax(pivotDict['months']['grandTotal']) * 1.15) }}</p>
							<p>Effective Tax Rate: {{ ((calculateTax(pivotDict['months']['grandTotal'])  * 1.15) / (pivotDict['months']['grandTotal'] * 1.15) * 100).toFixed(2) }}%</p>
						</template>
					</div>
					<div class="pivot_row pivot_heading">
						<template v-if="loaded">
							<p>Take Home w/ GST</p>
							<p>${{ numberWithCommas(pivotDict['months']['grandTotal'] * 1.15 - calculateTax(pivotDict['months']['grandTotal']) * 1.15) }}</p>
						</template>
					</div>
				</template>
			</div>
		</div>		
		<TransactionForms :transform="current_request_form" @cancelled="current_request_form=``" />
	</div>
</template>

<script>
import TransactionForms from '@/components/TransactionForms.vue';
import { generateID } from '../../public/generalFunctions.js';
import { userDict } from '../main.js'
import { ref } from 'vue'
import $ from 'jquery';
const columns = [
    {
        name: 'month',
        required: true,
        label: 'Month',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
    },
    { name: 'date', label: 'Date', field: 'date', sortable: true },
    { name: 'type', label: 'Type', field: 'type', sortable: true },
    { name: 'account', label: 'Account', field: 'account', sortable: true },
    { name: 'category', label: 'Category', field: 'category', sortable: true },
    { name: 'item', label: 'Item', field: 'item', sortable: true },
    { name: 'payee', label: 'Payee', field: 'payee', sortable: true },
    { name: 'amount', label: '$Amount', field: 'amount', sortable: true }
   /*  { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
    { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) } */
]
/* for(let[id, content] of Object.entries(this.recordDict['transactions'])){

} */

const rows = []

export default {
	name: 'RecordView',
	components: {
        TransactionForms
    },
    setup () {
        return {
            columns,
            rows,
            pagination: ref({
                rowsPerPage: 0
            })
        }
    },
	data() {
		return {
			userObj: userDict,
			pivotDict: {},
			recordDict: {},
			current_request_form: '',
			transID: '',
			receiptID: '',
			loaded: false,
			yearID: '',
			colNamesGST: ["Category", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Total w/o GST", "Total w/ GST"],
			colNames: ["Category", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Total"]
		}
	},
	mounted() {
		let date = new Date();
		let thisYear = date.getFullYear();
		let month = date.getMonth();
		let yearID;
		if(month < 3){ //April is 3rd month
			yearID = `${thisYear - 1} - ${thisYear}`;
		}else{
			yearID = `${thisYear} - ${thisYear + 1}`;
		}
		if(Object.keys(userDict['records']).length == 4){
			userDict['records'][`${thisYear - 1} - ${thisYear}`] = {'transactions': {}, 'assets': {}};
			userDict['records'][`${thisYear} - ${thisYear + 1}`] = {'transactions': {}, 'assets': {}};
		}
		if(!Object.keys(userDict['records']).includes(yearID)){
			userDict['records'][`${thisYear} - ${thisYear + 1}`] = {'transactions': {}, 'assets': {}};
		}
		this.recordDict = userDict['records'][yearID];
		this.yearID = yearID;
		setTimeout(() => {
			$(`#year_selection`).val(yearID);
			$('#show_gst_checkbox').prop('checked', userDict['showGST']);
			this.calculatePivotTable()
		}, 1)
		
	},
	methods: {
		changeCheckBox(){
			userDict['showGST'] = $('#show_gst_checkbox')[0].checked;
		},
		addSaved(event){
			const savedID = $(event.target).attr('data');
			this.current_request_form = 'addSaved';
			setTimeout(() => {
				$(`#add_savedID`).attr('savedid', savedID)
			}, 1)
		},
		editSaved(event){
			const savedID = $(event.target).attr('data');
			this.current_request_form = 'editSaved';
			let saveDict = userDict['records']['savedTransactions'][savedID]
			setTimeout(() => {
				$(`#edit_savedID`).attr('savedid', savedID)
				$(`#edit_savedTrans_item`).val(saveDict['item'])
				$(`#edit_savedTrans_amount`).val(saveDict['amount'])
				$(`#edit_savedTrans_account`).val(saveDict['account']);
				$(`#edit_savedTrans_type`).val(saveDict['type']);
				$(`#edit_savedTrans_category`).val(saveDict['category']);
			}, 1)
		},
		calculatePivotTable(){
			const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			this.pivotDict = {'categories': {}, 'months': {}};
			for(const [category, status] of Object.entries(userDict['records']['categories'])){
				if(status){
					this.pivotDict['categories'][category] = {'grandTotal': 0}
					this.pivotDict['months'] = {'grandTotal': 0}
				monthNames.forEach((month) => {
					this.pivotDict['categories'][category][month] = 0;
					this.pivotDict['months'][month] = 0;
				});
				}
			}
			if(this.recordDict['transactions'] != undefined){
				for(const [transID, transDict] of Object.entries(this.recordDict['transactions'])){
					if(userDict['records']['categories'][transDict['category']]){
						this.pivotDict['categories'][transDict['category']][transDict['month']] += transDict['amount'];
						this.pivotDict['categories'][transDict['category']]['grandTotal'] += transDict['amount'];
						this.pivotDict['months'][transDict['month']] += transDict['amount'];
						this.pivotDict['months']['grandTotal'] += transDict['amount'];
						transID;
					}
				}
			}
			
			this.loaded = true;
		},
		uploadReceipt(event){
			this.transID = $(event.target).attr('data');
			const receiptID = generateID(userDict);
			this.receiptID = receiptID;
		},
		downloadReceipt(event){
			const receiptID = $(event.target).attr('data');
		},
		onchange(){
			this.recordDict = userDict['records'][$(`#year_selection option:selected`).attr('data')];
			this.calculatePivotTable();
		},
		editTransaction(e){
			this.current_request_form = 'editTransaction';
			const ID = $(e.target).attr('data');
			setTimeout(() => {
				let transDict = this.recordDict['transactions']
				let newDate = transDict[ID]['date'].split("/").reverse().join("-");
				$(`#edit_transID`).attr('transid', ID)
				$(`#edit_transID`).attr('transyear', $(`#year_selection option:selected`).attr('data'))
				$(`#edit_trans_date`).val(newDate)
				$(`#edit_trans_item`).val(transDict[ID]['item'])
				$(`#edit_trans_amount`).val(transDict[ID]['amount'])
				$(`#edit_trans_account`).val(transDict[ID]['account']);
				$(`.vs__selected`).text(transDict[ID]['payee'])
				$(`#edit_trans_type`).val(transDict[ID]['type']);
				$(`#edit_trans_category`).val(transDict[ID]['category']);
			}, 1)
		},
		editAsset(e){
			this.current_request_form = 'editAsset';
			const ID = $(e.target).attr('data');
			setTimeout(() => {
				let assetDict = this.recordDict['assets']
				let newDate = assetDict[ID]['date'].split("/").reverse().join("-");
				$(`#edit_assetID`).attr('assetid', ID)
				$(`#edit_assetID`).attr('assetyear', $(`#year_selection option:selected`).attr('data'))
				$(`#edit_asset_date`).val(newDate)
				$(`#edit_asset_item`).val(assetDict[ID]['item'])
				$(`#edit_asset_vendor`).val(assetDict[ID]['vendor'])
				$(`#edit_asset_unit_cost`).val(assetDict[ID]['unitCost']);
				$(`#edit_asset_units`).val(assetDict[ID]['units']);
				$(`#edit_asset_total`).val(assetDict[ID]['total']);
			}, 1)
			
		},
		deleteYear(){
			this.show_delete = false;
			let thisYear = $(`#year_selection option:selected`).attr('data');
			delete userDict['records'][thisYear];

			let date = new Date();
			thisYear = date.getFullYear();
			$(`#year_selection`).val(this.yearID);
			if(!Object.keys(userDict['records']).includes(this.yearID)){
				userDict['records'][`${thisYear} - ${thisYear + 1}`] = {'transactions': {}, 'assets': {}};
			}
			this.recordDict = userDict['records'][this.yearID];
			this.calculatePivotTable();
		},
		calculateTax(amount){
			let firstTax = [0.105, 14000];
			let secondTax = [0.175, 48000];
			let thirdTax = [0.3, 70000];
			let fourthTax = [0.33, 180000];
			let fifthTax = [0.39];
			
			if(amount <= 0){
				return 0;
			}

			let firstTaxAmount = amount > firstTax[1] ? firstTax[1] * firstTax[0]: amount * firstTax[0]; //1470 so correct!
			if(amount <= firstTax[1]){
				return firstTaxAmount
			}

			let secondTaxAmount = amount > firstTax[1] && amount < secondTax[1] ? (amount - firstTax[1]) * secondTax[0]: (secondTax[1] - firstTax[1]) * secondTax[0] //5950 so correct
			if(amount <= secondTax[1]){
				return firstTaxAmount + secondTaxAmount
			}

			let thirdTaxAmount = amount > secondTax[1] && amount < thirdTax[1] ? (amount - secondTax[1]) * thirdTax[0]: (thirdTax[1] - secondTax[1]) * thirdTax[0] //6600 so correct
			if(amount <= thirdTax[1]){
				return firstTaxAmount + secondTaxAmount + thirdTaxAmount;
			}

			let fourthTaxAmount = amount > thirdTax[1] && amount < fourthTax[1] ? (amount - thirdTax[1]) * fourthTax[0]: (fourthTax[1] - thirdTax[1]) * fourthTax[0] //36300 so correct
			if(amount <= fourthTax[1]){
				return firstTaxAmount + secondTaxAmount + thirdTaxAmount + fourthTaxAmount;
			}

			let fifthTaxAmount = amount > fourthTax[1] ? (amount - fourthTax[1]) * fifthTax[0]: 0
			if(amount >= fourthTax[1]){
				return firstTaxAmount + secondTaxAmount + thirdTaxAmount + fourthTaxAmount + fifthTaxAmount;
			}

		},
		numberWithCommas(num) {
			return ((parseFloat(num).toFixed(2)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
		}
	}
}
</script>

<style scoped lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: black;
	margin-top: var(--navbar_height);
	overflow-x: auto;
}

#inner{
	width: 100%;
	min-width: 1440px;
	height: calc(100vh - var(--navbar_height));
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow-y: auto;
	overflow-x: auto;
}

@media only screen and (max-width: 1435px) {
	#inner {
		height: calc(100vh - var(--navbar_height) - 15px);
	}
}

#selectors{
	margin-top: 5px;
	height: 30px;
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: space-evenly;
}

select{
	width: 150px;
	height: 27px;
	margin: 0px 1ch 10px;
	padding: 5px;
	border-radius: 10px;
	outline: none;
}

label{
	width: 200px;
}


.tables{
	width: 100%;
	height: calc(100% - 25px);
	min-height: calc(100% - 25px);
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
}

.outer_table{
	position: relative;
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	align-items: center;
	width: 45%;
	height: 90%;
	padding: 10px;
	background-color: #ffffff60;
	border-radius: 10px;
	box-shadow: 2px 4px 10px -7px black;
	backdrop-filter: blur(10px);
}

.outer_table > .title{
	display: flex;
	flex-flow: row wrap;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	margin-bottom: 10px;
}
.outer_table > .title > p{
	margin: 0px;
	font-size: 28px;
}
.outer_table > .title .button_link{
	margin: 0px 10px;
}

.saved_row{
	display: flex;
	width: 100%;
	margin-bottom: 10px;
	border-right: 1px solid black;
	border-top: 1px solid black;
	border-bottom: 1px solid black;
	background-color: white;
	height: 30px;
}

.saved_row > p{
	font-size: 15px;
	width: 100%;
	margin: 0px;
	border-left: 1px solid black;
	display: flex;
	align-items: center;
	justify-content: center;
}

.saved_row > p:nth-child(1){
	min-width: 7ch;
}

.saved_row > p:nth-child(2){
	min-width: 6ch;
}

.saved_row > p:nth-child(3){
	min-width: 17ch;
}

.saved_row > p:nth-child(4){
	min-width: 7ch;
}

.saved_row > p:nth-child(5){
	min-width: 3ch;
}

.saved_row > p:last-child{
	min-width: 100px;
	display: flex;
	justify-content: space-evenly;
}

.saved_row .button_link{
	padding: 0px 10px;
}

.button{
    background-color: $primary;
    padding: 2px 10px;
    border-radius: 10px;
    color: white;
    cursor: pointer;
}
.asset_row{
	display: flex;
	width: 100%;
	margin-bottom: 10px;
	border-right: 1px solid black;
	border-top: 1px solid black;
	border-bottom: 1px solid black;
	background-color: white;
	height: 30px;
	cursor: pointer;
}

.asset_row > p{
	font-size: 15px;
	width: 100%;
	margin: 0px;
	border-left: 1px solid black;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.asset_row > p:first-child{
	min-width: 10ch;
}

.asset_row > p:nth-child(2){
	min-width: 18ch;
}

.asset_row > p:nth-child(3){
	min-width: 15ch;
}

.asset_row > p:nth-child(4){
	min-width: 5ch;
}.asset_row > p:nth-child(5){
	min-width: 5ch;
}.asset_row > p:nth-child(6){
	min-width: 5ch;
}

#pivot{
	width: 95%;
	height: 90%;
}

.pivot_row{
	display: flex;
	width: 100%;
	margin-bottom: 1px;
	border-right: 1px solid black;
	border-top: 1px solid black;
	border-bottom: 1px solid black;
	background-color: white;
	height: 25px;
}

.pivot_row p{
	font-size: 15px;
	width: 100%;
	margin: 0px;
	border-left: 1px solid black;
	display: flex;
	align-items: center;
	justify-content: center;
}

.pivot_row > p:first-child{
	width: 30ch;
	min-width: 30ch;
}

.pivot_heading{
	cursor: normal;
	pointer-events: none;
	background-color: #41e07e;
}

#show_gst_checkbox{
	width: 50px;
	height: 30px;
}

.without_GST:last-child{
	min-width: calc(((100% - 30ch) / 14) * 2 + 1px);
}

.with_GST:last-child{
	min-width: calc((100% - 30ch) / 14);
}
.with_GST:nth-last-child(2){
	min-width: calc((100% - 30ch) / 14);
}

</style>