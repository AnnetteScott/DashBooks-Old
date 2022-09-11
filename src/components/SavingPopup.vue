<template>
	<div id="saving_pop_up" :style="{opacity: savingStatus ? 1 : 0}">
		<span class="spinner"></span>
		<p>Saving...</p>
	</div>
</template>

<script>
export default {
	name: 'SavingPopup',
	props: {
        savingStatus: Boolean
    },
	
}
</script>

<style scoped>
#saving_pop_up {
	position: absolute;
	z-index: 600;
	top: 55px;
	left: 10px;
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
	align-items: center;
	gap: 10px;
	width: 100px;
	height: 40px;
	color: black;
	font-size: 20px;
	opacity: 0;
	transition: 0.5s ease opacity;
    pointer-events: none;
}
#saving_pop_up .spinner {
	position: relative;
	display: block;
	height: 1em;
	aspect-ratio: 1;
	color: inherit;
	border: 0.15em solid #ffffff23;
	border-top: 0.15em solid currentColor;
	border-radius: 50%;
	animation: saving_spinner 0.8s linear infinite;
}
@keyframes saving_spinner {
	0%   {transform: rotate(0deg);}
	100% {transform: rotate(360deg);}
}
#saving_pop_up p {
	font-size: 1em;
    user-select: none;
}
</style>
