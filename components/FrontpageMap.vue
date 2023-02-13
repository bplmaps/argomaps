<template>
	<div>
		<div id="map-header">
			<p>Map areas:</p>
			<div class="explore-by-checkboxes">
				<label :class="['explore-map-check','xl-map',{ 'label-checked': true },]">
					<input name="map-sizes[]" v-model="map_form.sizes" value="XL" @change="changeLayers()" type="checkbox" />
					<span class="checkmark"></span>Very large (country)<svg width="20px" height="20px">
					<use href="#map-dot"></use></svg>
				</label>
				<label :class="['explore-map-check','l-map',{ 'label-checked': true },]">
					<input name="map-sizes[]" v-model="map_form.sizes" value="L" @change="changeLayers()" type="checkbox" />
					<span class="checkmark"></span>Large (region)<svg width="20px" height="20px">
					<use href="#map-dot"></use></svg>
				</label>
				<label :class="['explore-map-check','m-map',{ 'label-checked': true },]">
					<input name="map-sizes[]" v-model="map_form.sizes" value="M" @change="changeLayers()" type="checkbox" />
					<span class="checkmark"></span>Medium (colony)<svg width="20px" height="20px">
					<use href="#map-dot"></use></svg>
				</label>
				<label :class="['explore-map-check','s-map',{ 'label-checked': true },]">
					<input name="map-sizes[]" v-model="map_form.sizes" value="S" @change="changeLayers()" type="checkbox" />
					<span class="checkmark"></span>Small (city)<svg width="20px" height="20px">
					<use href="#map-dot"></use></svg></label>
				<label :class="['explore-map-check', { 'label-checked': true }]">
					<input name="map-sizes[]" v-model="map_form.sizes" value="A" @change="changeLayers()" type="checkbox" />
					<span class="checkmark"></span>Include maps without sizes<svg width="20px" height="20px">
					<use href="#map-dot"></use></svg>
				</label>
			</div>
		</div>
		<div id="map-holder" :class="[{ selecting: map_selecting_location },{ geolocating: map_geolocating_location },]">
			<div id="map-column-holder">
				<div id="map-tools">
					<form method="post" @submit.prevent="fetchLocationDataByAddress">
						<div id="map-tools-address-holder">
							<label id="map-tools-address-label" for="map-tools-address-input">
								Input city, region or state to drop a pin to find maps nearby.<i></i>
							</label>
							<input id="map-tools-address-input" v-on:focus="map_form_input_pulldown_toggle = true" v-on:keyup="fetchLocationDataByAddress" v-model="map_form.address" placeholder="Input city, state, etc and press enter" />
							<div id="map-tools-address-pulldown" v-if="map_form_input_pulldown_toggle">
							<div @click="chooseMapPlace(pulldown_index)" v-for="(pulldown_arr, pulldown_index) in map_form_input_pulldown_arr" :key="pulldown_index">
								{{ pulldown_arr.display_name }}
							</div>
							</div>
						</div>
						<input type="submit" value="Go" />
					</form>
					<a class="tooltip" @click="chooseLocationFromBrowser()" id="map-tools-choose-from-browser">
						<img src="/images/icon-geolocate.svg" alt="Choose by location" />
						<div class="top">
							Request current location from browser<i></i>
						</div>
					</a>
					<a class="tooltip" @click="chooseLocationInMap()" id="map-tools-choose-in-map">
						<img src="/images/icon-map_pin.svg" alt="Drop a pin" />
						<div class="top">
							Enable to click on map to choose a location<i></i>
						</div>
					</a>
				</div>

				<div id="map-key" class="hidden">
					<label id="map-reach-label" class="disabled">
					<input disabled type="range" name="map_overlay_reach" v-model="map_form.map_overlay_reach" min="10" max="500" step="10" @change="changeLayers()" @input="updateCircle()" />
						{{ map_form.map_overlay_reach }} miles from dropped pin
					</label>
					<button class="button-like primary" v-if="map_filter_results" @click="openDrawer(map_filter_results)">
						Show Maps ({{ map_filter_results.length }})
					</button>
					<a @click="zoomToLocationArea();return false;" class="button-like primary">Zoom</a>
					<a @click="clearLocation();return false;" class="button-like secondary">Clear Pin</a>
				</div>
			</div>
			<div id="map" class="map">
				<div id="popup" class="arrow_box">
					<div id="popup_content" v-html="map_popup_content"></div>
					<a href="#" id="popup_close">✖</a>
				</div>
				<div id="selected-location-icon" class="">
					<div v-if="map_filter_results">{{ map_filter_results.length }}</div>
				</div>
			</div>
		</div>

    	<!-- <Drawer :drawer_results_visible="drawer_results_visible" :maps="maps" /> -->

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
// import home_data from "~/data/home_data.json";
import api_keys from "~/data/api_keys.json";
// import Drawer from "~/components/drawer.vue";

