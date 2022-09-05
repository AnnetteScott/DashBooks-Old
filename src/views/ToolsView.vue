<template>
    <div class="pageHome">
        <div id="selection_container">
            <div v-for="colour, tool in toolList" :key="tool" class="tool_button" :style="`background-color: #${colour}`" @click="toolItem = tool">{{ tool }}</div>
        </div>
        <div id="tool_container">
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
            </div>
            <div class="id_output">
                <p v-for="id in idList" :key="id">{{id}}</p>
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
            toolList: {'ID Generator': '34DD13'},
            toolItem: 'ID Generator',
            idList: []
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
                while(this.idList.includes(id)){
                    id = generateID({}, length);
                    if(this.idList.length >= maxAmount){
                        return
                    }
                }
                this.idList.push(id)
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
    margin-top: 10px;
    gap: 18px;
    display: flex;
    flex-direction: column;
}
#tool_container{
    height: 92%;
    width: 100%;
    margin-top: 10px;
    margin-right: 10px;
    border: 1px solid black;
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
</style>
