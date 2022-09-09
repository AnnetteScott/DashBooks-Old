<template>
    <div class="pageHome">
        <div id="selection_container">
            <div v-for="colour, tool in toolList" :key="tool" class="tool_button" :style="`background-color: #${colour}`" @click="toolItem = tool">{{ tool }}</div>
        </div>
        <div id="tool_container">
            <!-- ID Generator -->
            <div v-if="toolItem == 'ID Generator'" class="tool_settings">
                <div>
                    <label for="">Enter amount of charcters: </label>
                    <input type="number" id="id_length">
                    <p style="font-size: 0.7rem">Default is 8, Max is 120</p>
                </div>
                <div>
                    <label for="">Enter number of ID's to generate: </label>
                    <input type="number" id="id_amount">
                    <p style="font-size: 0.7rem">Default is 1, Max is 50</p>
                </div>
                <div class="tool_button" style="background-color: #34DD13" @click="genID()">Generate ID!</div>
                <div class="tool_button" style="background-color: #34DD13" @click="idList = []">Clear ID's</div>
                <div class="tool_button" style="background-color: #34DD13" @click="idList = [], genID()">Generate New Set</div>
            </div>
            <div class="id_output" v-if="toolItem == 'ID Generator'">
                <p v-for="id in idList" :key="id">{{id}}</p>
                <p v-if="idLoading">Generating ID</p>
            </div>
    
            <!-- Formated ID Generator -->
            <div v-if="toolItem == 'Formated ID Generator'" class="tool_settings">
                <div>
                    <label for="">Enter amount of charcters: </label>
                    <input type="number" id="id_length_formated">
                    <p style="font-size: 0.7rem">Default is 8, Max is 120</p>
                </div>
                <div>
                    <label for="">Enter number of ID's to generate: </label>
                    <input type="number" id="id_amount_formated">
                    <p style="font-size: 0.7rem">Default is 1, Max is 50</p>
                </div>
                <div>
                    <label class="switch">
                        <input type="checkbox" id="numbers_condition" checked>
                        <span class="slider round"></span>
                    </label>
                    <label for=""> Include Numbers </label>
                </div>
                <div>
                    <label for=""> Mixed Upper/Lower Case </label>
                    <label class="switch">
                        <input type="checkbox" id="mixed_condition" v-model="mixedCondition">
                        <span class="slider round coloured_always"></span>
                    </label>
                </div>
                <div v-if="mixedCondition">
                    <label for=""> Only Lowercase </label>
                    <label class="switch">
                        <input type="checkbox" id="lower_upper_condition" checked>
                        <span class="slider round coloured_always"></span>
                    </label>
                    <label for=""> Only UpperCase </label>
                </div>
                
                <div class="tool_button" style="background-color: #138CDD" @click="genFormatedID()">Generate ID!</div>
                <div class="tool_button" style="background-color: #138CDD" @click="formatedIDList = []">Clear ID's</div>
                <div class="tool_button" style="background-color: #138CDD" @click="formatedIDList = [], genFormatedID()">Generate New Set</div>
            </div>
            <div class="id_output" v-if="toolItem == 'Formated ID Generator'">
                <p v-for="id in formatedIDList" :key="id">{{id}}</p>
                <p v-if="idLoading">Generating ID</p>
            </div>

            <!-- Salaray Manager -->
            <div v-if="toolItem == 'Salary Manager'" class="tool_settings">
                <div>
                    <label for="">Enter Salary Amount: </label>
                    <input type="number" id="salary_input">
                </div>
                <div class="tool_button" style="background-color: #AF35FF" @click="saveSalary()">
                    Save Salary Amount!
                    <p style="font-size: 0.6rem">Note: This doesn't edit any saved transactions</p>
                </div>
                <div id="year_select">
                    <label for="salary_year_selection">Choose a Tax Year:</label>
                    <select id="salary_year_selection"  @change="onchange()">
                        <template v-for="(recordDict, recordYear) in userObj['records']['years']" :key="recordDict" >
                            <option :data="recordYear">
                                {{ recordYear }}
                            </option>
                        </template>
                    </select>
                </div>
            </div>
            <div class="id_output" v-if="toolItem == 'Salary Manager'">
                <div id="salary_container">
                    <div>
                        <p v-for="(amount, monday) in salaryCurrent" :key="monday" >{{monday}} : {{amount}}</p>
                        <p style="border-top: 1px solid black">{{salaryCurrentTotal}}</p>
                    </div>
                    <div>
                        <p v-for="(amount, monday) in salaryProjected" :key="monday" style="color: green">{{monday}} : {{amount}}</p>
                        <p style="color: green; border-top: 1px solid black">{{salaryProjectedTotal}}</p>
                    </div>
                </div>
                <div>Total Difference: ${{salaryProjectedTotal - salaryCurrentTotal}}</div>
            </div>
        </div>

    </div>
