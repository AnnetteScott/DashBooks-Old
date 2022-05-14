<template>
    <!-- Create Project -->
	<div class="form_container" v-if="projectForm == `createProject`">
		<div class="form">
			<label for="create_project_name">Project name:</label>
			<input id="create_project_name" type="text" />

			<label for="create_project_duration">Project duration:</label>
			<input id="create_project_duration" type="number" />
			
			<label for="create_project_target">Target Hours Per TimeSheet:</label>
			<input id="create_project_target" type="number" />

			<label for="create_project_date">Project start date:</label>
			<input id="create_project_date" type="date" />

			<label for="time_interval">Choose a Time Interval:</label>
			<select id="time_interval">
				<option value="5">5 Minutes</option>
				<option value="10">10 Minutes</option>
				<option value="15">15 Minutes</option>
				<option value="30">30 Minutes</option>
				<option value="60">1 Hour</option>
			</select>
			
			<label for="week_interval">Choose a Timesheet length:</label>
			<select id="week_interval">
				<option value="1">1 Week</option>
				<option value="2">2 Weeks</option>
			</select>

			<fieldset>
                <q-btn class="glossy" rounded color="primary" label="Create Project" @click="createProject"/>
                <q-btn class="glossy" rounded color="secondary" label="Cancel" @click="this.$emit('cancelled', '')"/>
			</fieldset>
		</div>
	</div>
	
	<!-- Edit Project -->
	<div class="form_container" v-if="projectForm == `editProjectForm`">
		<div class="form">
			<div id="edit_projectID" projectid="invalid"></div>
			<label for="edit_project_name">Project name:</label>
			<input id="edit_project_name" type="text" />

			<label for="edit_project_duration">Project duration:</label>
			<input id="edit_project_duration" type="number" />
			
			<label for="edit_project_target">Target Hours Per TimeSheet:</label>
			<input id="edit_project_target" type="number" />

			<fieldset>
                <q-btn class="glossy" rounded color="primary" label="Save Project" @click="editProject"/>
                <q-btn class="glossy" rounded color="secondary" label="Cancel" @click="this.$emit('cancelled', '')"/>
                <q-btn class="glossy" rounded color="red" label="Delete" />
			</fieldset>
		</div>
	</div>
</template>

<script>
import { userDict } from '../main.js'
import { generateID, reDoDate, addToDate } from '../../public/generalFunctions.js';
export default {
    name: 'ProjectForms',
    emits: ["cancelled"],
    props: {
        projectForm: String
    },
    methods: {
        createProject(){
            let name = $('#create_project_name').val();
			let duration = parseInt($('#create_project_duration').val());
			let target = parseInt($('#create_project_target').val());
			let date = reDoDate($('#create_project_date').val());
			let timeInterval = parseInt($(`#time_interval option:selected`).val())
			let weekInterval = parseInt($(`#week_interval option:selected`).val())

			if(name == '' || name == null){ //If no project name was entered.
				$("#create_project_name").addClass('form_error');
				return false;
			}
			if(isNaN(duration)){ //If no duration was provided
				$("#create_project_duration").addClass('form_error');
				$("#create_project_name").removeClass('form_error');
				return false;
			}
			if(date == 'NaN/NaN/NaN'){ //If no date was provided
				$("#create_project_date").addClass('form_error');
				$("#create_project_target").removeClass('form_error');
				return false;
			}
			$("#create_project_date").removeClass('form_error');
			$("#create_project_name").removeClass('form_error');
			$("#create_project_duration").removeClass('form_error');
			$("#create_project_target").removeClass('form_error');

			$('#create_project_name').val('');
			$('#create_project_duration').val('');
			$('#create_project_date').val('');

            isNaN(target) ? target = 0 : target;

			const projectID = generateID(userDict);
			
			let timeList = [];
			for(let h = 0; h < 24; h++){
				let hour = h;
				if(h < 10){
					hour = `0${h}`
				}
				for(let m = 0; m < 60; m += timeInterval){
					let minute = m;
					if(m < 10){
						minute = `0${m}`
					}
					timeList.push(`${hour}:${minute}`)
				}
			}
			let colourIds = Object.keys(userDict['colours'])

			userDict['projects'][projectID] = {'name': name, 'colours': colourIds, 'weeks': {}, 'timeList': timeList, 'duration': duration, 'weekInterval': weekInterval, 'timeInterval': timeInterval, 'targetHours': target};
			
			
			if(weekInterval == 1){
				for(let w = 1; w <= duration; w++){
					userDict['projects'][projectID]['weeks'][`${w}`] = {'startDate': date, 'colouredCells': {}, 'invoiced': false};
					colourIds.forEach(colourID => {
						if(colourID != 'colourWhite'){
							userDict['projects'][projectID]['weeks'][`${w}`]['colouredCells'][colourID] = [];
						}
					});
					date = addToDate(date, 7);
				}
			}else if(weekInterval == 2){
				if(duration % 2 == 1){
					duration++;
					userDict['projects'][projectID]['duration'] = duration;
				}   
				for(let w = 1; w <= duration; w+= 2){
					userDict['projects'][projectID]['weeks'][`${w} - ${w + 1}`] = {'startDate': date, 'colouredCells': {}, 'invoiced': false};
					colourIds.forEach(colourID => {
						if(colourID != 'colourWhite'){
							userDict['projects'][projectID]['weeks'][`${w} - ${w + 1}`]['colouredCells'][colourID] = [];
						}
					});
					date = addToDate(date, 14);
				}
			}
        }
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
