<template>
	<div class="map-result thumbnail-view">

		<div id="tify" class="map-viewer">Loading map viewer...</div>

			<div v-if="$fetchState.pending">
				<h1>Loading this collection record ...</h1>
			</div>
		
		<div v-else>
			<div class="map-details-container">
				<h1 class="text-3xl">{{ metadataAPIvariables.response.document.title_info_primary_tsi }}
					<span class="subtitle" v-if="metadataAPIvariables.response.document.title_info_primary_subtitle_tsi">:
					{{ metadataAPIvariables.response.document.title_info_primary_subtitle_tsi }}</span>
				</h1>
				<p class="intro" v-html="metadataAPIvariables.response.document.abstract_tsi"></p>
			</div>

			<div class="map-details-container map-details">
				<div class="related-material">
					<h2 class="">
						Metadata</h2>
					<MetadataBlock :metadata="metadataAPIvariables.response.document" />
				</div>
				<div class="meta-info">
					<h2  v-if="metadataAPIvariables.response.document.related_item_isreferencedby_ssm">Collection Information</h2>
					<div v-if="metadataAPIvariables.response.document.related_item_isreferencedby_ssm">
						<a :href="JSON.parse(metadataAPIvariables.response.document.related_item_isreferencedby_ssm[0]).url"
							target="_blank"
							class="button-like primary no-arrow">See this object’s
							record at {{ metadataAPIvariables.response.document.institution_name_ssi }}</a>
					</div>

					<h2 class="">Tags</h2>
					<ul class="tagged-with">
						<li v-for="tag, tag_key in this_map.map_tags" :key="tag_key"><a :href="'/explore/'+tag.order+tag.category+'-'+tag.group_order">{{tag.name}}</a></li>
					</ul>

					<h2 v-if="metadataAPIvariables.response.document.exemplary_image_ssi" class="">Downloads</h2>
					<a v-if="metadataAPIvariables.response.document.exemplary_image_ssi" :href="'https://iiif.digitalcommonwealth.org/iiif/2/'+metadataAPIvariables.response.document.exemplary_image_ssi+'/full/full/0/default.jpg'" class="button-like" :download="this_map.exemplary_image_ssi+'_thumbnail_300.jpg'" target="_blank">Large Image</a>
					<a v-if="metadataAPIvariables.response.document.exemplary_image_ssi" :href="'https://bpldcassets.blob.core.windows.net/derivatives/images/'+metadataAPIvariables.response.document.exemplary_image_ssi+'/image_thumbnail_300.jpg'" class="button-like" :download="this_map.exemplary_image_ssi+'_thumbnail_300.jpg'" target="_blank">Small Image</a>

					<h2 class=""> Digital Library</h2>
					<div>
						<a :href="`https://collections.leventhalmap.org/search/${$nuxt.context.params.solr_id}/manifest.json`"
						target="_blank"
						class="button-like dark">IIIF Manifest</a>
						<a :href="`https://collections.leventhalmap.org/search/${$nuxt.context.params.solr_id}?format=json`"
						target="_blank"
						class="button-like dark">JSON Metadata</a>
					</div>

				</div>
			</div>


			

		</div>


	</div>

</template>

<style>
@import 'tify/dist/tify.css';
@import '../../static/assets/styles/_solr_id.css';
</style>

<script>
import home_data from '~/data/home_data.json'
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
	asyncData ({ route }) {
		let this_map = home_data.maps[route.params.solr_id]
		return {
			this_map,
			solr_id: route.params.solrid,
		}
	},

	async fetch() {
		this.metadataAPIvariables = await fetch(`https://collections.leventhalmap.org/search/${this.$nuxt.context.params.solr_id}.json`)
			.then(d => d.json());
	},

	fetchOnServer: function() { return this.$nuxt.context.app.head.title === 'ARGO - STAGING' ? false : true },

	mounted() {
		// console.log (this.this_map);
		// console.log (this.metadataAPIvariables);
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
