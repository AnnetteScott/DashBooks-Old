<template>
    <nav>
        <span class="menu_button" @click="navbar_menu_open = !navbar_menu_open" style="background-image: url('@/assets/icons/menu_white_24dp.svg')">
        </span>
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/settings">Settings</router-link>
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
	padding: 0px 40px;
	font-family: 'Lato';
	font-size: 0.9em;
    color: white;
	background-color: black;
}

nav .menu_button {
	position: relative;
	display: block;
	height: 75%;
	aspect-ratio: 1;
	background-position: center;
	background-repeat: no-repeat;
	background-size: 100%;
	cursor: pointer;
}
</style>
