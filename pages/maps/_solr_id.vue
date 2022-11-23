<template>
<div class="map-result thumbnail-view">
	<div v-if="!this_map" class="">
		<h1>All maps</h1>
		<div class="maps-list thumbnail-view">
			<a v-for="map, map_key in maps" :key="map_key" :href="'/maps/'+map_key">
				<div class="result-image" :style="'background-image: url(\'https://bpldcassets.blob.core.windows.net/derivatives/images/'+map.exemplary_image_ssi+'/image_thumbnail_300.jpg\');'"></div>
				<div class="result-text">{{map.title_info_primary_tsi}}</div>
			</a>
		</div>
	</div>
	<!-- <div class="tify-black-bar"><div class="tify-map-title" v-html="this_map.title_info_primary_tsi"></div></div> -->
    <div v-if="this_map" id="tify" class="map-viewer">Loading map viewer...</div>
	<div v-if="this_map" class="map-titles">
        <h1 v-html="this_map.title_info_primary_tsi"></h1>
		<p v-html="this_map.abstract_tsi"></p>
	</div>
    <div v-if="this_map" class="related-material">
        <h2 v-html="this_map.title_info_primary_subtitle_tsi"></h2>
        <!-- <p v-html="this_map.abstract_tsi"></p> -->
		<!--
        <h2>Related Material</h2>
        <div class="digital-talks">
            <h3>Digital Talks</h3>
            <ul>
                <li>Alii autem, quibus ego assentiorum memoriter, tum etiam erga nos causae confidere</li>
                <li>Quae fuerit causa, nollem me tamen laudandis maioribus meis corrupisti</li>
                <li>Filium morte multavit si sine dubio praeclara sunt, fecerint, virtutem</li>
            </ul>
        </div>
        <div class="reference-essays">
            <h3>Essays to Reference</h3>
            <ul>
                <li>Gorquatos nostros quos tu tam inportuno tamque crudeli; sin, ut.</li>
                <li>Hanc ego cum teneam sententiam, quid aut dolores suscipiantur maiorum.</li>
                <li>Omne animal, simul atque corrupti, quos dolores eos, qui dolorem.</li>
            </ul>
        </div>
        <div class="maps">
            <h3>Maps</h3>
            <ul>
                <li>
                    <div class="related-map" style="background-image: url(../assets/images/map_result_map_1.jpg);"></div>
                    <p>A correct plan of the environs of Quebec, and of the battle fought on the 13th September, 1759 : together with a particular detail of the...</p>
                </li>
                <li>
                    <div class="related-map" style="background-image: url(../assets/images/map_result_map_2.jpg);"></div>
                    <p>A map of the several dispositions of the English Fleet & Army on the River St. Laurence to the taking of Quebec</p>
                </li>
                <li>
                    <div class="related-map" style="background-image: url(../assets/images/map_result_map_3.jpg);"></div>
                    <p>The coast of New Schotland, New England, the gulph and river of St. Laurence : the islands of New Foundland, Cape Breton, St....</p>
                </li>
                <li>
                    <div class="related-map" style="background-image: url(../assets/images/map_result_map_4.jpg);"></div>
                    <p>Plan von Quebec</p>
                </li>
            </ul>
        </div>
		-->
		<h2>Meta Information</h2>

		<table class="meta-information">
			<tr v-for="role, role_key in this_map.name_role_tsim" :key="role_key">
				<th>{{role}}</th>
				<td>
					<p>{{this_map.name_tsim[role_key]}}</p>
				</td>
			</tr>
			<tr>
				<th>Date</th>
				<td>
					<p>{{this_map.date_range}}</p>
				</td>
			</tr>
			<tr v-if="this_map.note_resp_tsim">
				<th>Name on Item</th>
				<td>
					<p>{{this_map.note_resp_tsim}}</p>
				</td>
			</tr>
			<tr v-if="this_map.publisher_tsi">
				<th>Publisher</th>
				<td>
					<p>{{this_map.publisher_tsi}}</p>
				</td>
			</tr>
			<tr>
				<th>Scale</th>
				<td>
					<p>{{this_map.scale_tsim}}</p>
				</td>
			</tr>
			<tr>
				<th>Language</th>
				<td>
					<p>{{this_map.lang_term_ssim}}</p>
				</td>
			</tr>
			<!-- <tr>
				<th>Format??</th>
				<td>
					<p>Maps/Atlases??</p>
				</td>
			</tr> -->
			<tr v-if="this_map.identifier_local_other_tsim">
				<th>Identifier</th>
				<td>
					<p>{{this_map.identifier_local_other_tsim.split(',').join(', ')}}</p>
				</td>
			</tr>
			<tr>
				<th>Location</th>
				<td>
					<p>{{this_map.physical_location_ssim}}</p>
				</td>
			</tr>
			<tr>
				<th>Collection (local)</th>
				<td>
					<p>{{this_map.related_item_host_ssim}}</p>
				</td>
			</tr>
			<tr>
				<th>Subjects</th>
				<td>
					<p>{{this_map.subject_topic_tsim}}</p>
				</td>
			</tr>
			<tr>
				<th>Places</th>
				<td><p>
				North and Central America (continent), United States (country), Iowa (state)                </p></td>
			</tr>
			<tr>
				<th>Extent</th>
				<td>
					<p>{{this_map.extent_tsi}}</p>
				</td>
			</tr>
			<tr>
				<th>Terms of Use:</th>
				<td><p>
					{{this_map.rights_ss}}<br />
					{{this_map.license_ss}}
				</p></td>
			</tr>
			<tr v-if="this_map.note_tsim">
				<th>Notes</th>
				<td>
					<p>{{this_map.note_tsim}}</p>
				</td>
			</tr>
		</table>
	</div>

	<div v-if="this_map" class="meta-info">
		<!-- <pre>{{this_map}}</pre> -->
		<h2>Tagged with</h2>
		<ul class="tagged-with">
			<li v-for="tag, tag_key in this_map.map_tags" :key="tag_key">{{tag}}</li>
		</ul>

		<h2>Download</h2>
		<a :href="'https://iiif.digitalcommonwealth.org/iiif/2/'+this_map.exemplary_image_ssi+'/full/full/0/default.jpg'" class="button-like" :download="this_map.exemplary_image_ssi+'_thumbnail_300.jpg'" target="_blank">Large Image</a>
		<a :href="'https://bpldcassets.blob.core.windows.net/derivatives/images/'+this_map.exemplary_image_ssi+'/image_thumbnail_300.jpg'" class="button-like" :download="this_map.exemplary_image_ssi+'_thumbnail_300.jpg'" target="_blank">Small Image</a>
		<!-- <img src="/images/explore_by_1-FPO.png"> -->
		
		<!--		
		<div class="maps">
            <h2>More maps {{this_map.publisher_tsi}}</h2>
            <ul>
                <li>
                    <div class="related-map" style="background-image: url(../assets/images/map_result_map_1.jpg);"></div>
                    <p>A correct plan of the environs of Quebec, and of the battle fought on the 13th September, 1759 : together with a particular detail of the...</p>
                </li>
                <li>
                    <div class="related-map" style="background-image: url(../assets/images/map_result_map_2.jpg);"></div>
                    <p>A map of the several dispositions of the English Fleet & Army on the River St. Laurence to the taking of Quebec</p>
                </li>
                <li>
                    <div class="related-map" style="background-image: url(../assets/images/map_result_map_3.jpg);"></div>
                    <p>The coast of New Schotland, New England, the gulph and river of St. Laurence : the islands of New Foundland, Cape Breton, St....</p>
                </li>
                <li>
                    <div class="related-map" style="background-image: url(../assets/images/map_result_map_4.jpg);"></div>
                    <p>Plan von Quebec</p>
                </li>
            </ul>
        </div>
		-->
	</div>
