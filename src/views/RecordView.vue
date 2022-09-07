<template>
	<div id="inner">
		<div id="selectors">
			<div id="year_select">
				<label for="year_selection">Choose a Tax Year:</label>
				<select id="year_selection"  @change="onchange">
					<template v-for="(recordDict, recordYear) in userObj['records']['years']" :key="recordDict" >
						<option :data="recordYear">
							{{ recordYear }}
						</option>
					</template>
				</select>
			</div>
		</div>
		
		<div class="tables">
            <q-table 
            style="height: 85%; width: 95%;"
            class="my-sticky-virtscroll-table"
            :virtual-scroll-sticky-size-start="48"
            title="Transactions" 
            :rows="rows" 
            :columns="columns" 
            row-key="index" 
            virtual-scroll 
            v-model:pagination="pagination"
            :rows-per-page-options="[0]"
            :visible-columns="visibleColumns"
            :filter="filter"
            >
            <template v-slot:top-left>
                <div class="col-2 q-table__title">Transactions</div>
                <div v-if="$q.screen.gt.xs" class="col">
                    <q-toggle v-model="visibleColumns" val="date" label="Date" @click="rememberChoice('date')"/>
                    <q-toggle v-model="visibleColumns" val="type" label="Type" @click="rememberChoice('type')"/>
                    <q-toggle v-model="visibleColumns" val="account" label="Account" @click="rememberChoice('account')"/>
                    <q-toggle v-model="visibleColumns" val="category" label="Category" @click="rememberChoice('category')"/>
                    <q-toggle v-model="visibleColumns" val="item" label="Item" @click="rememberChoice('item')"/>
                    <q-toggle v-model="visibleColumns" val="payee" label="Payee" @click="rememberChoice('payee')"/>
                    <q-toggle v-model="visibleColumns" val="amount" label="Amount" @click="rememberChoice('amount')"/>
                    <q-toggle v-model="visibleColumns" val="receiptID" label="Receipt" @click="rememberChoice('receiptID')"/>
                </div>
            </template>
            <template v-slot:top-right>
                <div class="top_right_trans">
                    <q-input dense debounce="300" color="primary" v-model="filter">
                        <template v-slot:append>
                            <q-icon name="o_search" />
                        </template>
                    </q-input>
                    <q-btn class="glossy" rounded color="primary" label="Create Transaction" @click="current_request_form = 'createTransaction'"/>
                    <q-btn class="glossy" rounded color="secondary" label="Export to CSV" no-caps @click="exportTable" icon-right="o_archive"/>
                </div>
            </template>
                <template v-slot:body="props">
                    <q-tr :props="props" :class="props.row.type" style="cursor: pointer">
                        <q-td key="month" :props="props" :transid="props.row.id" @click="editTransaction">{{ props.row.month }}</q-td>
                        <q-td key="date" :props="props" :transid="props.row.id" @click="editTransaction">{{ props.row.date }}</q-td>
                        <q-td key="type" :props="props" :transid="props.row.id" @click="editTransaction">{{ props.row.type }}</q-td>
                        <q-td key="account" :props="props" :transid="props.row.id" @click="editTransaction">{{ props.row.account }}</q-td>
                        <q-td key="category" :props="props" :transid="props.row.id" @click="editTransaction">{{ props.row.category }}</q-td>
                        <q-td key="item" :props="props" :transid="props.row.id" @click="editTransaction">{{ props.row.item }}</q-td>
                        <q-td key="payee" :props="props" :transid="props.row.id" @click="editTransaction">{{ props.row.payee }}</q-td>
                        <q-td key="amount" :props="props" :transid="props.row.id" @click="editTransaction">${{ numberWithCommas(props.row.amount) }}</q-td>
                        <q-td v-if="props.row.receiptID != ''" key="receiptID" :props="props">
                            <q-btn class="glossy" rounded color="secondary" label="View" :props="props" :transid="props.row.id" @click="viewImage($event, props.row.id)"/>
                        </q-td>
                        <q-td v-else key="amount" :props="props"></q-td>
                    </q-tr>
                </template>
            </q-table>
		</div>

        <template v-if="imageToShow != ''">
            <div id="receiptViewer">
                <embed v-if="pdf64" src="" id="ItemPreviewPDF"/>
                <img v-if="image64" src="" id="ItemPreview"/>
                <div style="height: 99%"><q-btn icon="o_close" @click="cancelImage" style="background-color: red;"/></div>
            </div>
        </template>

       <!--  Saved Transactions Table -->
		<div class="tables">
			<div id="home" class="outer_table">
				<div class="title">
					<p>Saved Transactions</p>
                    <q-btn class="glossy" rounded color="primary" label="Create Saved Transaction" @click="current_request_form = 'createSaved'"/>
				</div>
				<div class="saved_row pivot_heading">
					<p>Account</p>
					<p>Type</p>
					<p>Item</p>
					<p>Category</p>
					<p>Amount</p>
					<p>Add &nbsp;&nbsp;| &nbsp;&nbsp;Edit</p>
				</div>
                <div class="outer_container">
                    <div v-for="(savedDict, savedID) in userObj['records']['savedTransactions']" :key="savedID" class="saved_row">
                        <p>{{ savedDict['account'] }}</p>
                        <p>{{ savedDict['type'] }}</p>
                        <p>{{ savedDict['item'] }}</p>
                        <p>{{ savedDict['category'] }}</p>
                        <p>${{ numberWithCommas(savedDict['amount']) }}</p>
                        <p>
                            <div class="glossy button" @click="addSaved" :data="savedID">Add</div>
                            <div class="glossy button" @click="editSaved" :data="savedID">Edit</div>
                        </p>
                    </div>
                </div>
			</div>
			<div id="assets" class="outer_table">
				<div class="title">
					<p>Assets</p>
                    <q-btn class="glossy" rounded color="primary" label="Create Asset" @click="current_request_form = 'createAsset'"/>
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
                <div class="outer_container">
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
						<p>ACC</p>
						<p>${{ numberWithCommas(pivotDict['months']['grandTotal'] * accAmount) }}</p>
					</template>
				</div>
                <div class="pivot_row pivot_heading">
					<template v-if="loaded">
						<p>Take Home</p>
						<p>${{ numberWithCommas(pivotDict['months']['grandTotal'] - calculateTax(pivotDict['months']['grandTotal']) - (pivotDict['months']['grandTotal'] * accAmount))}}
                        </p>
					</template>
				</div>
				<template v-if="userObj['showGST']">
					<div class="pivot_row pivot_heading" style="margin-top: 5px; background-color: #41cde0">
						<template v-if="loaded">
							<p>Tax To Pay inc. GST</p>
							<p>${{ numberWithCommas(calculateTax(pivotDict['months']['grandTotal'] * GSTAmount) ) }}</p>
							<p>Effective Tax Rate: {{ ((calculateTax(pivotDict['months']['grandTotal'] * GSTAmount)) / (pivotDict['months']['grandTotal'] * GSTAmount) * 100).toFixed(2) }}%</p>
						</template>
					</div>
                    <div class="pivot_row pivot_heading" style="background-color: #41cde0">
                        <template v-if="loaded">
                            <p>ACC</p>
                            <p>${{ numberWithCommas(pivotDict['months']['grandTotal'] * GSTAmount * accAmount) }}</p>
                        </template>
				    </div>
					<div class="pivot_row pivot_heading" style="background-color: #41cde0">
						<template v-if="loaded">
							<p>Take Home w/ GST</p>
							<p>${{ numberWithCommas(pivotDict['months']['grandTotal'] * 1.15 - calculateTax(pivotDict['months']['grandTotal'] * GSTAmount) - pivotDict['months']['grandTotal'] * GSTAmount * accAmount) }}</p>
						</template>
					</div>
				</template>
                <p style="font-size: 0.6rem">Results have a margin of error at 1.5%</p>
			</div>
		</div>		
		<TransactionForms :transform="current_request_form" :hasReceipt="receiptStatus" @cancelled="cancelForm" />
	</div>
