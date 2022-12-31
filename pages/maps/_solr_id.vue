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
        <h1>{{this_map.title_info_primary_tsi}} <span class="subtitle" v-if="this_map.title_info_primary_subtitle_tsi">: {{this_map.title_info_primary_subtitle_tsi}}</span></h1>
		<p v-html="this_map.abstract_tsi"></p>
	</div>
    <div v-if="this_map" class="related-material">

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

<style>

@import 'tify/dist/tify.css';

/* start map-result page */
.map-result {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	margin-bottom: 200px;
}
.map-result .map-viewer {
	width: 100%;
	height: 580px;
}
.map-result .tify-header {
	display: none;
}
.map-result .tify-black-bar {
	background-color: #B2B2B2;
	width: 100%;
}
.map-result .tify-black-bar .tify-map-title {
	width: 80%;
	padding: 14px;
	margin: auto;
	color: #000000;
	font-size: 20px;
	font-weight: 400;
	text-align: center;
	/* text-transform: uppercase; */
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.map-result .map-titles {
	width: calc(100% - 60px);
	margin: auto;
}
.map-result .map-titles p {
	font-size: 18px;
	font-weight: 400;
	line-height: 22px;
}

h1 {
	font-family: ivypresto-display;
	font-size: 3.0 rem;
	font-weight: 700;
	margin: 15px 0;
}

h1 > .subtitle {
	font-family: ivypresto-display;
	font-style: italic;
	font-size: 2.6 rem;
	color: #979797
}


.map-result .related-material, 
.map-result .meta-info {
	width: calc(50% - 60px);
}
.map-result .meta-info {
	margin-top: 48px;
}
.map-result .meta-info .button-like {
	background-color: #4E798D;
    border: unset;
    color: #FFFFFF;
    border-radius: 5px;
    font-family: 'Inter';
    font-size: 14px;
    padding: 9px 30px 9px 15px;
	position: relative;
}
.map-result .meta-info .button-like::after {
	content: '';
	position: absolute;
	top: 10px;
	right: 10px;
	height: 15px;
	width: 12px;
	background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iOXB4IiBoZWlnaHQ9IjExcHgiIHZpZXdCb3g9IjAgMCA5IDExIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPkdyb3VwIDM1PC90aXRsZT4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+CiAgICAgICAgPGcgaWQ9Ik1hcC1SZXN1bHRzX1Byb3Bvc2VkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzY2LjAwMDAwMCwgLTEwODMuMDAwMDAwKSIgc3Ryb2tlPSIjRkZGRkZGIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTExIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2NzEuMjIxNjgwLCAxMDM1LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAzNS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk5LjA3NjI0NiwgMTguMjM4NDQ1KSBzY2FsZSgtMSwgMSkgcm90YXRlKC0yNzAuMDAwMDAwKSB0cmFuc2xhdGUoLTk5LjA3NjI0NiwgLTE4LjIzODQ0NSkgdHJhbnNsYXRlKDk0LjE3ODE4NSwgMTQuNDg4NDQ1KSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPSIwLjU4Mzc2MDg1NCIgeTE9IjMuNzUiIHgyPSI5LjAxMjU1ODU0IiB5Mj0iMy43NSIgaWQ9IkxpbmUtMTIiPjwvbGluZT4KICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIGlkPSJQYXRoLTE0IiBwb2ludHM9IjYuMDQ2MTIxMzYgMCA5Ljc5NjEyMTM2IDMuNzUgNi4wNDYxMjEzNiA3LjUiPjwvcG9seWxpbmU+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=");
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
}
.map-result .related-material h3 {
	font-size: 15px;
	font-weight: 500;
	position: relative;
	padding-left: 25px;
	margin: 0 0 8px 0;
}
.map-result .related-material h3::before {
	content: '';
    position: absolute;
    left: 0;
    background-size: contain;
    background-repeat: no-repeat;
}
.map-result .related-material .digital-talks h3::before {
	width: 20px;
	height: 15px;
	top: calc(50% - 8px);
	background-image: url('/images/map_result_digital_talks.svg');
}
.map-result .related-material .reference-essays h3::before {
	width: 17px;
	height: 21px;
	top: calc(50% - 10px);
	background-image: url('/images/map_result_reference_essays.svg');
}
.map-result .related-material .maps h3 {
	margin: 0 0 15px 0;
}
.map-result .related-material .maps h3::before {
	width: 20px;
	height: 20px;
	top: calc(50% - 10px);
	background-image: url('/images/map_result_map_icon.svg');
}
.map-result .related-material .digital-talks, 
.map-result .related-material .reference-essays {
	margin-bottom: 25px;
}
.map-result .related-material .digital-talks ul, 
.map-result .related-material .reference-essays ul {
	list-style-type: none;
	margin: 0;
	padding: 0;
	font-size: 14px;
	font-weight: 300;
	line-height: 22px;
}
.map-result .related-material .digital-talks ul li,
.map-result .related-material .reference-essays ul li {
	position: relative;
	padding-left: 25px;
}
.map-result .related-material .digital-talks ul li::before,
.map-result .related-material .reference-essays ul li::before {
	content: '';
    position: absolute;
    left: 0;
    top: 5px;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	border: 1px solid #979797;
}
.map-result .maps ul {
	list-style-type: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.map-result .maps ul li {
	width: calc(50% - 10px);
	/* height: 250px; */
	margin-bottom: 15px;
	background-color: #FFFFFF;
	border: 0.5px solid #4E798D;
	border-radius: 5px;
}
.map-result .maps ul li .related-map {
	width: 100%;
	height: 180px;
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center;
	border-radius: 5px 5px 0 0;
	border-bottom: 0.5px solid #4E798D;
}
.map-result .maps ul li p {
    margin: 0;
    padding: 8px;
    font-size: 12px;
    line-height: 16px;
	border-radius: 0 0 5px 5px;
}
.map-result .meta-info ul.tagged-with {
	list-style-type: none;
	margin: 0 0 25px 0;
	padding: 0;
	display: flex;
	flex-wrap: wrap;
}
.map-result .meta-info ul.tagged-with li {
	font-size: 14px;
    font-weight: 400;
    padding: 5px 12px;
    color: #4E798D;
    background-color: #FFFFFF;
	border: .5px solid #4E798D;
    border-radius: 15px;
    margin-right: 8px;
    margin-bottom: 10px;
}
.map-result .meta-information {
	list-style-type: none;
	margin: 0;
	padding: 0;
	text-align: left;
	table-layout: fixed;
}
.map-result .meta-information tr {
	vertical-align: baseline;
}
.map-result .meta-information th {
	margin-right: 25px;
	font-size: 17px;
	font-weight: 500;
	width: 145px;
}
.map-result .meta-information td {
	margin: 0;
	font-size: 14px;
	font-weight: 300;
}
.map-result .meta-information td p {
	font-size: 16px;
	margin: 0 0 5px 0;
}
/* end map-result page */
</style>

<script>
// import airports from '~/data/airports.js'
import home_data from '~/data/maps_extended.json'


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
			console.log(this.this_map);
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
