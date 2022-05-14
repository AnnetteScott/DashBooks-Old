<template>
    <nav>
        <div>
            <q-toolbar class="bg-primary text-white shadow-2 glossy">
            <q-space />

            <q-tabs v-model="tab" shrink>
                <q-route-tab name="DashBoard" label="DashBoard" to="/"/>
                <q-route-tab name="Settings" label="Settings" to="/settings"/>
                <q-route-tab name="Projects" label="Projects" to="/projects"/>
                <q-route-tab name="Invoicing" label="Invoicing" to="/invoice"/>
                <q-route-tab name="Records" label="Records" to="/records"/>
                <q-route-tab name="Help" label="Help" to="/help"/>
            </q-tabs>
            </q-toolbar>
        </div>
    </nav>
  <router-view/>
</template>

<script>
import { ref } from 'vue'
export default {
    name: 'HomeView',
    components: {

    },
    setup () {
        return {
                tab: ref('')
            }
    }
}
</script>


<style>
@import url('../public/root.css');
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background-color: #f4f5f8;
    height: 100vh;
    margin-top: var(--navbar_height);
}

@media only screen and (max-width: 1438px) {
    #app {
        height: calc(100vh - var(--navbar_height));
        overflow-x: scroll;
    }
}

nav {
    position: fixed;
	z-index: 999;
	top: 0px;
	right: 0px;
	left: 0px;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
	height: var(--navbar_height);
	font-family: 'Lato';
	font-size: 0.9em;
    color: white;
	background-color: white;
}

.pageHome{
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
    min-width: 1438px;
}

p{
    margin: 0px;
}
</style>
