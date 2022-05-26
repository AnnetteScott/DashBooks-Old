<template>
    
    <!-- Create Transaction -->
	<div class="form_container" v-if="transform == `createTransaction`">
		<div class="form">
			<label for="create_trans_date">Transaction Date:</label>
			<input id="create_trans_date" type="date" />

			<label for="create_trans_account">Account:</label>
			<select id="create_trans_account">
				<option v-for="account in userObj['records']['accounts']" :key="account" :data="account">
					{{ account }}
				</option>
			</select>
			
			<label for="create_trans_payee">Payee:</label>
			<v-select 
				:options="userObj['records']['payee']" 
				style="width: 200px" 
				id="create_trans_payee" 
				:v-model="selected" 
				:value="``"
			/>

			<label for="create_trans_type">Type:</label>
			<select id="create_trans_type">
				<option value="Credit">Credit</option>
				<option value="Debit">Debit</option>
			</select>

			<label for="create_trans_category">Category:</label>
			<select id="create_trans_category">
				<option v-for="(status, category) in userObj['records']['categories']" :key="category" :data="category">
					{{ category }}
				</option>
			</select>
			
			<label for="create_trans_item">Item:</label>
			<input id="create_trans_item" type="text" />

			<label for="create_trans_amount">Amount:</label>
			<input id="create_trans_amount" type="number" step="0.01" />
			<template v-if="fileUploaded === false">
				<p>Add upload function</p>
			</template>
			<template v-else>
				Your receipt has been uploaded
			</template>
			<fieldset>
				<q-btn class="glossy" rounded color="primary" label="Create Transaction" @click="createTransaction"/>
                <q-btn class="glossy" rounded color="secondary" label="Cancel" @click="this.$emit('cancelled', '')"/>
			</fieldset>
		</div>
	</div>
	
	<!-- Edit Transaction -->
	<div class="form_container" v-if="transform == `editTransaction`">
		<div class="form">
			<div id="edit_transID" transid="invalid" transyear="invalid"></div>
			<label for="edit_trans_date">Transaction Date:</label>
			<input id="edit_trans_date" type="date" />

			<label for="edit_trans_account">Account:</label>
			<select id="edit_trans_account">
				<option v-for="account in userObj['records']['accounts']" :key="account" :data="account">
					{{ account }}
				</option>
			</select>

			<label for="edit_trans_payee">Payee:</label>
			<v-select :options="userObj['records']['payee']" style="width: 200px" id="edit_trans_payee"></v-select>

			<label for="edit_trans_type">Type:</label>
			<select id="edit_trans_type">
				<option value="Credit">Credit</option>
				<option value="Debit">Debit</option>
			</select>

			<label for="edit_trans_category">Category:</label>
			<select id="edit_trans_category">
				<option v-for="(status, category) in userObj['records']['categories']" :key="category" :data="category">
					{{ category }}
				</option>
			</select>
			
			<label for="edit_trans_item">Item:</label>
			<input id="edit_trans_item" type="text" />

			<label for="edit_trans_amount">Amount:</label>
			<input id="edit_trans_amount" type="number" step="0.01" />

			<fieldset>
				<q-btn class="glossy" rounded color="primary" label="Save Payee" @click="editTransaction"/>
                <q-btn class="glossy" rounded color="red" label="Delete" @click="deleteTransaction"/>
                <q-btn class="glossy" rounded color="secondary" label="Cancel" @click="this.$emit('cancelled', '')"/>
			</fieldset>
		</div>
	</div>

</template>

<script>
import { userDict } from '../main.js'
import { generateID, reDoDate, addToDate } from '../../public/generalFunctions.js';
import $ from 'jquery'
export default {
    name: 'RecordForms',
    emits: ["cancelled"],
    props: {
        transform: String
    },
    data() {
        return {
            userObj: userDict
        }
    },
    methods: {
        
    }
}
</script>

<style scoped lang="scss">
input {
	width: 200px;
	padding: 2px;
	font-family: 'Segoe UI', sans-serif;
	font-size: 15px;
	background-color: transparent;
	border: 1px solid black;
	border-bottom: 3px solid black;
	border-radius: 5px;
	outline: unset;
	transition: 0.2s ease border;
}

.form_error {
	border-color: red !important;
}

.form_container {
	position: absolute;
	z-index: 1000;
	inset: 0px;
	opacity: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	font-family: 'Segoe UI', sans-serif;
	transition: 0.2s ease all;
    backdrop-filter: blur(15px);
}

.form{
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	padding: 20px;
	background-color: white;
    border: 1px solid $accent;
	border-radius: 5px;
	transition: 0.3s ease all;
}

.form fieldset{
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	margin-top: 20px;
	border: unset;
}

select{
	margin: 10px 0px;
	border-radius: 10px;
	padding: 5px;
	width: 110px;
	outline: none;
}

fieldset > .button_link:nth-last-child(1){
	background-color:#bb1818;
}
</style>
