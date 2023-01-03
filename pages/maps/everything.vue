<template>
	<div class="map-result thumbnail-view">

		<h1>All maps</h1>

		<div class="maps-list thumbnail-view">
			<a v-for="map, map_key in listOfAllMaps" :key="map_key" :href="'/maps/' + map_key">
				<div class="result-image"
					:style="'background-image: url(\'https://bpldcassets.blob.core.windows.net/derivatives/images/' + map.exemplary_image_ssi + '/image_thumbnail_300.jpg\');'">
				</div>
				<div class="result-text">{{ map.title_info_primary_tsi }}</div>
			</a>
		</div>

	</div>


</template>

<style>

</style>

<script>

import home_data from '~/data/maps_extended.json';

export default {
	name: 'MapsEverything',
	head() {
		return {
			title: "All collections objects in ARGO",
			meta: [{
				hid: 'description',
				name: 'description',
				content: (this.this_map) ? 'Detailed information about ' + this.this_map.solr_id : 'Maps description',
			}]
		}
	},
	data() {
		return {
			listOfAllMaps: home_data.maps
		}
	},
	beforeMount() {
	},
	mounted() {
	},
	methods: {
	}

}
</script>