</template>

<script>
import { userDict } from '../main.js'
import { generateID } from '../../public/generalFunctions.js';
import $ from 'jquery'
export default {
    name: 'HelpView',
    components: {

    },
    data(){
        return{
            toolList: {'ID Generator': '34DD13', 'Formated ID Generator': '138CDD', 'Salary Manager': 'AF35FF'},
            toolItem: '',
            idList: [],
            formatedIDList: [],
            idLoading: false,
            userObj: userDict,
            mixedCondition: true,
            salaryProjected: {},
            salaryCurrent: {},
            salaryProjectedTotal: 0,
            salaryCurrentTotal: 0,
        }
    },
    mounted(){
        
    },
    methods: {
        genID(){
            let length = parseInt($('#id_length').val() || 8);
            if(length > 120){
                length = 120;
            }
            $('#id_length').val(length)

            let amount = parseInt($('#id_amount').val() || 1);
            if(amount > 50){
                amount = 50
            }
            $('#id_amount').val(amount)
            
            let maxAmount = Math.pow(52, length)
            for(let i = 0; i < amount; i++){
                let id = generateID({}, length);
                if(this.idList.includes(id)){
                    this.idLoading = true;
                    while(this.idList.includes(id)){
                        id = generateID({}, length);
                        if(this.idList.length >= maxAmount){
                            this.idLoading = false;
                            return
                        }
                    }
                    this.idList.push(id)
                    this.idLoading = false;
                }
                else {
                    this.idList.push(id);
                    this.idLoading = false;
                }
            }
        },
        genFormatedID(){
            let numbersInlcuded = $('#numbers_condition')[0].checked;
            let mixedCondition = !$('#mixed_condition')[0].checked;
            let upperCase;
            if(!mixedCondition){
                upperCase = $('#lower_upper_condition')[0].checked;
            }
            let characters = '';
            if(numbersInlcuded){
                characters += "0123456789"
            }
            if(mixedCondition){
                characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
            }
            else if(upperCase){
                characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            } else {
                characters += "abcdefghijklmnopqrstuvwxyz"
            }
            let length = parseInt($('#id_length_formated').val() || 8);
            if(length > 120){
                length = 120;
            }
            $('#id_length_formated').val(length)

            let amount = parseInt($('#id_amount_formated').val() || 1);
            if(amount > 50){
                amount = 50
            }
            $('#id_amount_formated').val(amount)

            let maxAmount = Math.pow(52, length)
            for(let i = 0; i < amount; i++){
                let id = this.generateFormatedID({}, length, characters);
                if(this.formatedIDList.includes(id)){
                    this.idLoading = true;
                    while(this.formatedIDList.includes(id)){
                        id = this.generateFormatedID({}, length, characters);
                        if(this.formatedIDList.length >= maxAmount){
                            this.idLoading = false;
                            return
                        }
                    }
                    this.formatedIDList.push(id)
                    this.idLoading = false;
                }
                else {
                    this.formatedIDList.push(id);
                    this.idLoading = false;
                }
            }

        },
        generateFormatedID(check = {}, length = 5, characters){
            if(length == '' || length == null){
                length = 5;
            }
            let result = '';
            let is_duplicate = true;
            while(is_duplicate){
                //Generate an ID.
                for ( let i = 0; i < length; i++ ) {
                    let char = characters.charAt(Math.floor(Math.random() * characters.length));
                    while(!isNaN(char) && i == 0){
                        char = characters.charAt(Math.floor(Math.random() * characters.length));
                    }
                    result += char
                    if(i >= 120){
                        return
                    }
                }
                //Check if it already exists. If so, generate again. If not, continue.
                if(typeof ([result, result, result, result, result, result].reduce((check, level) => check && check[level], check)) == 'undefined'){
                    is_duplicate = false;
                }
            }
            return result;
        },
        saveSalary(){
            userDict['tools']['salaryAmount'] =  parseFloat($('#salary_input').val());
            this.onchange();
        },
        getMondays(yearID){
            let years = yearID.split(' - ');
            let mondays = [];
            let date = new Date()
            // Set Dates
            date.setFullYear(parseInt(years[0]));
            date.setMonth(3)
            date.setDate(1);

            // Get the first Monday in the month
            while (date.getDay() !== 1) {
                date.setDate(date.getDate() + 1);
            }
            // Get all the other Mondays in the month
            while (date.getFullYear() === parseInt(years[0])) {
                let pushDate = new Date(date.getTime());
                mondays.push(String(pushDate.getDate()).padStart(2, '0') + '/' + String(pushDate.getMonth() + 1).padStart(2, '0') + '/' + pushDate.getFullYear());
                date.setDate(date.getDate() + 7);
            }
            while (date.getMonth() < 3) {
                let pushDate = new Date(date.getTime());
                mondays.push(String(pushDate.getDate()).padStart(2, '0') + '/' + String(pushDate.getMonth() + 1).padStart(2, '0') + '/' + pushDate.getFullYear());
                date.setDate(date.getDate() + 7);
            }

            return mondays;
        },
        getMonadyOfWeek(parsedDate){
            let date = new Date();
            let splitDate = parsedDate.split("/")
            date.setDate(parseInt(splitDate[0]))
            date.setMonth(parseInt(splitDate[1]) - 1)
            date.setFullYear(parseInt(splitDate[2]))
            let day = date.getDay(),
                diff = date.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
            let newDate = new Date(date.setDate(diff));
            return `${String(newDate.getDate()).padStart(2, '0')}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${newDate.getFullYear()}`
        },
        onchange(){
            let yearID = $(`#salary_year_selection option:selected`).attr('data');
            let date = new Date();
            let thisYear = date.getFullYear();
            let month = date.getMonth();
            let yearIDToday;
            if(month < 3){ //April is 3rd month
                yearIDToday = `${thisYear - 1} - ${thisYear}`;
            }else{
                yearIDToday = `${thisYear} - ${thisYear + 1}`;
            }
            if(yearID != yearIDToday){
                this.showSalary("00/00/0000", yearID)
            }else{
                let currentDate = this.getMonadyOfWeek(`${String(date.getDate()).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${thisYear}`);
                this.showSalary(currentDate, yearID)
            }

        },
        showSalary(currentDate, yearID){
            this.salaryProjected = {};
            this.salaryProjectedTotal = 0
            this.salaryCurrent = {};
            this.salaryCurrentTotal = 0;
            for(const element of this.getMondays(yearID)){
                this.salaryProjected[element] = userDict['tools']['salaryAmount'];
                this.salaryProjectedTotal += userDict['tools']['salaryAmount']
                this.salaryCurrent[element] = 0;
                if(element == currentDate){
                    break;
                }
            }
            for(const[transID, transDict] of Object.entries(userDict['records']['years'][yearID]['transactions'])){
                if(transDict['category'] == "Salary"){
                    let date = this.getMonadyOfWeek(transDict['date'])
                    this.salaryCurrent[date] = parseInt(transDict['amount']) * -1;
                    this.salaryCurrentTotal += parseInt(transDict['amount']) * -1
                }
            }
        }
    },
    watch:{
        toolItem(newValue){
            if(newValue == "Salary Manager"){
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
                let currentDate = this.getMonadyOfWeek(`${String(date.getDate()).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${thisYear}`);
                this.showSalary(currentDate, yearID)
                this.$nextTick(() => {
                    $('#salary_input').val(userDict['tools']['salaryAmount'])
                    $(`#salary_year_selection`).val(yearID);
                });
            }
        }
    }
}
</script>
<style scoped lan="scss">
#selection_container{
    height: 92%;
    width: 250px;
    margin-left: 10px;
    margin-top: 50px;
    gap: 18px;
    display: flex;
    flex-direction: column;
}
#tool_container{
    height: 92%;
    width: 100%;
    margin-top: 10px;
    margin-right: 10px;
    display: flex;
    padding: 25px;
    gap: 10px;
}
.tool_button{
    border: 1px solid black;
    cursor: pointer;
    padding: 8px 0px;
    border-radius: 10px;
    user-select: none;
}
.tool_button:hover {
	box-shadow: 0 14px 28px rgba(0, 0, 0, 0.082), 0 10px 10px rgba(0, 0, 0, 0.11);
}

.tool_settings{
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 400px;
    min-width: 400px;
}

.id_output{
    width: 100%;
    gap: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: wrap;
    overflow-x: auto;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider.coloured_always{
    background-color: #8B13DD;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}


#salary_container{
    display: flex;
    width: 100%;
    gap: 15px;
}
</style>
