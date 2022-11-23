<template>
	<details open v-if="ready" id="results-bar"  :class="['show',(drawer_results_visible.length) ? 'results-visible' : '']">
		<summary>{{drawer_results_visible.length}} Result<template v-if="drawer_results_visible.length != 1">s</template></summary>
		<div id="results" :class="view_class+'-view'">
			<ul class="results-views">
				<li :class="['results-view-option',{'active' : view_class=='list'}]" id="list-view" @click="view_class = 'list'">List</li>
				<li :class="['results-view-option',{'active' : view_class=='thumbnail'}]"  id="thumbnail-view" @click="view_class = 'thumbnail'">Thumbnail</li>
			</ul>
			<template v-for="result, index in drawer_results_visible" >
			<a :href="'/maps/'+maps[result].solr_id" v-if="index < view_result_maximum" :key="index">
				<div class="result-image" :style="'background-image:url(https://bpldcassets.blob.core.windows.net/derivatives/images/'+maps[result].exemplary_image_ssi+'/image_thumbnail_300.jpg)'"></div>
				<div class="result-text">{{maps[result].title_info_primary_tsi}}</div>
			</a>
			</template>
			<a class="map-results-more" @click="view_result_maximum += 10" v-if="drawer_results_visible.length > view_result_maximum">Show more</a>
		</div>
	</details>
</template>

<script>
// import people from '~/data/people.json'

export default {
	name: 'Drawer',
	props: [
		'drawer_results_visible',
		'maps',
	],
	head () {
		return {
		title: (this.person) ? this.person.name + ' Information' : 'People',
			meta: [{
				hid: 'description',
				name: 'description',
				content: (this.person) ? 'Detailed information about ' + this.person.name : 'People Description',
			}]
		}
    },
	asyncData ({ route }) {

		var person = '';
		var current_slug;

		return {
			person,
			current_slug,
		}

	},
	data() {
		return {
			ready: true,
			view_results_number: 10,
			view_class: 'list',
			view_result_maximum: 10,
			// current_slug: null,
		}
	},
	beforeMount() {
	},
	mounted(){
		// this.paintMapsSlider();
	},
	methods: {
		showMaps: function(which) {
			console.log('> showMaps', which);
			// if (this.results_visible != which) {
				this.results_visible = which;
			// }
		},

	}
}
</script>
