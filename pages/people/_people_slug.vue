<template>

	<div>
		<div class="filter" v-if="!person">
			<div class="filter-explore-by">
				<h1>Explore maps by people</h1>
				<ul>
					<li v-for="people_tag, people_tag_index in people_tags" :key="people_tag_index" @click="showByFilter(people_tag_index)" :class="(people_tag_index==people_filter_by) ? 'active' : ''">{{people_tag.name}}</li>
				</ul>
				<div class="filter-view-switch">
					<label for="filter_view_switch">View: </label>
					<select v-model="people_filter_view" id="filter_view_switch">
						<option value="gallery">Gallery</option>
						<option value="list">List</option>
					</select>
				</div>
			</div>
			<h2>Mapmakers</h2>
			<ul :class="'filter-list '+people_filter_view+'-view'">
				<template v-for="person, person_index in people">
					<li v-if="person.people_tag_ids && person.people_tag_ids.includes(parseInt(people_filter_by))" :key="person_index" class="filter-result" data-id="person.people_tags.hasOwnProperty(1)">
						<div class="result-image" :style="(person.image) ? 'background-image: url(\''+person.image+'\');' : ''">
							<ul class="result-tags">
								<template v-for="people_tag_id, people_tag_index in person.people_tag_ids">
								<li v-if="people_tags[people_tag_id]" :key="people_tag_index">{{people_tags[people_tag_id].name}}</li>
								</template>
							</ul>
						</div>
						<div class="title-tags">
							<h3>{{person.name}}</h3>
						</div>
						<div class="text">
							<p>{{person.short_description}}</p>
							<a href="#" @click="drawer.showMaps(people_arr['solr_ids'])" class="button-like dark">See {{person.count}} map{{(person.count==1) ? '' : 's'}}</a>
							<a :href="'/people/'+person.slug" class="button-like light">Learn more</a>
						</div>
					</li>
				</template>
			</ul>
		</div>
		<div v-if="person" class="filter-item-header-image" :style="'background-image: url(\''+person.header_image+'\')'"></div>
		<div v-if="person" class="filter-item">
			<div class="side-nav">
				<details v-for="tag_arr, tag_id in people_tags" :key="tag_id" class="tag-genre" :open="(tag_arr.open) ? true : null">
					<summary><div class="open-close-icon"></div>{{tag_arr.name}}</summary>
					<ul class="tag-results">
						<template v-for="person_tag, person_key in people">
							<li v-if="person_tag.people_tag_ids && person_tag.people_tag_ids.includes(parseInt(tag_id))" :key="person_key" :class="(current_slug==person_tag.slug) ? 'active' : ''"><a :href="'/people/'+person_tag.slug">{{person_tag.name}}</a></li>
						</template>
					</ul>
				</details>
			</div>
			<div class="item-content">
				<h1>{{ person.name }}</h1>
				<ul class="filters-applied">
					<li>Mapmaker</li>
					<li>Artist</li>
					<li>Engraver</li>
				</ul>
				<article>
					<p v-if="person.subhead_text"><strong>{{ person.subhead_text }}</strong></p>
					<div v-html="person.description"></div>
				</article>
				<aside>
					<h2>Related maps</h2>
					<div class="swiper related-maps-swiper">
						<div class="swiper-wrapper align-bottom" style="max-width: 100px;">
							<div class="swiper-slide" v-for="map, map_key in person.maps" :key="map_key">
								<div class="related-map" :style="'background-image: url(\'https://bpldcassets.blob.core.windows.net/derivatives/images/'+map.exemplary_image_ssi+'/image_thumbnail_300.jpg\');'"></div>
								<p>{{map.title_info_primary_tsi}}</p>
							</div>
						</div>
						<div class="maps-swiper-button-next swiper-button-next"></div>
						<div class="maps-swiper-button-prev swiper-button-prev"></div>
					</div>

				</aside>
				<template v-if="person.notes">
				<h2>Notes</h2>
				<div v-html="person.notes"></div>
				</template>
				<template v-if="person.notes">
				<h2>Bibliography</h2>
				<div v-html="person.bibliography"></div>
				</template>
			</div>
		</div>
	</div>

</template>

<script>
import people from '~/data/people.json'

export default {
	name: 'AirportDetailPage',
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

		var people_tags = people.people_tags;
		if (route.params.people_slug) {
			person = people.people[route.params.people_slug];
			current_slug = person.slug;

			let person_keys = person.people_tag_ids;
			for (let i=0;i<person_keys.length; i++) {
				// console.log('>', person_keys[i]);
				people_tags[person_keys[i]].open = true;
			}
		}


		return {
			person,
			current_slug,
			people_tags,
			people: people.people,
		}

	},
	data() {
		return {
			people_filter_by: 1,
			people_filter_view: 'gallery',
			// current_slug: null,
		}
	},
	beforeMount() {
		// this.current_slug = this.person.slug;
		// this.getData();
		if (this.person) {
			let person_keys = this.person.people_tag_ids;
			console.log('??', person_keys);
			for (let i=0;i<person_keys.length; i++) {
				console.log('>', person_keys[i]);
				this.people_tags[person_keys[i]].open = true;
			}
		}
	},
	mounted(){
		this.paintMapsSlider();
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
			this.people_filter_by = which;
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