</template>

<script>
import TransactionForms from '@/components/TransactionForms.vue';
import { reactive } from "vue";
import { exportFile, useQuasar } from 'quasar'
import { userDict, settingsDict } from '../main.js'
import { ref } from 'vue'
import $ from 'jquery';
const fs = window.__TAURI__.fs;
const columns = [
    { name: 'month', align: 'center', label: 'Month', field: 'month', sortable: true },
    { name: 'date', align: 'center', label: 'Date', field: 'date', sortable: true, sort: (a, b) => parseInt(a.split('/').reverse().join('')) - parseInt(b.split('/').reverse().join(''))},
    { name: 'type', align: 'center', label: 'Type', field: 'type', sortable: true },
    { name: 'account', align: 'center', label: 'Account', field: 'account', sortable: true },
    { name: 'category', align: 'center', label: 'Category', field: 'category', sortable: true },
    { name: 'item', align: 'center', label: 'Item', field: 'item', sortable: true },
    { name: 'payee', align: 'center', label: 'Payee', field: 'payee', sortable: true },
    { name: 'amount', align: 'center', label: 'Amount', field: 'amount', sortable: true },
    { name: 'receiptID', align: 'center', label: 'Receipt', field: 'receiptID', sortable: true }
]
let rows;
function wrapCsvValue (val, formatFn, row) {
    let formatted = formatFn !== void 0 ? formatFn(val, row) : val
    formatted = formatted === void 0 || formatted === null ? '' : String(formatted)
    formatted = formatted.split('"').join('""')
    return `"${formatted}"`
}

