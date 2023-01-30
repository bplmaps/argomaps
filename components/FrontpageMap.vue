<template>
	<div>
		<h1>{{ title }}</h1>
		<div id="map-holder">

		</div>
	</div>
</template>

<style>

#map-holder {
	height: 500px;
	width: 100%;
	background-color: black;
}
</style>

<script>

import Vue from 'vue'
// const ol = Vue.ol
import api_keys from "~/data/api_keys.json";

export default {
	props: {
		title: String
	},

	mounted() {
		const map = new Vue.ol.Map({
			layers: [
				new Vue.ol.TileLayer({
					source: new Vue.ol.TileJSON({
						url: `https://api.maptiler.com/maps/voyager-v2/tiles.json?key=${api_keys.maptiler}`,
						crossOrigin: 'anonymous',
					}),
				}),
			],
			target: 'map-holder',
			view: new Vue.ol.View({
				center: [0, 0],
				zoom: 2,
			}),
		});
	}
}
</script>