export default {
	props: {
		title: String,
		maps: Object,
	},
	components: {
		// Drawer,
	},
	asyncData({ route }) {
		return {
			// maps: home_data.maps,
		};
	},
	data () {
		return {
			// map
			map_filter_results: [],
			drawer_results_visible: [],
			// maps: {},
			map: null,
			map_selected_shape: null,
			map_pin: null,
			map_circle: null,
			map_search_shape: null,
			map_selecting_location: false,
			map_geolocating_location: false,
			map_pin_location: null,
			map_popup_content: null,
			mi_to_m_factor: 1609.34,
			// map form
			map_form: {
				map_overlay_reach: 80,
				sizes: [],
			},
			map_form_input_pulldown_toggle: false,
			map_form_input_pulldown_arr: [],
		}
	},
	beforeMount() {
		this.map_form.sizes = ["L", "XL", "M", "S", "A"];
		this.is_mobile = window.innerWidth <= 768;
		// this.map_form.map_overlay_reach = 150;
		this.getData();
	},
	mounted() {
		// const map = new Vue.ol.Map({
		// 	layers: [
		// 		new Vue.ol.TileLayer({
		// 			source: new Vue.ol.TileJSON({
		// 				url: `https://api.maptiler.com/maps/voyager-v2/tiles.json?key=${api_keys.maptiler}`,
		// 				crossOrigin: 'anonymous',
		// 			}),
		// 		}),
		// 	],
		// 	target: 'map-holder',
		// 	view: new Vue.ol.View({
		// 		center: [0, 0],
		// 		zoom: 2,
		// 	}),
		// });
	},
	methods: {
		openDrawer(which_maps) {
			// emit open_drawer in footer
			this.$root.$emit('open_drawer', this.maps, which_maps) //like this
		},
		getData: function (which_address) {
			this.$nextTick(() => {
				//TODO: maybe change how exactly the ready works: v-show or :class instead of v-if?
				this.ready = true; // prevent painting before data is available
				this.$nextTick(() => {
					// this.setupSlider(); //once ready
					this.setupMap(); //once ready
				});
			});
		},
		fetchLocationDataByAddress: function () {
			console.log("> fetchLocationDataByAddress", this.map_form.address);
			// get address value
			let form_input = this.map_form.address;
			// if we have an input to work
			if (form_input.trim().length > 3) {
				// get locations data and put them into pulldown
				fetch(
				"https://nominatim.openstreetmap.org/search.php?q=" +
					encodeURIComponent(form_input.trim()) +
					"&format=jsonv2&&viewbox=-107.5,7.0,-42.5,69.5&polygon_geojson=1"
				)
				.then((res) => res.json()) //fix me please and put back into javascript.json
				.then((response) => {
					console.log("R", response);
					this.map_form_input_pulldown_toggle = true;
					this.map_form_input_pulldown_arr = [];
					for (var i = 0; i < response.length; i++) {
					this.map_form_input_pulldown_arr.push({
						display_name: response[i].display_name,
						coordinates: response[i].geojson.coordinates[0],
						lat: response[i].lat,
						lon: response[i].lon,
						lon1: response[i].boundingbox[0],
						lon2: response[i].boundingbox[1],
						lat1: response[i].boundingbox[2],
						lat2: response[i].boundingbox[3],
					});
					}
				})
				.catch(function (err) {
					console.log("Fetch Error :-S", err);
				});
			}
		},
		chooseMapPlace: function (pulldown_index) {
			console.log(
				"> chooseMapPlace",
				this.map_form_input_pulldown_arr[pulldown_index]
			);
			// hide locations pulldown
			this.map_form_input_pulldown_toggle = false;
			// find map
			let this_map = this.map_form_input_pulldown_arr[pulldown_index];
			// paint coordinates?

			// remove any previous searched location shape
			if (this.map_search_shape) this.map.removeLayer(this.map_search_shape);
			if (this.map_circle) this.map.removeLayer(this.map_circle);

			// paint geojson if there's a shape
			// console.log('MMM', this.map_form_input_pulldown_arr[pulldown_index].coordinates);
			if (
				typeof this.map_form_input_pulldown_arr[pulldown_index].coordinates ==
				"object"
			) {
				let mapshape = new ol.Feature({
				geometry: new ol.geom.Polygon([
					this.map_form_input_pulldown_arr[pulldown_index].coordinates,
				]).transform("EPSG:4326", "EPSG:3857"),
				});
				mapshape.map_title = "Map Location";
				mapshape.setStyle(
				new ol.style.Style({
					stroke: new ol.style.Stroke({ color: "#000", width: 1 }), //no outline until we get it filtering
					fill: new ol.style.Fill({ color: "#bacaba33" }),
				})
				);
				let vector_source = new ol.source.Vector({ features: [mapshape] });
				this.map_pin = new ol.layer.Vector({
				source: vector_source,
				type: "current_searched_location_shape",
				});
				this.map_pin.setZIndex(0);
				this.map_search_shape = this.map_pin;
				this.map_pin = this.map.addLayer(this.map_pin); //returns boolean or something I think....
				if (this.map_search_shape == "current_searched_location_shape") {
				console.log("pin is of geojson type");
				}
			}

			// drop pin at location
			this.dropPin(this_map.lon, this_map.lat);
			// zoom into extent
			this.map
				.getView()
				.fit(
				ol.proj.transformExtent(
					[this_map.lat1, this_map.lon1, this_map.lat2, this_map.lon2],
					"EPSG:4326",
					this.map.getView().getProjection()
				),
				{ size: this.map.getSize(), duration: 1000 }
			);
			this.changeLayers(); //run the filtering
		},

		setupMap: function () {
			console.log("> setupMap");
			const start = performance.now();

			const rasterLayer = new Vue.ol.TileLayer({
				source: new Vue.ol.TileJSON({
					url: `https://api.maptiler.com/maps/voyager-v2/tiles.json?key=${api_keys.maptiler}`,
					tileSize: 512,
					crossOrigin: 'anonymous'
				})
			});

			this.map = new Vue.ol.Map({
				layers: [rasterLayer],
				target: document.getElementById("map"),
				interactions: Vue.ol.olInteractions.defaults({
					mouseWheelZoom: false,
				}),
				view: new Vue.ol.View({
					center: Vue.ol.olProj.fromLonLat([-89, 39]),
					zoom: 5,
				}),
			});
			var mapPtIcon = new Vue.ol.olStyle.Icon({
				color: "#AACC00",
				// anchor: [0.5, 46],
				// anchorXUnits: 'fraction',
				// anchorYUnits: 'pixels',
				// src: '/images/map-address-dot.png',
				// scale: area_scale, // .2
				src: "/images/unknown_map_dot.svg",
				scale: 1, // 1
			});
			var mapPointStyle = new Vue.ol.olStyle.Style({
				image: new Vue.ol.olStyle.Icon({
					color: "#AACCEE",
					// anchor: [0.5, 46],
					// anchorXUnits: 'fraction',
					// anchorYUnits: 'pixels',
					// src: '/images/map-address-dot.png',
					// scale: .2,
					src: "/images/unknown_map_dot.svg",
					scale: 1,
				}),
			});

			var mapShapeStyle = new Vue.ol.olStyle.Style({
				stroke: new Vue.ol.olStyle.Stroke({ color: "#000", width: 1 }),
				fill: new Vue.ol.olStyle.Fill({ color: "#bacaba66" }),
			});

			// add shapes first so they're below
			console.log('MAPS:', this.maps);
			Object.keys(this.maps).forEach((this_map) => {
				if (this.maps[this_map].subject_bbox_geospatial) {
					// add a bbox
					let map_coordinates_arr =
						this.maps[this_map].subject_bbox_geospatial.split(", ");
					let map_coordinates_polygon = [
						[map_coordinates_arr[0], map_coordinates_arr[2]],
						[map_coordinates_arr[0], map_coordinates_arr[3]],
						[map_coordinates_arr[1], map_coordinates_arr[3]],
						[map_coordinates_arr[1], map_coordinates_arr[2]],
					];
					let map_point_arr = [
						(parseFloat(map_coordinates_arr[2]) +
						parseFloat(map_coordinates_arr[3])) /
						2,
						(parseFloat(map_coordinates_arr[0]) +
						parseFloat(map_coordinates_arr[1])) /
						2,
					];
					// console.log('point--->', map_coordinates_arr, map_point_arr);

					// figure out the area / size
					let area = Math.abs(
						(map_coordinates_arr[1] - map_coordinates_arr[0]) *
						(map_coordinates_arr[3] - map_coordinates_arr[2])
					);
					let area_scale = 0.5;
					if (area >= 1 && area < 10) area_scale = 0.7;
					if (area >= 10 && area < 100) area_scale = 0.85;
					if (area >= 100) area_scale = 1;

					//setup the map area
					let mapshape = new Vue.ol.Feature({
						geometry: new Vue.ol.olGeom.Polygon([map_coordinates_polygon]),
					});
					mapshape.getGeometry().transform("EPSG:4326", "EPSG:3857");
					mapshape.map_type = "area_map_shape";
					mapshape.map_solr_id = this.maps[this_map].solr_id;
					mapshape.map_image = this.maps[this_map].exemplary_image_ssi;
					mapshape.map_title = this.maps[this_map].title_info_primary_tsi;
					mapshape.map_date_range = this.maps[this_map].date_range;
					mapshape.map_institution_name =
						this.maps[this_map].institution_name_ssi;
					mapshape.setStyle(mapShapeStyle);
					let map_vector_source = new Vue.ol.olSource.Vector({
						features: [mapshape],
					});
					let map_vector_layers = new Vue.ol.olLayer.Vector({
						source: map_vector_source,
						visible: false, //(3 < area && area < 7),
						map_type: "area_map_shape",
						map_solr_id: this.maps[this_map].solr_id,
						name: "area_map_shape:" + this.maps[this_map].solr_id,
						// size_area: area,
						// size_lon: Math.abs(map_coordinates_arr[1] - map_coordinates_arr[0]),
						// size_lat: Math.abs(map_coordinates_arr[3] - map_coordinates_arr[2]),
					});
					this.map.addLayer(map_vector_layers);
					// console.log('rectangle extent', mapshape.getGeometry().getExtent());

					//setup the map pin
					let mappoint = new Vue.ol.Feature({
						geometry: new Vue.ol.olGeom.Point(
							Vue.ol.olProj.fromLonLat([map_point_arr[1], map_point_arr[0]])
						),
					});
					mappoint.map_type = "area_map_point";
					mappoint.map_solr_id = this.maps[this_map].solr_id;
					mappoint.map_image = this.maps[this_map].exemplary_image_ssi;
					mappoint.map_title = this.maps[this_map].title_info_primary_tsi;
					mappoint.map_date_range = this.maps[this_map].date_range;
					mappoint.map_institution_name =
						this.maps[this_map].institution_name_ssi;
					mappoint.has_extent = true;

					//TODO: unclear if cloning instead is an optimization or not so far
					let clone = mapPtIcon.clone();
					clone.setScale(area_scale);
					mappoint.setStyle(
						new Vue.ol.olStyle.Style({
							image: clone,
						})
					);
					// mappoint.set('name', 'gjkgljkgjkl');
					let pin_vector_source = new Vue.ol.olSource.Vector({
						features: [mappoint],
					});
					let pin_vector_layers = new Vue.ol.olLayer.Vector({
						source: pin_vector_source,
						// visible: (3 < area && area < 7),
						size_area: area,
						map_type: "area_map_point",
						map_solr_id: this.maps[this_map].solr_id,
						name: "area_map_point:" + this.maps[this_map].solr_id,
						// size_lon: Math.abs(map_coordinates_arr[1] - map_coordinates_arr[0]),
						// size_lat: Math.abs(map_coordinates_arr[3] - map_coordinates_arr[2]),
					});
					pin_vector_layers.setZIndex(1);
					this.map.addLayer(pin_vector_layers);
				} else if (!this.maps[this_map].subject_bbox_geospatial && this.maps[this_map].subject_point_geospatial) {
					// add points when there's not a bbox
					let map_point_arr =
						this.maps[this_map].subject_point_geospatial.split(",");
					// console.log('point--->', map_point_arr);
					let mappoint = new Vue.ol.Feature({
						geometry: new Vue.ol.olGeom.Point(
							Vue.ol.olProj.fromLonLat([map_point_arr[1], map_point_arr[0]])
						),
					});
					mappoint.map_type = "point_map";
					mappoint.map_solr_id = this.maps[this_map].solr_id;
					mappoint.map_image = this.maps[this_map].exemplary_image_ssi;
					mappoint.map_title = this.maps[this_map].title_info_primary_tsi;
					mappoint.map_date_range = this.maps[this_map].date_range;
					mappoint.map_institution_name =
						this.maps[this_map].institution_name_ssi;
					mappoint.setStyle(mapPointStyle);
					let vector_source = new Vue.ol.olSource.Vector({
						features: [mappoint],
					});
					let map_vector_layers = new Vue.ol.olLayer.Vector({
						source: vector_source,
						map_type: "point_map",
						map_solr_id: this.maps[this_map].solr_id,
						name: "point_map:" + this.maps[this_map].solr_id,
					});
					map_vector_layers.setZIndex(1);
					this.map.addLayer(map_vector_layers);
				}
			});
			const end = performance.now();
			let exeTimes = end - start;
			console.log("map setup", exeTimes);

			// inefficient painful way to change cursor to pointer on hover
			this.map.on("pointermove", function (evt) {
				if (this.map_selecting_location) {
				var hit = this.forEachFeatureAtPixel(
					evt.pixel,
					function (feature, layer) {
					return true;
					}
				);
				} else var hit = false;
				if (hit) {
				this.getTargetElement().style.cursor = "pointer";
				} else {
				this.getTargetElement().style.cursor = "";
				}
			});

			// on click functions
			this.map.on("click", (evt) => {
				console.log("map clicky", evt, evt.target);
				// clear any map pulldown
				this.map_form_input_pulldown_toggle = false;

				// are we in select a location drop pin mode?
				if (this.map_selecting_location) {
					//we want to remove the current location if there is one.
					if (this.map_pin || this.map_circle || this.map_search_shape)
						this.clearLocation();

					// currently selecting a location, so drop a pin here
					let clicked_coordinate = Vue.ol.olProj.transform(
						evt.coordinate,
						"EPSG:3857",
						"EPSG:4326"
					);
					this.dropPin(clicked_coordinate[0], clicked_coordinate[1]);
					this.map_selecting_location = false;
					// document.querySelector("#map-holder").classList.remove("selecting");
					this.changeLayers(); //make it run again to update the filtering (TODO: separate filtering into a new function for a bit of perf gain)
					return;
				}

				// find the place we clicked on and see if it's a feature
				var features = [];
				this.map.forEachFeatureAtPixel(evt.pixel, (feature) => {
					if (feature.name != "current_requested_circle") {
						//ignore the circle for clicky
						// console.log('pushing', feature, feature.name );
						features.push(feature);
					}
				});

				var feature = features[0]; //get the topmost clicky //this.map.forEachFeatureAtPixel(evt.pixel,function(feature) {return feature;});// some magic just to get what was clicked on
				if (feature) {
					console.log("feature found!", feature);
					this.mapPopup.setPosition(undefined); // reset popup position

					//if we clicked on a map pin, we want to show the area_map_shape if it has one
					let assocLayers = this.layersByID[feature.map_solr_id];
					// console.log('assoc layers found', feature.map_solr_id);
					let targetLayer = null;
					for (let i = 0; i < assocLayers.length; i++) {
						if (
						assocLayers[i].get("map_solr_id") == feature.map_solr_id &&
						assocLayers[i].get("map_type") == "area_map_shape"
						) {
						targetLayer = assocLayers[i];
						break;
						}
					}
					if (targetLayer) {
						console.log(
						"show the map rectangle",
						targetLayer,
						feature.map_solr_id
						);
						targetLayer.setVisible(true);
						this.map_selected_shape = feature.map_solr_id;
					}

					// popup.setPosition(evt.coordinate); where the mouse clicked

					//get the coordinates of the shape we clicked on
					let clickedItemPosition = feature.getGeometry().getCoordinates();

					if (!clickedItemPosition) {
						console.log(
						"clicked on some other non-map it seems",
						feature.get("name"),
						clickedItemPosition,
						feature.getGeometry(),
						feature.getGeometry().getCoordinates()
						);
						return;
					}
					// console.log('clickedItemPosition:', clickedItemPosition, feature.getGeometry().getExtent());
					if (typeof clickedItemPosition[0] == "number") {
						console.log("position is a coord (probably?)");
						this.mapPopup.setPosition(clickedItemPosition); // center of where the mouse clicked on
					} else if (typeof clickedItemPosition[0] == "object") {
						console.log("gee im a tree", feature.getGeometry().getExtent());
						avgx =
						feature.getGeometry().getExtent()[2] -
						(feature.getGeometry().getExtent()[2] -
							feature.getGeometry().getExtent()[0]) /
							2;
						avgy =
						feature.getGeometry().getExtent()[3] -
						(feature.getGeometry().getExtent()[3] -
							feature.getGeometry().getExtent()[1]) /
							2;
						// console.log('avgs', avgx, avgy);
						this.mapPopup.setPosition([avgx, avgy]); // center of where the mouse clicked on
						// popup.setPosition(feature.getGeometry().getExtent());// center of where the mouse clicked on
					}
					// console.log(feature.name);
					// create popup box
					let newhtml = `
								<img src="https://bpldcassets.blob.core.windows.net/derivatives/images/${feature.map_image}/image_thumbnail_300.jpg">
								<div><p><b>${feature.map_title}</b></p>
									<p><em>Map date: ${feature.map_date_range}</em></p><p>Institution: ${feature.map_institution_name}</p>`;
					if (feature.map_type == "area_map_point")
						newhtml += `<button type="button" id="popup_zoom" class="button-like" >Zoom to Map</button>&nbsp;`;
					newhtml += `<a id="popup_link" class="button-like" href="/maps/${feature.map_solr_id}">View Map</a>
								</div>`;

					this.map_popup_content = newhtml;
					let popup_close_ele = document.getElementById("popup_close");
					popup_close_ele.onclick = () => {
						this.mapPopup.setPosition(undefined);
						popup_close_ele.blur();
						this.hideAnySelectedShapes();
						return false;
					};
					this.$nextTick(() => {
						let popup_zoom_ele = document.getElementById("popup_zoom");
						if (popup_zoom_ele) {
						popup_zoom_ele.onclick = () => {
							// console.log('zoomToExtent:', feature.map_solr_id);
							// create box to zoom into
							let map_coordinates_arr =
							this.maps[feature.map_solr_id].subject_bbox_geospatial.split(", ");
							let extent = Vue.ol.olExtent.applyTransform([
									map_coordinates_arr[1],
									map_coordinates_arr[3],
									map_coordinates_arr[0],
									map_coordinates_arr[2],
								],
								Vue.ol.olProj.getTransform("EPSG:4326", "EPSG:3857")
							);
							// zoom in, with animation and padding
							this.map.getView().fit(extent, {
								duration: 1000,
								size: this.map.getSize(),
								padding: [50, 50, 50, 300],
							});
							return false;
						};
						}
					});
				} else {
					// let's collect x/y coordinates
					console.log(
						"no feature detected at: ",
						Vue.ol.olProj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326")
					);
				}
			});

			// define and add the on-click overlay
			const element = document.getElementById("popup");
			const popup = new Vue.ol.Overlay({
				element: element,
				positioning: "bottom-center",
				stopEvent: true,
			});
			// popup.on('click', (evt) => {
			// 	console.log('POPup clicked', evt);
			// })
			this.mapPopup = popup;
			this.map.addOverlay(this.mapPopup);

			// define and add the changing map icon
			const iconEle = document.getElementById("selected-location-icon");
			iconEle.addEventListener("click", (evt) => {
				console.log("htmlIcon clicked", evt);
				this.drawer_results_visible = this.map_filter_results;
			});
			const htmlIcon = new Vue.ol.Overlay({
				element: iconEle,
				positioning: "center-center",
				stopEvent: true,
			});

			// htmlIcon.on('change', (evt) => {
			// 	console.log('htmlIcon changed', evt);
			// });
			this.map.addOverlay(htmlIcon);
			this.map_html_icon = htmlIcon;
			// if (this.map_address_lookup_results && this.map_address_lookup_results.extent) {
			// 	console.log('LL', this.map_address_lookup_results);
			// 	// we have lookup results, let's zoom into that
			// 	// this.map_address_lookup_results
			// 	let extent = this.map_address_lookup_results.extent.split(', ');
			// 	// this.map.getView().fit(ol.proj.transformExtent([extent[0], extent[1], extent[2], extent[3]], 'EPSG:4326', map.getView().getProjection()), { size: map.getSize() });
			// }
			// this.map = map;

			//setup the map_solr_id hash object
			var allLayers = this.map.getLayers().getArray();
			var layersbyID = {};
			for (let i = 0; i < allLayers.length; i++) {
				let layerId = allLayers[i].get("map_solr_id");
				if (layerId) {
				if (typeof layersbyID[layerId] == "undefined")
					layersbyID[layerId] = [];
				layersbyID[layerId].push(allLayers[i]);
				}
			}
			this.layersByID = layersbyID;

			// make map normalized to inputs
			this.changeLayers();
			},
			hideAnySelectedShapes: function () {
			// if there's a currently selected shape, hide it
			// console.log('SHAPE?', this.map_selected_shape);
			if (this.map_selected_shape) {
				let assocLayers = this.layersByID[this.map_selected_shape];
				let targetLayer = null;
				for (let i = 0; i < assocLayers.length; i++) {
				if (
					assocLayers[i].get("map_solr_id") == this.map_selected_shape &&
					assocLayers[i].get("map_type") == "area_map_shape"
				) {
					targetLayer = assocLayers[i];
					break;
				}
				}
				if (targetLayer) {
				console.log(
					"hide the map rectangle",
					targetLayer,
					this.map_selected_shape
				);
				targetLayer.setVisible(false);
				this.map_selected_shape = "";
				}
			}
			},
			// zoomToExtent: function() {
			// 	console.log('> zoomToExtent');
			// 	return false;
			// },
			dropPin: function (lon, lat, extent) {
				console.log(">dropPin", lon, lat, extent);
				// set global pin location
				this.map_pin_location = [lon, lat, extent];

				// remove possible layers we're going to repaint
				if (this.map_pin) {
					this.map.removeLayer(this.map_pin);
					this.map_pin = null;
				}
				if (this.map_circle) {
					this.map.removeLayer(this.map_circle);
					this.map_circle = null;
				}

				// iterate through all layers and hide location markers
				this.map.getLayers().forEach((layer) => {
					// console.log('l:', layer);
					if (!layer) {
					console.log("this one... ", layer);
					}
					if (
					layer.get("type") &&
					(layer.get("type") == "current_requested_location" ||
						layer.get("type") == "current_requested_circle")
					) {
					console.log("HAZ TYPE", layer.get("type"), layer);
					this.map.removeLayer(layer);
					}
				});

				// if we have an extent to zoom into
				if (extent?.length)
					this.map.getView().fit(
						ol.proj.transformExtent(
							[extent[0], extent[1], extent[2], extent[3]],
							"EPSG:4326",
							this.map.getView().getProjection()
						),
						{ size: this.map.getSize() }
					);

				let mapCoord = Vue.ol.olProj.fromLonLat([lon, lat]);
				this.map_html_icon.setPosition(mapCoord);

				// paint point
				let mappoint = new Vue.ol.Feature({
					geometry: new Vue.ol.olGeom.Point(mapCoord),
				});
				mappoint.map_title = "Target Location";
				mappoint.type = "current_requested_location";
				mappoint.name = "current_requested_location";
				let vector_source = new Vue.ol.olSource.Vector({ features: [mappoint] });
				this.map_pin = new Vue.ol.olLayer.Vector({
					source: vector_source,
					map_type: "current_requested_location",
					name: "current_requested_location",
				});
				this.map_pin.setZIndex(3);
				this.map.addLayer(this.map_pin);

				// paint circle
				if (!this.map_search_shape) {
					console.log('lonlat-----', this.map_form.map_overlay_reach, this.mi_to_m_factor);
					var centerLongitudeLatitude = Vue.ol.olProj.fromLonLat([lon, lat]);
					var map_circle = new Vue.ol.Feature({
						geometry: new Vue.ol.olGeom.Circle(
							centerLongitudeLatitude,
							this.map_form.map_overlay_reach * this.mi_to_m_factor
						),
					});
					map_circle.name = "current_requested_circle";
					map_circle.type = "current_requested_circle";
					map_circle.setStyle(
						new Vue.ol.olStyle.Style({
							stroke: new Vue.ol.olStyle.Stroke({
								color: "#112981",
								width: 1,
							}),
							fill: new Vue.ol.olStyle.Fill({
								color: "rgba(211, 211, 211, 0.3)",
							}),
						})
					);
					vector_source = new Vue.ol.olSource.Vector({ features: [map_circle] });
					this.map_circle = new Vue.ol.olLayer.Vector({
						source: vector_source,
						type: "current_requested_circle",
						name: "current_requested_circle",
					});
					console.log('TRYYYYYN', this.map_circle);
					this.map_circle.setZIndex(2); //TODO: change so above, but need to deal with clicky
					this.map.addLayer(this.map_circle);
				} else {
				}
				document.querySelector("#map-key").classList.remove("hidden");
				document.querySelector("#map-reach-label input").removeAttribute("disabled");
			},
			updateCircle: function () {
				//if we got a circle to deal with
				console.log(">updateCircle");
				if (this.map_circle) {
					var units = this.map.getView().getProjection().getUnits();
					let map_overlay_reach = this.map_form.map_overlay_reach; //document.querySelector("input[name='map_overlay_reach']")
					console.log("map_overlay_reach:", this.map_form.map_overlay_reach, units);
					// console.log("for map", this.map);
					//handle the new circle
					var new_radius = map_overlay_reach * this.mi_to_m_factor;
					var search_circle_layer = this.map_circle; //allLayers.find(layer => layer.get('name') == 'current_requested_circle');//get the layer that represents the search circle
					var search_circle_geometry = search_circle_layer.getSource().getFeatures()[0].getGeometry();
					search_circle_geometry.setRadius(new_radius);
					console.log("circle:", search_circle_layer, search_circle_layer.getProperties(), search_circle_geometry.getProperties(), new_radius);
				} else {
					//there is no circle yet
				}
			},
			changeLayers: function () {
				console.log(">changeLayers");
				return this.filterMap();
			},
			filterMap: function () {
				console.log(">filterMap");
				this.drawer_results_visible = [];
				this.map_filter_results = [];
				console.time("Exe time start portion");
				// second version of showing and hiding by size
				let map_sizes = this.map_form.sizes; //Array.from(document.querySelectorAll("input[name='map-sizes[]']:checked"), e => e.value);
				// console.log('map_sizes', map_sizes);
				let total_matched = 0;

				var allLayers = this.map.getLayers().getArray();
				//var mapLayers = allLayers.filter(layer => {return layer.get('map_type') == 'area_map_shape';});

				let search_geometry = null;

				//if we got a circle to deal with
				this.updateCircle();

				if (this.map_circle) {
					console.log("searchign via circle");
					//some code dupe, but we need the info
					let map_overlay_reach = this.map_form.map_overlay_reach;
					var new_radius = map_overlay_reach * this.mi_to_m_factor;
					var search_circle_layer = this.map_circle; //allLayers.find(layer => layer.get('name') == 'current_requested_circle');//get the layer that represents the search circle
					var search_circle_geometry = search_circle_layer.getSource().getFeatures()[0].getGeometry();
					var search_circle_center = search_circle_geometry.getCenter();
					search_geometry = search_circle_geometry;
				} else if (this.map_search_shape) {
					console.log("alt map search shape", this.map_search_shape, this.map_search_shape.getSource().getFeatures()[0].getGeometry());
					search_geometry = this.map_search_shape.getSource().getFeatures()[0].getGeometry();
				}
				// console.timeEnd('Execution Time Circle');
				console.timeEnd("Exe time start portion");
				console.time("Layer Loop Execution Time");

				var exeTimes = [];

				//TODO we actually might want to consider breaking this up and looping through the different types separately
				//TODO: turn into a web worker. https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
				// allLayers.forEach(layer => {
				for (var layer of allLayers) {
					var should_show = null; //if we dont change this, dont change this layers visibility from whatever it currently is
					const layerType = layer.get("map_type");

					//handle size area filters
					if (
					layerType == "point_map" ||
					layerType == "area_map_point" ||
					(layerType == "area_map_shape" && layer.getVisible())
					) {
					should_show = false; //we must prove we are showing it for these cases [TODO: we probably want to setup things such that the default is showing them]

					if (layer.get("size_area")) {
						let sizeArea = layer.get("size_area");
						// console.log('does', map_sizes);
						if (map_sizes.includes("S")) {
						if (sizeArea < 1) should_show = true;
						}
						if (map_sizes.includes("M")) {
						if (sizeArea >= 1 && sizeArea < 10) should_show = true;
						}
						if (map_sizes.includes("L")) {
						if (sizeArea >= 10 && sizeArea < 100) should_show = true;
						}
						if (map_sizes.includes("XL")) {
						if (sizeArea >= 100) should_show = true;
						}
					} else {
						if (layer.get("map_type") && layer.get("map_type") == "point_map") {
						if (map_sizes.includes("A")) {
							should_show = true;
						} else {
							should_show = false;
						}
						}
					}
					}

					//if we got a circle to deal with, check about the dot proximities
					if (this.map_circle || this.map_search_shape) {
					let layerID = layer.get("map_solr_id"); //used to determine the the green pt to use
					let assocLayers = this.layersByID[layerID];
					// console.log("hash ref",this.layersByID[layerID]);

					if (layerType == "point_map") {
						//blue dots
						//check if the point is within the circle extent
						// const start = performance.now();
						let layerGeometry = layer
						.getSource()
						.getFeatures()[0]
						.getGeometry();

						//check if it in the circle (this might be less efficient than more direct ways of comparing the radius to the distance, but more code-clean)
						if (
						!search_geometry.intersectsCoordinate(
							layerGeometry.getCoordinates()
						)
						) {
						should_show = false;
						} else {
						if (should_show) should_show = true;
						}
					} else if (layerType == "area_map_point") {
						//green dots [and related to green map areas]
						const start = performance.now();
						//check if the point is within the circle extent
						let matchingShape = null;
						for (let i = 0; i < assocLayers.length; i++) {
						if (
							assocLayers[i].get("map_solr_id") == layerID &&
							assocLayers[i].get("map_type") == "area_map_shape"
						) {
							matchingShape = assocLayers[i];
							break;
						}
						}

						const end = performance.now();
						exeTimes.push(end - start);

						let layerGeometry = matchingShape
						.getSource()
						.getFeatures()[0]
						.getGeometry();
						let extent = layerGeometry.getExtent();
						if (search_geometry.intersectsExtent(extent)) {
						// console.debug("setting to visible!", distance, new_radius, layerID, matchingPts.length );
						if (should_show) should_show = true;
						} else {
						should_show = false;
						// console.debug('IT VISIBLE MAKE IT STOP!', layer.get('map_type'), layer.get('type'));
						}
						//if we hide a dot, we should hide its shape
						if (matchingShape.getVisible() != should_show && !should_show)
						matchingShape.setVisible(false);
					}

					if (should_show) this.map_filter_results.push(layerID);
					}
					/*else if (this.map_search_shape){

							}*/

					// console.debug('SHow?', should_show);
					if (should_show !== null && layer.getVisible() != should_show)
					layer.setVisible(should_show);
					if (should_show) total_matched++;
				}

				console.timeEnd("Layer Loop Execution Time");
				let sum = exeTimes.reduce(
					(previousValue, currentValue) => previousValue + currentValue,
					0
				);
				let ave = sum / exeTimes.length;
				console.log(
					`ave over ${exeTimes.length} dots: `,
					ave,
					`-- for a total of ${sum}ms`,
					exeTimes
				);

				return total_matched;
			},
			chooseLocationFromBrowser: function () {
				console.log("> chooseLocationFromBrowser");
				this.map_geolocating_location = true;
				window.navigator.geolocation.getCurrentPosition(
					(evt) => {
					// console.log('e:', evt, evt.coords.longitude, evt.coords.latitude);
					this.map_geolocating_location = false;
					this.dropPin(evt.coords.longitude, evt.coords.latitude);
					},
					(evt) => {
					console.log("error:", evt);
					}
				);
			},
			chooseLocationInMap: function () {
				console.log("> chooseLocationInMap");
				this.map_selecting_location = !this.map_selecting_location;
			},
			clearLocation: function () {
				// iterate through all layers and hide location markers
				document.querySelector("#map-key").classList.add("hidden"); //TODO: this should be vueified

				//TODO: should consider making it so that instead of removing we just hide them...its likely more processor efficient
				if (this.map_pin) this.map.removeLayer(this.map_pin);
				if (this.map_circle) this.map.removeLayer(this.map_circle);
				if (this.map_search_shape) this.map.removeLayer(this.map_search_shape);
				this.map_search_shape = null;
				this.map_circle = null;
				this.map_pin = null;
				this.map_html_icon.setPosition(null);
				this.changeLayers(); //trigger update
				},
				zoomToLocationArea: function () {
				// create box to zoom into -- do the math from original current location
				console.log("> zoomToLocationArea", this.map_pin_location);
				// figure out the circle's extent
				// let layer_to_resize = this.map.getLayers().getArray().find(layer => layer.get('name') == 'current_requested_circle');
				let layer_to_resize = this.map_circle;
				if (layer_to_resize) {
					let extent = layer_to_resize
					.getSource()
					.getFeatures()[0]
					.getGeometry()
					.getExtent();
					// zoom in, with animation and padding
					this.map
					.getView()
					.fit(extent, {
						duration: 1000,
						size: this.map.getSize(),
						padding: [50, 50, 50, 300],
					});
				}
			},

	}
}
</script>