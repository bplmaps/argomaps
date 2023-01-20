<template>
	<div class="map-result thumbnail-view">

		<div id="tify" class="map-viewer">Loading map viewer...</div>


		<div v-if="$fetchState.pending">
			<h1>Loading this collection record ...</h1>
		</div>

		
		<div v-else>
			<div class="container">
				<div class="px-8">
					<h1 class="text-3xl">{{ metadataAPIvariables.response.document.title_info_primary_tsi }} <span class="text-italic text-gray-600"
						v-if="metadataAPIvariables.response.document.title_info_primary_subtitle_tsi">:
						{{ metadataAPIvariables.response.document.title_info_primary_subtitle_tsi }}</span></h1>

						<p class="pb-4 text-gray-800" v-html="metadataAPIvariables.response.document.abstract_tsi"></p>
				</div>

			</div>

			<div class="container">
				<div class="block md:flex md:flex-row px-8">
					<div class="w-full md:w-1/2">
						<div class="pr-4">
							<h2
								class="text-lg uppercase tracking-wider font-bold bg-gray-600 text-white inline-block px-2 py-1 mb-4">
								Metadata</h2>
							<MetadataBlock :metadata="metadataAPIvariables.response.document" />
						</div>
					</div>
					<div class="w-full md:w-1/2">
						<div class="mb-6">
							<h2
								class="text-lg uppercase tracking-wider font-bold bg-gray-600 text-white inline-block px-2 py-1 mb-4">
								Collection Information</h2>
							<div v-if="metadataAPIvariables.response.document.related_item_isreferencedby_ssm">
								<a :href="JSON.parse(metadataAPIvariables.response.document.related_item_isreferencedby_ssm[0]).url"
									target="_blank"
									class="border border-blue-500 hover:bg-blue-50 px-2 py-1 rounded">See this object’s
									record at {{ metadataAPIvariables.response.document.institution_name_ssi }}</a>
							</div>
						</div>


						<div class="mb-6">
							<h2
								class="text-lg uppercase tracking-wider font-bold bg-gray-600 text-white inline-block px-2 py-1 mb-4">
								Tags</h2>
						</div>

						<div class="mb-6">
							<h2
								class="text-lg uppercase tracking-wider font-bold bg-gray-600 text-white inline-block px-2 py-1 mb-4">
								Downloads</h2>
						</div>

						<div class="mb-6">
							<h2
								class="text-lg uppercase tracking-wider font-bold bg-gray-600 text-white inline-block px-2 py-1 mb-4">
								Digital Library</h2>
								<div>
									<a :href="`https://collections.leventhalmap.org/search/${$nuxt.context.params.solr_id}/manifest.json`"
									target="_blank"
									class="border border-blue-500 hover:bg-blue-50 px-2 py-1 rounded">IIIF Manifest</a>
									<a :href="`https://collections.leventhalmap.org/search/${$nuxt.context.params.solr_id}?format=json`"
									target="_blank"
									class="border border-blue-500 hover:bg-blue-50 px-2 py-1 rounded">JSON Metadata</a>
								</div>

						</div>


					</div>

				</div>
			</div>


			

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
	font-size: 3.25rem;
	font-weight: 700;
	margin: 15px 0;
}

h1>.subtitle {
	font-family: ivypresto-display;
	font-style: italic;
	font-size: 2.6rem;
	color: #979797
}


.map-result .related-material,
.map-result .meta-info {
	width: calc(50% - 60px);
	margin: auto;
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

import MetadataBlock from '~/components/MetadataBlock.vue';

export default {
	name: 'MapsPage',
	head() {
		return {
			title: "Collection Record",
			meta: [{
				hid: 'description',
				name: 'description',
				content: 'Detailed information about Maps description'
			}]
		}
	},
	components: {
		MetadataBlock
	},
	data() {
		return {
			fetchError: false,
			metadataAPIvariables: {}
		}
	},

	async fetch() {
		this.metadataAPIvariables = await fetch(`https://collections.leventhalmap.org/search/${this.$nuxt.context.params.solr_id}.json`)
			.then(d => d.json());
	},

	// fetchOnServer: function() { return this.$nuxt.context.app.head.title === 'ARGO - STAGING' ? false : true },

	mounted() {
		new Tify({
			container: '#tify',
			manifestUrl: 'https://collections.leventhalmap.org/search/' + this.$nuxt.context.params.solr_id + '/manifest.json',
			viewer: {
				// this area is what's covered by OpenSeadragon: https://openseadragon.github.io/docs/OpenSeadragon.html#.Options
				// zoomPerScroll: 1, // to make it faster or slower
				// each of these are per-device-type
				gestureSettingsMouse: { scrollToZoom: false, clickToZoom: true, dblClickToZoom: true, pinchToZoom: false, flickEnabled: false, dragToPan: true },
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
	},
	methods: {
		paintMapsSlider: function () {
			// console.log('> paintMapsSlider');
			var maps_swiper = new Swiper(".related-maps-swiper", {
				slidesPerView: 2,
				breakpoints: {
					500: { slidesPerView: 2 },
					768: { slidesPerView: 3 },
					900: { slidesPerView: 4 },
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
