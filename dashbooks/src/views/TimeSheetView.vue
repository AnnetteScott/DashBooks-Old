<template>
    <div class="pageHome">
        <div id="container">
            <div id="top_title" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%); color: white;}">
                <template v-if="weekID !== ''">
                    <p>Complete </p>
                    <p id="hours_left" style="font-weight: bold;"></p>
                    <p>more hours to reach {{ projectDict['targetHours'] }}H</p>
                </template>
                <template v-else>
                    Click on a week to get started!
                </template>
            </div>
        </div>
        <div id="weeks_container">
			<template v-for="(weekDict, weekID) in projectDict['weeks']" :key="weekDict">
				<template v-if="weekDict['invoiced'] == true">
                    <q-btn class="glossy" rounded color="primary" :label="weekID" @click="weekButton" :data="weekID"/> 
				</template>
				<template v-else>
					<q-btn class="glossy" rounded color="secondary" :label="weekID" @click="weekButton" :data="weekID"/>
				</template>
			</template>
            <q-btn class="glossy" rounded color="primary" label="+" @click="addWeek"/>
		</div>
		<div id="time_sheet_container">
			<TimeSheet :weekID="currentWeek" ref="TimeSheet"/> 
		</div>
			
		<div id="colour_container">
			<div v-for="colourID in projectDict['colours']" :key="colourID" :colourid="colourID" class="colour_item" :style="`background-color:${userObj['colours'][colourID]['colour']};`" @click="colourCell">
                <p v-bind:style="`color: ${pickTextColorBasedOnBgColor(userObj['colours'][colourID]['colour'])}`">{{ userObj['colours'][colourID]['name'] }}</p>
            </div>
            <div class="colour_item" style="background-color: #000" @click="current_request_form=`createColourForm`">
                <p style="color: #fff">+</p>
            </div>
		</div>
    </div>
</template>

