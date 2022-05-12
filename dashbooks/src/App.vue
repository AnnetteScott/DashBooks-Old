<template>
    <nav>
          <div class="q-pa-md">
            <q-toolbar class="bg-primary text-white shadow-2 glossy">
            <q-btn flat label="Homepage" to="/" />
            <q-space />

            <q-tabs v-model="tab" shrink>
                <q-route-tab name="Settings" label="Settings" to="/settings"/>
                <q-route-tab name="Projects" label="Projects" to="/projects"/>
                <q-route-tab name="Records" label="Records" to="/records"/>
                <q-route-tab name="About" label="About" to="/about"/>
            </q-tabs>
            </q-toolbar>
        </div>
    </nav>
  <router-view/>
</template>

<style>
@import url('../public/root.css');
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100vh;
    margin-top: var(--navbar_height);
}

.home {
    height: 100%;
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

.q-tab__indicator{
    opacity: 0;
}
.q-pa-md {
    padding: 0px !important;
}
.q-tab__label{
    opacity: 1;
    color: white;
}
</style>
