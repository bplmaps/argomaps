<template>

	<div>
		<div v-if="current_tag_data && current_tag_data.name" class="filter">
			<div class="filter-explore-by">
				<h1>{{current_tag_data.name}}</h1>
				<ul>
					<li v-for="tag, tag_index in tags" :key="tag_index" @click="showByFilter(tag_index)" :class="(tag_index==filter_by) ? 'active' : ''">{{tag.name}}</li>
				</ul>
				<div class="filter-view-switch">
					<label for="filter_view_switch">View: </label>
					<select v-model="filter_view" id="filter_view_switch">
						<option value="gallery">Gallery</option>
						<option value="list">List</option>
					</select>
				</div>
			</div>
			<h2>{{this.tags[this.filter_by].name}}</h2>
			<ul :class="'filter-list '+filter_view+'-view'">
				<template v-for="person, person_index in this.tags[this.filter_by].solr_ids_array">
					<li v-if="maps[person]" :key="person_index" class="filter-result">
						<div class="result-image" :style="'background-image: url(\'https://bpldcassets.blob.core.windows.net/derivatives/images/'+maps[person].exemplary_image_ssi+'/image_thumbnail_300.jpg\');'">
							<ul class="result-tags">
								<template v-for="people_tag_id, people_tag_index in person.people_tag_ids">
								<li v-if="tags[people_tag_id]" :key="people_tag_index">{{tags[people_tag_id].name}}</li>
								</template>
							</ul>
						</div>
						<div class="title-tags">
							<h3>{{maps[person].title_info_primary_tsi}}</h3>
						</div>
						<div class="text">
							<p>{{maps[person].title_info_primary_subtitle_tsi}}</p>
							<a :href="'/maps/'+maps[person].solr_id" class="button-like dark">See map</a>
						</div>
					</li>
				</template>
			</ul>
		</div>
		<div v-else>
			<div class="filter" v-for="group, group_index in tag_groups" :key="group_index">
				<h2>{{group.show_name}}</h2>
				<ul class="filter-list gallery-view">
					<li class="filter-result" v-for="data, data_index in group.data" :key="data_index">
						<div class="result-image" :style="'background-image:url('+data.image+')'">
							<ul class="result-tags"></ul>
						</div> 
						<div class="title-tags">
							<h3><a :href="'/explore/'+group_index+'-'+data_index">{{data.name}}</a></h3>
						</div> 
					</li>
				</ul>
			</div>
		</div>

	</div>

</template>

<script>
import home_data from '~/data/home_data.json'

export default {
	name: 'FacetPage',
	// head () {
	// 	return {
	// 	title: (this.person) ? this.person.name + ' Information' : 'People',
	// 		meta: [{
	// 			hid: 'description',
	// 			name: 'description',
	// 			content: (this.person) ? 'Detailed information about ' + this.person.name : 'People Description',
	// 		}]
	// 	}
    // },
	asyncData ({ route }) {

		var maps = home_data.maps;
		var tag_groups = home_data.tag_groups

		if (route.params.explore_type) {
			var explore_url = route.params.explore_type;
			var explore_url_split = explore_url.split('-');
			var explore_group = explore_url_split[0];
			var explore_id = explore_url_split[1];
			var tags = home_data.tag_groups[explore_group].data;
			var filter_by = explore_id;
			var current_tag_data = tags[explore_id];
		}


		return {
			tag_groups,
			tags,
			maps,
			explore_url,
			explore_id,
			current_tag_data,
			filter_by,
			// tag_data: tags.data,
		}

	},
	data() {
		return {
			// filter_by: 0,
			filter_view: 'gallery',
			// current_tag_data: null,
			// current_slug: null,
		}
	},
	beforeMount() {
		// this.current_slug = this.person.slug;
		// this.getData();
		// this.filter_by = this.explore_id;
		// this.current_tag_data = this.tags[this.filter_by];
		// if (this.person) {
		// 	let person_keys = this.person.people_tag_ids;
		// 	console.log('??', person_keys);
		// 	for (let i=0;i<person_keys.length; i++) {
		// 		console.log('>', person_keys[i]);
		// 		this.people_tags[person_keys[i]].open = true;
		// 	}
		// }
	},
	mounted(){
		//this.paintMapsSlider();
	},
	methods: {
		paintMapsSlider: function() {
			// console.log('> paintMapsSlider');
			var maps_swiper = new Swiper(".related-maps-swiper", {
				slidesPerView: 2,
				breakpoints: {
					500: {slidesPerView: 2},
					768: {slidesPerView: 3},
					900: {slidesPerView: 4},
				},
				spaceBetween: 30,
				navigation: {
					nextEl: ".maps-swiper-button-next",
					prevEl: ".maps-swiper-button-prev",
				},
			});
		},
		showByFilter: function(which) {
			console.log('>> showByFilter', which);
			this.filter_by = which;
			// this.current_tag_data = this.tags[this.filter_by];
		},
		showMaps: function(which) {
			console.log('> showMaps', which);
			// if (this.results_visible != which) {
				this.results_visible = which;
			// }
		},
	}

}
</script>