<script>
import { userDict } from '../main.js'
import TimeSheet from '../components/TimeSheet'
import $ from 'jquery'
export default {
    name: 'TimeSheetView',
    components: {
        TimeSheet
    },
    data(){
        return {
            userObj: userDict,
            projectDict: userDict['projects'][this.$route.params.projectID],
            weekID: '',
            currentWeek: ``
        }
    },
    mounted(){
        console.log(this.projectDict)
    },
    methods: {
        addWeek(){
            let colourIds = Object.keys(userDict['colours'])
            let duration = this.projectDict['duration'];
            if(this.projectDict['weekInterval'] == 1){
                let date = this.projectDict['weeks'][`${duration}`]['startDate'];
                date = addToDate(date, 14);
                this.projectDict['weeks'][`${duration + 1}`] = {'startDate': date, 'colouredCells': {}, 'invoiced': false};
                colourIds.forEach(colourID => {
                    if(colourID != 'colourWhite'){
                        this.projectDict['weeks'][`${duration}`]['colouredCells'][colourID] = [];
                    }
                });
                this.projectDict['duration'] += 1;

            }else if(this.projectDict['weekInterval'] == 2){
                let lastKey = `${duration - 1} - ${duration}`;
                let date = this.projectDict['weeks'][lastKey]['startDate'];
                date = addToDate(date, 14);
                this.projectDict['weeks'][`${duration + 1} - ${duration + 2}`] = {'startDate': date, 'colouredCells': {}, 'invoiced': false};
                colourIds.forEach(colourID => {
                    if(colourID != 'colourWhite'){
                        this.projectDict['weeks'][`${duration + 1} - ${duration + 2}`]['colouredCells'][colourID] = [];
                    }
                });
                this.projectDict['duration'] += 2;
            }
        },
		weekButton(event){
			this.weekID = $(event.target).attr('data');
			$('.button_link').each((index, weekButton) => {
				$(weekButton).removeClass('activeButton');
			});
			$(event.target).addClass('activeButton')
			this.weekDict = this.projectDict['weeks'][this.weekID];
			this.currentWeek = this.weekID;
			setTimeout(() => {
				this.$refs.TimeSheet.updateLib();
				setTimeout(() => {
					this.updateColourTotals();
				}, 1)
			}, 1)			
		},
        pickTextColorBasedOnBgColor(bgColor) {
            let color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
            let r = parseInt(color.substring(0, 2), 16); // hexToR
            let g = parseInt(color.substring(2, 4), 16); // hexToG
            let b = parseInt(color.substring(4, 6), 16); // hexToB
            let uicolors = [r / 255, g / 255, b / 255];
            let c = uicolors.map((col) => {
                if (col <= 0.03928) {
                return col / 12.92;
                }
                return Math.pow((col + 0.055) / 1.055, 2.4);
            });
            let L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
            return (L > 0.179) ? '#000000' : '#ffffff';
        },
        colourCell(event){
			this.selectedCellsList = localStorage.getItem('selectedCellsList').split(',');
			const colourID = $(event.target).attr('colourid');
			this.selectedCellsList.forEach(cellID => {
				for(const colourIDm of Object.keys(this.masterDict['colours'])){
					if(colourIDm != 'colourWhite'){
						if(this.weekDict['colouredCells'][colourIDm].includes(cellID)){
							this.weekDict['colouredCells'][colourIDm].splice(this.weekDict['colouredCells'][colourIDm].indexOf(cellID), 1)
						}
					}
				}
				if(colourID != 'colourWhite'){
					this.weekDict['colouredCells'][colourID].push(cellID);
				}
				$(`[cellid=${cellID}]`).css({"background-color": this.masterDict['colours'][colourID]['colour'], "border-color": "black"});
			});

			this.selectedCellsList = [];
			localStorage.setItem('selectedCellsList', 'coloured') 
			.setItem('masterDict', JSON.stringify(this.masterDict));
			this.updateColourTotals();
			this.$refs.TimeSheet.updateLib();
		},
		updateColourTotals(){
			let cellTotal = this.projectDict['timeList'].length + 1;
			for(const [colourID, cellArr] of Object.entries(this.weekDict['colouredCells'])){
				if(colourID != 'colourWhite'){
					let colourTotals = {};
					if(this.projectDict['weekInterval'] == 1){
						colourTotals = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0, 'G': 0};
					}else{
						colourTotals = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0, 'G': 0, 'H': 0, 'I': 0, 'J': 0, 'K': 0, 'L': 0, 'M': 0, 'N': 0};
					}
					cellArr.forEach(cellID => {
						colourTotals[cellID.charAt(0)] += Math.round((1/(60/this.projectDict['timeInterval'])) * 1000) / 1000;
					});
					for(let [collID, colourTotal] of Object.entries(colourTotals)){
						$(`[cellid=${collID}${cellTotal}]`).text(`${colourTotal.toFixed(2)}`)
					}
					cellTotal++;
				}
				
			}
			let columns = {};
			if(this.projectDict['weekInterval'] == 1){
				columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
			}else{
				columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
			}
			let weekTotal = 0;
			let weekMoney = 0;
			let timeTotal = 0;
			let timeMoney = 0;
			for(let i = 0; i < this.projectDict['weekInterval'] * 7; i++){
				let cellTotal = this.projectDict['timeList'].length + 1;
				let colTotal = 0;
				let colMoney = 0;
				for(let index in this.projectDict['colours']){ //Total up each colour per coloumn
					if(this.projectDict['colours'][index] != 'colourWhite'){
						let cellID = `${columns[i]}${cellTotal}`;
						colTotal += parseFloat($(`[cellid=${cellID}]`).text())
						colMoney += parseFloat($(`[cellid=${cellID}]`).text()) * this.masterDict['colours'][this.projectDict['colours'][index]]['rate']
						cellTotal++;
					}
				}
				weekTotal += colTotal;
				weekMoney += colMoney;
				$(`[cellid=${columns[i]}${cellTotal}]`).text(`${colTotal}H`)
				$(`[cellid=${columns[i]}${cellTotal + 1}]`).text(`$${colMoney.toFixed(2)}`)
				if(i % 7 == 6){
					$(`[cellid=${columns[i - 6]}${cellTotal + 2}]`).text(`${weekTotal}H`);
					$(`[cellid=${columns[i - 6]}${cellTotal + 3}]`).text(`$${weekMoney.toFixed(2)}`);
					timeTotal += weekTotal;
					timeMoney += weekMoney;
					weekTotal = 0;
					weekMoney = 0;
				}
				
			}
            $(`[cellid=A${cellTotal + 4}]`).text(`${timeTotal.toFixed(2)}H`);
			$(`[cellid=A${cellTotal + 5}]`).text(`$${timeMoney.toFixed(2)}`);
            let neededHours = this.projectDict['targetHours'] - timeTotal <= 0 ? 0 : this.projectDict['targetHours'] - timeTotal;
            $(`#hours_left`).text(neededHours)
		}

    }
}
</script>
<style scoped lang="scss">
#container{
    display: flex;
    align-items: center;
	justify-content: center;
}
#top_title{
    margin-top: 5px;
	height: 30px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
    width: 400px;
    box-shadow: 0px 0px 10px -5px white inset, 0px 4px 16px -16px black;
    border-radius: 10px;
    background-color: #ffffff56;
    font-family: 'Lato';
}

#top_title > p{
	font-size: 17px;
    padding: 0px 4px;
    color: white;
}
#weeks_container{
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 150px;
	min-width: 150px;
	padding-top: 10px;
	height: calc(100vh - var(--navbar_height) - 10vh);
	overflow-y: scroll;
	margin: 10px 10px 10px 10px;
	box-shadow: 0px 0px 10px -5px white inset, 0px 4px 16px -16px black;
	border-radius: 10px;
	background-color: #ffffff3b;
}

#weeks_container > div{
	width: 90%;
	height: 30px;
}

#time_sheet_container{
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: flex-start;
	width: 100%;
	height: calc(100vh - var(--navbar_height) - 10vh);
	overflow-y: scroll;
	margin: 10px 10px 10px 10px;
	box-shadow: 0px 0px 10px -5px white inset, 0px 4px 16px -16px black;
	overflow-x: scroll;
	border-radius: 10px;
	background-color: #ffffff3b;
}

#colour_container{
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 200px;
	min-width: 200px;
	height: calc(100vh - var(--navbar_height) - 10vh);
	overflow-y: scroll;
	margin: 10px 10px 10px 10px;
	box-shadow: 0px 0px 10px -5px white inset, 0px 4px 16px -16px black;
	border-radius: 10px;
	background-color: #ffffff56;
	font-family: 'Lato';
}
</style>