export default {
	name: 'RecordView',
	components: {
        TransactionForms
    },
    data() {
        return {
            userObj: userDict,
            pivotDict: {},
            recordDict: {},
            current_request_form: '',
            imageToShow: '',
            pdf64: false,
            image64: false,
            transID: '',
            receiptID: '',
            receiptStatus: false,
            loaded: false,
            accAmount: 0.015,
            GSTAmount: 1.15,
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
		if(Object.keys(userDict['records']['years']).length == 0){
            userDict['records']['years'][`${thisYear - 1} - ${thisYear}`] = {'transactions': {}, 'assets': {}};
			userDict['records']['years'][`${thisYear} - ${thisYear + 1}`] = {'transactions': {}, 'assets': {}};
		}
		if(!Object.keys(userDict['records']['years']).includes(yearID)){
            userDict['records']['years'][`${thisYear} - ${thisYear + 1}`] = {'transactions': {}, 'assets': {}};
		}
		this.recordDict = userDict['records']['years'][yearID];
		this.yearID = yearID;
		this.$nextTick(() => {
            $(`#year_selection`).val(yearID);
			$('#show_gst_checkbox').prop('checked', userDict['showGST']);
			this.calculatePivotTable()
		})
		
	},
    setup() {
        const $q = useQuasar()
        const filter = ref('')
        let date = new Date();
		let thisYear = date.getFullYear();
		let month = date.getMonth();
		let yearID;
		if(month < 3){ //April is 3rd month
			yearID = `${thisYear - 1} - ${thisYear}`;
		}else{
            yearID = `${thisYear} - ${thisYear + 1}`;
		}
		if(Object.keys(userDict['records']['years']).length == 0){
            userDict['records']['years'][`${thisYear - 1} - ${thisYear}`] = {'transactions': {}, 'assets': {}};
			userDict['records']['years'][`${thisYear} - ${thisYear + 1}`] = {'transactions': {}, 'assets': {}};
		}
		if(!Object.keys(userDict['records']['years']).includes(yearID)){
            userDict['records']['years'][`${thisYear} - ${thisYear + 1}`] = {'transactions': {}, 'assets': {}};
		}
        rows = reactive([
            Object.values(userDict['records']['years'][yearID]['transactions'])
        ]); 
        return {
            visibleColumns: ref(userDict['records']['headingStates']),
            filter,
            columns,
            rows: rows[0],
            exportTable () {
                // naive encoding to csv format
                const content = [columns.map(col => wrapCsvValue(col.label))].concat(
                rows[0].map(row => columns.map(col => wrapCsvValue(
                    typeof col.field === 'function'
                    ? col.field(row)
                    : row[ col.field === void 0 ? col.name : col.field ],
                    col.format,
                    row
                )).join(','))
                ).join('\r\n')

                const status = exportFile(
                'DashBooks Records.csv',
                content,
                'text/csv'
                )

                if (status !== true) {
                $q.notify({
                    message: 'Browser denied file download...',
                    color: 'negative',
                    icon: 'warning'
                })
                }
            },
            pagination: ref({
                rowsPerPage: 0,
                'sortBy': 'date',
                'descending': true
            })
        }
    },
	methods: {
        rememberChoice(heading){
            const index = userDict['records']['headingStates'].indexOf(heading);
            if (index > -1) {
                userDict['records']['headingStates'].splice(index, 1); // 2nd parameter means remove one item only
            }else{
                userDict['records']['headingStates'].push(heading)
            }
        },
        cancelForm(){
            this.current_request_form=``;
            this.rows = Object.values(userDict['records'][this.yearID]['transactions'])
        },
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
		onchange(){
			this.recordDict = userDict['records']['years'][$(`#year_selection option:selected`).attr('data')];
			this.calculatePivotTable();
            this.rows = Object.values(this.recordDict['transactions'])
		},
		editTransaction(e){
			this.current_request_form = 'editTransaction';
			const ID = $(e.target).attr('transid');
			let transDict = this.recordDict['transactions']
			transDict[ID]['receiptID'] != '' ? this.receiptStatus = true : this.receiptStatus = false
			setTimeout(() => {
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
        viewImage(e, ID){
            let receiptID = this.recordDict['transactions'][ID]['receiptID'];
            let ref = this;
            fs.readBinaryFile(`${settingsDict['roaming']}DashBooks/Receipts/${receiptID}`).then(function(imageArr) {
                let b64encoded = ref.bytesToBase64(imageArr);
                let fileExt = receiptID.split('.').at(-1);
                if(fileExt == 'pdf'){
                    ref.imageToShow = 'this';
                    ref.pdf64 = true;
                    ref.$nextTick(() => {
                        $('#ItemPreviewPDF').attr('src', `data:application/pdf;base64,${b64encoded}`);
                    });
                }else if(fileExt == 'png'){
                    ref.imageToShow = 'this';
                    ref.image64 = true;
                    ref.$nextTick(() => {
                        $('#ItemPreview').attr('src', `data:image/png;base64,${b64encoded}`);
                    });
                }else if(fileExt == 'jpeg' || fileExt == 'jpg'){
                    ref.imageToShow = 'this';
                    ref.image64 = true;
                    ref.$nextTick(() => {
                        $('#ItemPreview').attr('src', `data:image/jpeg;base64,${b64encoded}`);
                    });
                }
                
            })
        },
        cancelImage(){
            this.imageToShow = ''
            this.image64 = false;
            this.pdf64 = false;
            $('#ItemPreview').attr('src', ``);
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
		},
        bytesToBase64(bytes){
            const base64abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"];
            const base64codes = [ 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 62, 255, 255, 255, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 255, 255, 255, 0, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 255, 255, 255, 255, 255, 255, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
            let result = '', i, l = bytes.length;
            for (i = 2; i < l; i += 3) {
                result += base64abc[bytes[i - 2] >> 2];
                result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
                result += base64abc[((bytes[i - 1] & 0x0F) << 2) | (bytes[i] >> 6)];
                result += base64abc[bytes[i] & 0x3F];
            }
            if (i === l + 1) { // 1 octet yet to write
                result += base64abc[bytes[i - 2] >> 2];
                result += base64abc[(bytes[i - 2] & 0x03) << 4];
                result += "==";
            }
            if (i === l) { // 2 octets yet to write
                result += base64abc[bytes[i - 2] >> 2];
                result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
                result += base64abc[(bytes[i - 1] & 0x0F) << 2];
                result += "=";
            }
            return result;

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
    overflow-y: auto;
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

.outer_container{
    width: 100%;
    height: 100%;
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
    min-width: 7ch;
    max-width: 7ch;
	width: 7ch;
}

.saved_row > p:nth-child(3){
	min-width: 35ch;
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

.Debit{
    background-color: #db0b0b5c;
}

.Credit{
    background-color: #00c5005e;
}

.top_right_trans{
    width: 625px;
    display: flex;
    justify-content: space-between;
}

#receiptViewer{
    position: fixed;
    z-index: 500;
    width: 100vw;
    height: calc(98vh - var(--navbar_height));
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
}

#receiptViewer embed {
    border: 1px solid black;
    border-radius: 10px;
    display: block;
    min-width: 95%;
    min-height: 100%;
    max-width: 100%;
    max-height: 100%;
}

#receiptViewer img {
    border: 1px solid black;
    border-radius: 10px;
    display: block;
    min-width: 100px;
    min-height: 100px;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
}


</style>