</div>

</template>

<script>
// import airports from '~/data/airports.js'
import home_data from '~/data/maps_extended.json'
// import 'tify'
// import 'tify/dist/tify.css'

export default {
	name: 'MapsPage',
	head () {
		return {
		title: (this.this_map) ? this.this_map.solr_id+' Details' : 'Maps',
			meta: [{
				hid: 'description',
				name: 'description',
				content: (this.this_map) ? 'Detailed information about '+this.this_map.solr_id : 'Maps description',
			}]
		}
    },
	asyncData ({ route }) {
		// console.log('SLUGg:', route.params.solrid);
		// const airport = people.filter(person => person.slug === route.params.slug)[0]
		var this_map = '';
		var maps = [];
		if (route.params.solr_id) {
			this_map = home_data.maps[route.params.solr_id]
		} else {
			maps = home_data.maps;
		}
		// const current_slug = person.slug;
		// const people_tags = people.people_tags;

		// let person_keys = person.people_tag_ids;
		// for (let i=0;i<person_keys.length; i++) {
		// 	// console.log('>', person_keys[i]);
		// 	people_tags[person_keys[i]].open = true;
		// }

		return {
			maps,
			this_map,
			solr_id: route.params.solrid,
			// people_tags,
			// people: people.people,
		}
	},
	data() {
		return {
			// current_slug: null,
		}
	},
	beforeMount() {
		// this.current_slug = this.person.slug;
		// this.getData();
		// let person_keys = this.person.people_tag_ids;
		// console.log('??', person_keys);
		// for (let i=0;i<person_keys.length; i++) {
		// 	console.log('>', person_keys[i]);
		// 	this.people_tags[person_keys[i]].open = true;
		// }
	},
	mounted(){
		// this.paintMapsSlider();
		if (this.this_map) {
			console.log('this.this_map:');
			new Tify({
				container: '#tify',
				manifestUrl: 'https://collections.leventhalmap.org/search/'+this.this_map.solr_id+'/manifest.json',
				// manifestUrl: 'https://iiif.digitalcommonwealth.org/iiif/3/commonwealth:3f463c23b/info.json',
				viewer: {
					// this area is what's covered by OpenSeadragon: https://openseadragon.github.io/docs/OpenSeadragon.html#.Options
					// zoomPerScroll: 1, // to make it faster or slower
					// each of these are per-device-type
					gestureSettingsMouse:   { scrollToZoom: false,  clickToZoom: true,  dblClickToZoom: true, pinchToZoom: false, flickEnabled: false, dragToPan: true },
					// gestureSettingsTouch:   { scrollToZoom: false, clickToZoom: false, dblClickToZoom: true,  pinchToZoom: true,  flickEnabled: true,  flickMinSpeed: 120, flickMomentum: 0.25, pinchRotate: false, dragToPan: true },
					// gestureSettingsPen:     { scrollToZoom: false, clickToZoom: true,  dblClickToZoom: false, pinchToZoom: false, flickEnabled: false, flickMinSpeed: 120, flickMomentum: 0.25, pinchRotate: false, dragToPan: true },
					// gestureSettingsUnknown: { scrollToZoom: false, clickToZoom: false, dblClickToZoom: true, pinchToZoom: true, flickEnabled: true, flickMinSpeed: 120, flickMomentum: 0.25, pinchRotate: false, dragToPan: true },
				},
				// language: 'en',
				// pageLabelFormat: 'P (L)',
				// pages: [1],
				// pan: { x: .45, y: .6 },
				// translationsDirUrl: '/translations/tify',
				// urlQueryKey: 'tify',
				// urlQueryParams: ['pages'],
				// view: '',
				// viewer: {
				// 	immediateRender: false,
				// },
				// zoom: 1.2,
			})
		}
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
	}

}
</script>
