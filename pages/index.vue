<template>
  <div>
    <!-- version 2 -->
    <svg
      width="0px"
      height="0px"
      id="defs-element"
      viewBox="0 0 0 0"
      style="display: none"
    >
      <defs id="defs-element">
        <symbol
          id="map-dot"
          width="20px"
          height="20px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <circle
            fill-rule="nonzero"
            cx="10"
            cy="10"
            r="8.5"
            fill="inherit"
            stroke="#000000"
            stroke-width="3"
          ></circle>
        </symbol>
      </defs>
    </svg>

    <div class="map-background">
      <div class="campaign">
        <h1>Explore the Legacy of Our Revolutionary Past</h1>
        <p>
          Discover the historical geography of the American Revolutionary War
          era through maps, rich interpretive essays, and interactives
        </p>
        <div>
          <form action="/search/" @submit.prevent="searchSubmitFromHomepage">
            <label for="header-search" class="sr-only">Search</label>
            <input
              placeholder="Search"
              v-model="search_on_homepage"
              id="header-search"
              type="text"
            /><button><em class="fa fa-search"></em></button>
          </form>
        </div>
      </div>
      <div class="other-logos">
        <div></div>
        <div></div>
      </div>
    </div>

    <div id="app" class="home-content">

      <stories-swiper />


      <!-- no-slider explore-by-second -->
      <div class="explore-by curated-themes-slider">
        <h2>Explore by Themes</h2>
        <!-- explore-group  -->
        <div class="swiper curated-themes-swiper">
          <div class="swiper-wrapper">
            <!-- explore-slide -->
            <div class="swiper-slide">
              <a href="/people/">
                <div
                  class="explore-image"
                  style="background-image: url('/images/explore_by_people.jpg')"
                ></div>
                People
                <br />
                <span>{{ tag_groups["people"].data.length }} results</span>
              </a>
            </div>
            <div class="swiper-slide">
              <a href="/empires-and-nations/">
                <div
                  class="explore-image"
                  style="background-image: url('/images/explore_by_empirenation.jpg');"
                ></div>
                Empires and Nations
                <br />
                <span
                  >{{
                    tag_groups["2empires_and_nations"].data.length
                  }}
                  results</span
                >
              </a>
            </div>
            <div class="swiper-slide">
              <a href="/explore/4features-2/">
                <div
                  class="explore-image"
                  style="background-image: url('/images/explore_by_cartouche.jpg');"
                ></div>
                Cartouches
                <br />
                <span>{{
                    tag_groups["4features"].data[2].solr_ids_array.length
                  }}
                  results</span
                >
              </a>
            </div>
            <div class="swiper-slide">
              <a href="/explore/4features-5/">
                <div
                  class="explore-image"
                  style="background-image: url('/images/explore_by_animals.jpg');"
                ></div>
                Animals
                <br />
                <span>{{
                    tag_groups["4features"].data[5].solr_ids_array.length
                  }}
                  results</span
                >
              </a>
            </div>
            <div class="curated-themes-swiper-pagination"></div>
          </div>
        </div>
        <div class="curated-themes-swiper-button-next swiper-button-next"></div>
        <div class="curated-themes-swiper-button-prev swiper-button-prev"></div>
      </div>

      <div
        :class="[
          'explore-by explore-by-outer explore-by-timelines',
          { 'explore-by-timelines-active': show_pane },
        ]"
      >
        <div class="explore-by-header">
          <h2>Explore by Timelines</h2>
          <ul class="explore-by-tags">
            <li v-for="(era, era_year) in timeline_eras" :key="era_year">
              <a
                @click="scrollTo(era_year)"
                :class="[{ active: show_era == era_year }]"
                >{{ era.era }}</a
              >
            </li>
          </ul>
        </div>
        <div
          class="timeline-years"
          @scroll.passive="timelineScroll()"
          v-if="ready && !is_mobile"
        >
          <!-- if it's NOT mobile -->
          <div class="years">
            <div
              class="year"
              :id="'year-' + year"
              :key="year"
              v-for="(index, year) in maps_by_years"
            >
              <div class="year-orient" :id="'year-orient-' + year">
                <div class="era" v-if="timeline_eras[year]">
                  <div class="era-headline">
                    {{ timeline_eras[year].era }} &nbsp;
                    <span class="era-years"
                      >{{ timeline_eras[year].era_start_year }} -
                      {{ timeline_eras[year].era_end_year }}</span
                    >
                  </div>
                  <img
                    class="era-image"
                    :src="timeline_eras[year].background_image"
                  />
                  <div
                    class="era-text"
                    v-html="timeline_eras[year].era_description"
                  ></div>
                </div>
              </div>
              <div class="year-text">{{ year }}</div>
              <div class="map-count">
                <template v-if="maps_by_years[parseInt(year)].length">
                  <a
                    @click="
                      drawer_results_visible = maps_by_years[parseInt(year)]
                    "
                    class="tooltip"
                  >
                    <div class="top">
                      {{ maps_by_years[parseInt(year)].length }} Map<template
                        v-if="maps_by_years[parseInt(year).length + 1] != 1"
                        >s</template
                      >
                      in {{ parseInt(year) }}<i></i>
                    </div>
                    {{ maps_by_years[parseInt(year)].length }}
                  </a>
                </template>
                <template v-else><span>0</span></template>
              </div>

              <div class="event-group">
                <details
                  class="event"
                  v-for="(event, index) in timeline_events[year]"
                  :key="index"
                >
                  <summary class="event-name">
                    <div class="event-right">
                      <div v-if="event.solr_ids_array" class="map-count">
                        <a
                          @click="drawer_results_visible = event.solr_ids_array"
                          class="tooltip"
                        >
                          <div class="top">
                            {{ event.solr_ids_array.length }} Related Maps<i
                            ></i>
                          </div>
                          {{ event.solr_ids_array.length }}
                        </a>
                      </div>
                    </div>
                    {{ event.name }} {{ event.end_year }}
                  </summary>
                  <div class="event-notes">
                    {{ event.event_date_range }}<br /><br />{{ event.notes }}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
        <div
          class="timeline-years"
          @scroll.passive="timelineScroll()"
          v-if="ready && is_mobile"
        >
          <!-- if it IS mobile -->
          <div class="years" v-for="(index, year) in maps_by_years" :key="year">
            <div class="year-orient" :id="'year-orient-' + year">
              <div class="era" v-if="timeline_eras[year]">
                <div class="era-headline">
                  {{ timeline_eras[year].era }} &nbsp;
                  <span class="era-years"
                    >{{ timeline_eras[year].era_start_year }} -
                    {{ timeline_eras[year].era_end_year }}</span
                  >
                </div>
                <img
                  class="era-image"
                  :src="timeline_eras[year].background_image"
                />
                <div
                  class="era-text"
                  v-html="timeline_eras[year].era_description"
                ></div>
              </div>
            </div>
            <div class="year" :id="'year-' + year">
              <div
                class="year-text"
                :class="{ 'no-border': timeline_eras[parseInt(year) + 1] }"
              >
                {{ year }}
              </div>
              <div class="event-group" v-if="timeline_events[year]">
                <details
                  class="event"
                  v-for="(event, index) in timeline_events[year]"
                  :key="index"
                >
                  <summary class="event-name">
                    <div class="event-right">
                      <div v-if="event.solr_ids_array" class="map-count">
                        <a
                          @click="drawer_results_visible = event.solr_ids_array"
                          class="tooltip"
                        >
                          <div class="top">
                            {{ event.solr_ids_array.length }} Related Maps<i
                            ></i>
                          </div>
                          {{ event.solr_ids_array.length }}
                        </a>
                      </div>
                    </div>
                    {{ event.name }} {{ event.end_year }}
                  </summary>
                  <div class="event-notes">
                    {{ event.event_date_range }}<br /><br />{{ event.notes }}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="explore-by explore-by-outer explore-by-facets"
        v-if="ready == true"
      >
        <div class="explore-by-header">
          <h2>Explore by Facets</h2>
          <ul class="explore-by-tags">
            <template v-for="(tag_group, index) in tag_groups">
              <li
                :key="index"
                v-if="index != 'institution_name_ssi' && index != 'years'"
              >
                <a
                  @click="clickFacet(index)"
                  :class="[{ active: show_facet == index }]"
                  >{{ tag_group.show_name }}</a
                >
              </li>
            </template>
          </ul>
        </div>
        <template v-for="(tag_group, index) in tag_groups">
          <div
            :key="index"
            v-if="
              show_facet == index &&
              index != 'institution_name_ssi' &&
              index != 'exhibits' &&
              index != 'years'
            "
          >
            <!-- NOT mobile -->
            <div
              :class="[
                'swiper facets-' + index.split('_').join('-') + '-swiper',
              ]"
            >
              <div class="swiper-wrapper">
                <div
                  v-for="(tag, tag_index) in tag_groups[index].data"
                  :key="tag_index"
                  class="swiper-slide explore-slide"
                >
                  <a :href="'/explore/' + index + '-' + tag_index + '/'">
                    <div
                      class="explore-image"
                      :style="
                        'background-image: url(\'' +
                        (tag.image
                          ? tag.image
                          : 'tag_groups[index].show_image') +
                        '\');'
                      "
                    ></div>
                    <template v-if="tag.show_name">{{ tag.show_name }}</template
                    ><template v-else>{{ tag.name }}</template>
                    <br />
                    <span>See {{ tag.count }} maps</span>
                  </a>
                </div>
              </div>
              <div class="facets-swiper-pagination"></div>
            </div>
            <div class="facets-swiper-button-next swiper-button-next"></div>
            <div class="facets-swiper-button-prev swiper-button-prev"></div>
          </div>
        </template>
      </div>

      <div class="explore-by explore-by-institution" v-if="ready == true">
        <!-- NOT mobile -->
        <div class="explore-by-header">
          <h2>Explore by Institutions</h2>
        </div>
        <div class="swiper institutions-swiper">
          <div class="swiper-wrapper align-bottom">
            <a
              @click="drawer_results_visible = tag.solr_ids_array"
              v-for="(tag, tag_index) in tag_groups.institution_name_ssi.data"
              :key="tag_index"
              class="swiper-slide explore-slide"
            >
              <img :src="tag.image" /><br />
              {{ tag.name }}<br />
              <span>See {{ tag.count }} maps</span>
            </a>
          </div>
          <div class="institutions-swiper-pagination"></div>
        </div>
        <div class="institutions-swiper-button-next swiper-button-next"></div>
        <div class="institutions-swiper-button-prev swiper-button-prev"></div>
      </div>

      <div class="explore-by explore-by-outer" v-if="ready == true">
        <div class="explore-by-header">
          <h2>Explore by Map</h2>
        </div>
        <div class="map-container">
          <div>
            <p>Map areas:</p>
            <div class="explore-by-checkboxes">
              <label
                :class="[
                  'explore-map-check',
                  'xl-map',
                  { 'label-checked': true },
                ]"
                ><input
                  name="map-sizes[]"
                  v-model="map_form.sizes"
                  value="XL"
                  @change="changeLayers()"
                  type="checkbox" /><span class="checkmark"></span>Very large
                (country)<svg width="20px" height="20px">
                  <use href="#map-dot"></use></svg
              ></label>
              <label
                :class="[
                  'explore-map-check',
                  'l-map',
                  { 'label-checked': true },
                ]"
                ><input
                  name="map-sizes[]"
                  v-model="map_form.sizes"
                  value="L"
                  @change="changeLayers()"
                  type="checkbox" /><span class="checkmark"></span>Large
                (region)<svg width="20px" height="20px">
                  <use href="#map-dot"></use></svg
              ></label>
              <label
                :class="[
                  'explore-map-check',
                  'm-map',
                  { 'label-checked': true },
                ]"
                ><input
                  name="map-sizes[]"
                  v-model="map_form.sizes"
                  value="M"
                  @change="changeLayers()"
                  type="checkbox" /><span class="checkmark"></span>Medium
                (colony)<svg width="20px" height="20px">
                  <use href="#map-dot"></use></svg
              ></label>
              <label
                :class="[
                  'explore-map-check',
                  's-map',
                  { 'label-checked': true },
                ]"
                ><input
                  name="map-sizes[]"
                  v-model="map_form.sizes"
                  value="S"
                  @change="changeLayers()"
                  type="checkbox" /><span class="checkmark"></span>Small
                (city)<svg width="20px" height="20px">
                  <use href="#map-dot"></use></svg
              ></label>
              <label :class="['explore-map-check', { 'label-checked': true }]"
                ><input
                  name="map-sizes[]"
                  v-model="map_form.sizes"
                  value="A"
                  @change="changeLayers()"
                  type="checkbox" /><span class="checkmark"></span>Include maps
                without sizes<svg width="20px" height="20px">
                  <use href="#map-dot"></use></svg
              ></label>
            </div>
          </div>
          <div
            id="map-holder"
            :class="[
              { selecting: map_selecting_location },
              { geolocating: map_geolocating_location },
            ]"
          >
            <div id="map-column-holder">
              <div id="map-tools">
                <form
                  method="post"
                  @submit.prevent="fetchLocationDataByAddress"
                >
                  <div id="map-tools-address-holder">
                    <label
                      id="map-tools-address-label"
                      for="map-tools-address-input"
                      >Input city, region or state to drop a pin to find maps
                      nearby.<i></i
                    ></label>
                    <input
                      id="map-tools-address-input"
                      v-on:focus="map_form_input_pulldown_toggle = true"
                      v-on:keyup="fetchLocationDataByAddress"
                      v-model="map_form.address"
                      placeholder="Input city, state, etc and press enter"
                    />
                    <div
                      id="map-tools-address-pulldown"
                      v-if="map_form_input_pulldown_toggle"
                    >
                      <div
                        @click="chooseMapPlace(pulldown_index)"
                        v-for="(
                          pulldown_arr, pulldown_index
                        ) in map_form_input_pulldown_arr"
                        :key="pulldown_index"
                      >
                        {{ pulldown_arr.display_name }}
                      </div>
                    </div>
                  </div>
                  <input type="submit" value="Go" />
                </form>
                <a
                  class="tooltip"
                  @click="chooseLocationFromBrowser()"
                  id="map-tools-choose-from-browser"
                >
                  <img
                    src="/images/icon-geolocate.svg"
                    alt="Choose by location"
                  />
                  <div class="top">
                    Request current location from browser<i></i>
                  </div>
                </a>
                <a
                  class="tooltip"
                  @click="chooseLocationInMap()"
                  id="map-tools-choose-in-map"
                >
                  <img src="/images/icon-map_pin.svg" alt="Drop a pin" />
                  <div class="top">
                    Enable to click on map to choose a location<i></i>
                  </div>
                </a>
              </div>

              <div id="map-key" class="hidden">
                <!-- <label><input type="checkbox" name="layers" checked value="colonies" onchange="app.changeLayers()"> Colonies</label> -->
                <!-- <label><input type="checkbox" name="layers" value="aldermanic_districts" onchange="changeLayers()"> Aldermanic Districts</label> -->
                <!-- <label><input type="checkbox" name="layers" checked value="maps" onchange="app.changeLayers()"> Maps</label> -->
                <!-- <label><input type="range" name="map_overlay_size" min=".1" max="30" value=".1" step=".1" oninput="app.changeLayers()" onchange="app.changeLayers()"> Map Size (scale)</label> -->
                <label id="map-reach-label" class="disabled">
                  <input
                    disabled
                    type="range"
                    name="map_overlay_reach"
                    v-model="map_form.map_overlay_reach"
                    min="10"
                    max="500"
                    step="10"
                    @change="changeLayers()"
                    @input="updateCircle()"
                  />
                  {{ map_form.map_overlay_reach }} miles from dropped pin
                </label>
                <button
                  class="button-like primary"
                  @click="drawer_results_visible = map_filter_results"
                >
                  Show Maps ({{ map_filter_results.length }})
                </button>
                <a
                  @click="
                    zoomToLocationArea();
                    return false;
                  "
                  class="button-like primary"
                  >Zoom</a
                >
                <a
                  @click="
                    clearLocation();
                    return false;
                  "
                  class="button-like secondary"
                  >Clear Pin</a
                >
              </div>
            </div>
            <div id="map" class="map">
              <div id="popup" class="arrow_box">
                <div id="popup_content" v-html="map_popup_content"></div>
                <a href="#" id="popup_close">✖</a>
              </div>
              <div id="selected-location-icon" class="">
                <div>{{ map_filter_results.length }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- {{drawer_results_visible}} -->
      <Drawer :drawer_results_visible="drawer_results_visible" :maps="maps" />
      <!-- <details open v-if="ready" id="results-bar" :class="['show',(results_visible.length) ? 'results-visible' : '']">
				<summary>{{results_visible.length}} Result<template v-if="results_visible.length != 1">s</template></summary>
				<div id="results" class="list-view">
					<ul class="results-views">
						<li class="results-view-option active" id="list-view" onclick="changeResultsView(this)">List</li>
						<li class="results-view-option" id="thumbnail-view" onclick="changeResultsView(this)">Thumbnail</li>
					</ul>
					<a :href="'/maps/'+maps[result].solr_id" v-for="result, index in results_visible" :key="index">
						<div class="result-image" :style="'background-image:url(https://bpldcassets.blob.core.windows.net/derivatives/images/'+maps[result].exemplary_image_ssi+'/image_thumbnail_300.jpg)'"></div>
						<div class="result-text">{{maps[result].title_info_primary_tsi}}</div>
					</a>
				</div>
			</details> -->
    </div>
  </div>
</template>

<style>
@import '../static/assets/ol.css';
@import '../static/assets/homepage-map.css';
</style>

<script>
import home_data from "~/data/home_data.json";
import api_keys from "~/data/api_keys.json";
import Drawer from "~/components/drawer.vue";
import StoriesSwiper from '~/components/storiesSwiper.vue';
// import * as ol from 'ol';
// import Extent from 'ol/interaction/Extent.js';
// import Point from 'ol/geom/Point.js';
// import Polygon from 'ol/geom/Polygon.js';
// import Circle from 'ol/geom/Circle.js';
// import Interaction from 'ol/interaction/Interaction.js';
// import TileLayer from 'ol/layer/Tile.js';
// import VectorLayer from 'ol/layer/Vector.js';
// import * as olProj from 'ol/proj';
// import * as olStyle from 'ol/style';
// import VectorSource from 'ol/source/Vector.js';
// import TileJSON from 'ol/source/TileJSON.js';

export default {
  name: "IndexPage",
  components: {
    Drawer,
    StoriesSwiper,
  },
	head() {
		return {
			title: "Collection Record",
			script: [
				{ type: 'text/javascript', src: '/assets/swiper-bundle.min.js', body: true },
			],
		}
	},

  asyncData({ route }) {
    return {
      tag_groups: home_data.tag_groups,
      maps_by_years: home_data.maps_by_years,
      timeline_events: home_data.timeline_events,
      timeline_eras: home_data.timeline_eras,
      show_era: Object.keys(home_data.timeline_eras)[0], // make first one active
      maps: home_data.maps,
      search_on_homepage: "",
    };
  },
  data() {
    return {
      ready: false,
      is_mobile: false,
      // facets & eras
      tag_groups: {},
      maps_by_years: {},
      timeline_eras: {},
      timeline_events: {},
      show_pane: null,
      show_facet: null,
      show_era: null,
      // map
      maps: {},
      map: null,
      map_selected_shape: null,
      map_pin: null,
      map_circle: null,
      map_search_shape: null,
      map_selecting_location: false,
      map_geolocating_location: false,
      map_pin_location: null,
      map_popup_content: null,
      // map form
      map_form: {
        map_overlay_reach: 80,
        sizes: [],
      },
      map_form_input_pulldown_toggle: false,
      map_form_input_pulldown_arr: [],
      // results
      map_filter_results: [],
      drawer_results_visible: [], //['commonwealth:hx11z473s', 'commonwealth:hx11z475b', 'commonwealth:hq37vv62q', 'commonwealth:hx11z4717'],
      // map_vector_layers: [],
      // windowWidth: window.innerWidth,
      map_html_icon: null,
      mi_to_m_factor: 1609.34,
      layersByID: {},
      mapPopup: null,
    };
  },
  beforeMount() {
    this.map_form.sizes = ["L", "XL", "M", "S", "A"];
    this.is_mobile = window.innerWidth <= 768;
    // this.map_form.map_overlay_reach = 150;
    this.getData();
  },
  mounted() {
    window.addEventListener("resize", this.resize);
    this.$nextTick(() => {
      this.clickFacet(Object.keys(this.tag_groups)[0]); // "click" first facet
    });
  },
  unmounted() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    resize: function () {
      this.is_mobile = window.innerWidth <= 768;
    },
    getData: function (which_address) {
      this.$nextTick(() => {
        //TODO: maybe change how exactly the ready works: v-show or :class instead of v-if?
        this.ready = true; // prevent painting before data is available

        this.$nextTick(() => {
          this.setupSlider(); //once ready
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

      // reset overlay reach
      // this.map_form.map_overlay_reach = 80; //TODO: change this to somewhere else and/or be a fxn

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
    setupSlider: function () {
      console.log("> setupSliders");
      //TODO: consider using CSS mode
      var institutions_swiper = new Swiper(".institutions-swiper", {
        slidesPerView: 2,
        breakpoints: {
          500: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 25,
          },
          900: {
            slidesPerView: 5,
            spaceBetween: 30,
          },
        },
        spaceBetween: 10,
        // pagination: {
        // 	el: ".institutions-swiper-pagination",
        // 	clickable: true,
        // },
        navigation: {
          nextEl: ".institutions-swiper-button-next",
          prevEl: ".institutions-swiper-button-prev",
        },
      });
      var curated_themes_swiper = new Swiper(".curated-themes-swiper", {
        slidesPerView: 1,
        breakpoints: {
          500: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          769: { slidesPerView: 4 },
        },
        spaceBetween: 30,
        pagination: {
          el: ".curated-themes-swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".curated-themes-swiper-button-next",
          prevEl: ".curated-themes-swiper-button-prev",
        },
      });

      var curated_stories_swiper = new Swiper(".curated-stories-swiper", {
        slidesPerView: 1,
        breakpoints: {
          500: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
        },
        spaceBetween: 30,
        pagination: {
          el: ".curated-stories-swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".curated-stories-swiper-button-next",
          prevEl: ".curated-stories-swiper-button-prev",
        },
      });
      //https://swiperjs.com/swiper-api

      /*		Optional parameters
			{
				createElements: false,
				//slideClass: 'slide',
				cssMode: true,//truemode: few less features, but better performance in modern browsers allegedly
				direction: 'horizontal',
				slidesPerView: 1,//slide shown in view
				spaceBetween: 0,//space between slides
				centeredSlides: true,
				loop: false,
				effect: "slide",
				autoplay: false, //{
					//delay: 5000,
					//disableOnInteraction: true,
					//pauseOnMouseEnter: true,
				//},
				navigation: {
					nextEl: '.next',
					prevEl: '.prev',
				},
				pagination: {
					el: ".slide-selection",
					clickable: true,
					type: 'bullets',
					bulletActiveClass: 'active',
					bulletClass: 'slide-select',
					renderBullet: function (index, className) {
						//return '<span class="'+className+'"></span>';
						return `<button v-for="(image, i) in selected_space.images" type="button" class="slide-select ${className}" @click=""><span class="visual"></span></button>`;
					},
				},
			}
			*/
    },
    setupMap: function () {
      console.log("> setupMap");
      const start = performance.now();

      const rasterLayer = new ol.layer.Tile({
        source: new ol.source.TileJSON({
        url: `https://api.maptiler.com/maps/voyager-v2/tiles.json?key=${api_keys.maptiler}`,
        tileSize: 512,
        crossOrigin: 'anonymous'
      })
    });

      this.map = new ol.Map({
        layers: [rasterLayer],
        target: document.getElementById("map"),
        interactions: ol.interaction.defaults.defaults({
          mouseWheelZoom: false,
        }),
        view: new ol.View({
          center: ol.proj.fromLonLat([-89, 39]),
          zoom: 5,
        }),
      });
      var mapPtIcon = new ol.style.Icon({
        color: "#AACC00",
        // anchor: [0.5, 46],
        // anchorXUnits: 'fraction',
        // anchorYUnits: 'pixels',
        // src: '/images/map-address-dot.png',
        // scale: area_scale, // .2
        src: "/images/unknown_map_dot.svg",
        scale: 1, // 1
      });
      var mapPointStyle = new ol.style.Style({
        image: new ol.style.Icon({
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

      var mapShapeStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: "#000", width: 1 }),
        fill: new ol.style.Fill({ color: "#bacaba66" }),
      });

      // add shapes first so they're below
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
          let mapshape = new ol.Feature({
            geometry: new ol.geom.Polygon([map_coordinates_polygon]),
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
          let map_vector_source = new ol.source.Vector({
            features: [mapshape],
          });
          let map_vector_layers = new ol.layer.Vector({
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
          let mappoint = new ol.Feature({
            geometry: new ol.geom.Point(
              ol.proj.fromLonLat([map_point_arr[1], map_point_arr[0]])
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
            new ol.style.Style({
              image: clone,
            })
          );
          // mappoint.set('name', 'gjkgljkgjkl');
          let pin_vector_source = new ol.source.Vector({
            features: [mappoint],
          });
          let pin_vector_layers = new ol.layer.Vector({
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
        } else if (
          !this.maps[this_map].subject_bbox_geospatial &&
          this.maps[this_map].subject_point_geospatial
        ) {
          // add points when there's not a bbox
          let map_point_arr =
            this.maps[this_map].subject_point_geospatial.split(",");
          // console.log('point--->', map_point_arr);
          let mappoint = new ol.Feature({
            geometry: new ol.geom.Point(
              ol.proj.fromLonLat([map_point_arr[1], map_point_arr[0]])
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
          let vector_source = new ol.source.Vector({
            features: [mappoint],
          });
          let map_vector_layers = new ol.layer.Vector({
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
          let clicked_coordinate = ol.proj.transform(
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
                  this.maps[feature.map_solr_id].subject_bbox_geospatial.split(
                    ", "
                  );
                let extent = ol.extent.applyTransform(
                  [
                    map_coordinates_arr[1],
                    map_coordinates_arr[3],
                    map_coordinates_arr[0],
                    map_coordinates_arr[2],
                  ],
                  ol.proj.getTransform("EPSG:4326", "EPSG:3857")
                );
                // zoom in, with animation and padding
                this.map
                  .getView()
                  .fit(extent, {
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
            ol.proj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326")
          );
        }
      });

      // define and add the on-click overlay
      const element = document.getElementById("popup");
      const popup = new ol.Overlay({
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
      const htmlIcon = new ol.Overlay({
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
        this.map
          .getView()
          .fit(
            ol.proj.transformExtent(
              [extent[0], extent[1], extent[2], extent[3]],
              "EPSG:4326",
              this.map.getView().getProjection()
            ),
            { size: this.map.getSize() }
          );

      let mapCoord = ol.proj.fromLonLat([lon, lat]);
      this.map_html_icon.setPosition(mapCoord);

      // paint point
      let mappoint = new ol.Feature({
        geometry: new ol.geom.Point(mapCoord),
      });
      mappoint.map_title = "Target Location";
      mappoint.type = "current_requested_location";
      mappoint.name = "current_requested_location";
      // mappoint.setStyle(new ol.style.Style({
      // 	image: new ol.style.Icon({
      // 		color: '#FF8888',
      // 		anchor: [0.5, 46],
      // 		anchorXUnits: 'fraction',
      // 		anchorYUnits: 'pixels',
      // 		src: '/images/map-address-dot.png',
      // src: '/images/unknown_map_dot.svg',
      // 		scale: .2,
      // 	})
      // }));
      let vector_source = new ol.source.Vector({ features: [mappoint] });
      this.map_pin = new ol.layer.Vector({
        source: vector_source,
        map_type: "current_requested_location",
        name: "current_requested_location",
      });
      this.map_pin.setZIndex(3);
      this.map.addLayer(this.map_pin);

      // paint circle
      if (!this.map_search_shape) {
        var centerLongitudeLatitude = ol.proj.fromLonLat([lon, lat]);
        var map_circle = new ol.Feature({
          geometry: new ol.geom.Circle(
            centerLongitudeLatitude,
            this.map_form.map_overlay_reach * this.mi_to_m_factor
          ),
        });
        map_circle.name = "current_requested_circle";
        map_circle.type = "current_requested_circle";
        map_circle.setStyle(
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: "#112981",
              width: 1,
            }),
            fill: new ol.style.Fill({
              color: "rgba(211, 211, 211, 0.3)",
            }),
          })
        );
        vector_source = new ol.source.Vector({ features: [map_circle] });
        this.map_circle = new ol.layer.Vector({
          source: vector_source,
          type: "current_requested_circle",
          name: "current_requested_circle",
        });
        this.map_circle.setZIndex(2); //TODO: change so above, but need to deal with clicky
        this.map.addLayer(this.map_circle);
      } else {
      }
      document.querySelector("#map-key").classList.remove("hidden");
      document
        .querySelector("#map-reach-label input")
        .removeAttribute("disabled");
    },
    updateCircle: function () {
      //if we got a circle to deal with
      console.log(">updateCircle");
      if (this.map_circle) {
        var units = this.map.getView().getProjection().getUnits();
        let map_overlay_reach = this.map_form.map_overlay_reach; //document.querySelector("input[name='map_overlay_reach']")
        console.log(
          "map_overlay_reach:",
          this.map_form.map_overlay_reach,
          units
        );
        // console.log("for map", this.map);
        //handle the new circle
        var new_radius = map_overlay_reach * this.mi_to_m_factor;
        var search_circle_layer = this.map_circle; //allLayers.find(layer => layer.get('name') == 'current_requested_circle');//get the layer that represents the search circle
        var search_circle_geometry = search_circle_layer
          .getSource()
          .getFeatures()[0]
          .getGeometry();
        search_circle_geometry.setRadius(new_radius);
        console.log(
          "circle:",
          search_circle_layer,
          search_circle_layer.getProperties(),
          search_circle_geometry.getProperties(),
          new_radius
        );
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
        var search_circle_geometry = search_circle_layer
          .getSource()
          .getFeatures()[0]
          .getGeometry();
        var search_circle_center = search_circle_geometry.getCenter();
        search_geometry = search_circle_geometry;

        if (window.Worker) {
          /*const mapWorker = new Worker('/assets/mapWorker.js');
					//TODO: determine how the response should be formatted so that we can update the layers properly...
					mapWorker.onmessage = (response) => {
						// response.data.layerActionArray;
						console.log('mapWorker has finished!', response);
						// for(var layer of response.data.layerActionArray){

						// }
						mapWorker.terminate();
					}
					let mapCircle = this.map_circle;
					// console.log('circle to post:', search_circle_geometry);
					mapWorker.postMessage({mapSizes: map_sizes}, []);
					//mapWorker.postMessage({allLayers: allLayers, mapSizes: map_sizes, mapCircle: mapCircle});
					*/
        }
      } else if (this.map_search_shape) {
        console.log(
          "alt map search shape",
          this.map_search_shape,
          this.map_search_shape.getSource().getFeatures()[0].getGeometry()
        );
        search_geometry = this.map_search_shape
          .getSource()
          .getFeatures()[0]
          .getGeometry();
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

            /*if(this.map_circle) {
							// let closestPt = layerGeometry.getClosestPoint(search_circle_center); //closest point on the map to the circle center
							// let distance = Math.pow(Math.pow(search_circle_center[0] - closestPt[0], 2) + Math.pow(search_circle_center[1] - closestPt[1], 2), .5); //a^2 + b^2 = c^2
							
							let extent = layerGeometry.getExtent(); 
							if(search_geometry.intersectsExtent(extent) ){ 
							// if(distance <= new_radius) { //if the closest point is within radius distance to the center, it must be intersecting 
							// if(search_geometry.intersectsCoordinate(closestPt) ){ //this only finds if the circle intersects with the lines of the rectangle
								// console.debug("setting to visible!", distance, new_radius, layerID, matchingPts.length );
								if(should_show) should_show = true;
							} else {						
								should_show = false;
								// console.debug('IT VISIBLE MAKE IT STOP!', layer.get('map_type'), layer.get('type'));
							}
						
						} else if (this.map_search_shape ){
							let extent = layerGeometry.getExtent(); 
							if(search_geometry.intersectsExtent(extent) ){ 
								// console.debug("setting to visible!", distance, new_radius, layerID, matchingPts.length );
								if(should_show) should_show = true;
							} else {						
								should_show = false;
								// console.debug('IT VISIBLE MAKE IT STOP!', layer.get('map_type'), layer.get('type'));
							}
						}*/

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

      if (this.map_circle) {
        let map_overlay_reach = document.querySelector(
          "input[name='map_overlay_reach']"
        );
        console.log("map_overlay_reach:", map_overlay_reach.value);
        console.log("for map", this.map);
        //handle the new circle
        let new_radius = map_overlay_reach.value * this.mi_to_m_factor;
        let search_circle_layer = this.map
          .getLayers()
          .getArray()
          .find((layer) => layer.get("name") == "current_requested_circle"); //get the layer that represents the search circle
        let search_circle_geometry = search_circle_layer
          .getSource()
          .getFeatures()[0]
          .getGeometry();
        let search_circle_center = search_circle_geometry.getCenter();
        search_circle_geometry.setRadius(new_radius);
        // console.log('circle:', search_circle_layer.getProperties(), search_circle_geometry.getProperties(), new_radius);

        // now get a list of all that match that size?
        let allLayers = this.map.getLayers().getArray();
        let layerTypes = []; //area_map_shape, area_map_point, current_requested_circle,
        let pointLayers = allLayers.filter((layer) => {
          if (!layerTypes.includes(layer.get("map_type")))
            layerTypes.push(layer.get("map_type"));
          return layer.get("map_type") == "point_map";
        }); //blue dots
        let mapPointLayers = allLayers.filter((layer) => {
          return layer.get("map_type") == "area_map_point";
        }); //green dots
        let mapLayers = allLayers.filter((layer) => {
          return layer.get("map_type") == "area_map_shape";
        });
        // otherLayers = allLayers.filter(layer => { return layer.get('map_type') != 'point_map' && layer.get('map_type') != 'area_map_shape' ;});
        // console.log('layerTypes:', layerTypes);
        // console.log('allLayers:', allLayers);
        // console.log('area_map_shape layers:', mapLayers);
        // console.log('area_map_point layers:', mapPointLayers);
        // console.log('point_map layers:', pointLayers);

        for (var layer of pointLayers) {
          //check if the point is within the circle extent
          let layerGeometry = layer.getSource().getFeatures()[0].getGeometry();

          //check if it in the circle (this might be less efficient than more direct ways of comparing the radius to the distance, but more code-clean)
          if (
            !search_circle_geometry.intersectsCoordinate(
              layerGeometry.getCoordinates()
            )
          ) {
            // console.debug('geo',layerGeometry.getCoordinates());
            // if(layer.getVisible() ) {
            // console.log('IT VISIBLE MAKE IT STOP!', layer.get('map_type'), layer.get('type'));
            layer.setVisible(false);
            // }
          } else layer.setVisible(true);
        }

        for (var layer of mapLayers) {
          //check if the point is within the circle extent
          let layerGeometry = layer.getSource().getFeatures()[0].getGeometry();
          let layerID = layer.get("map_solr_id"); //used to determine the the green pt to use
          let matchingPts = mapPointLayers.filter((l) => {
            return l.get("map_solr_id") == layerID;
          });
          let closestPt = layerGeometry.getClosestPoint(search_circle_center); //closest point on the map to the circle center
          let distance = Math.pow(
            Math.pow(search_circle_center[0] - closestPt[0], 2) +
              Math.pow(search_circle_center[1] - closestPt[1], 2),
            0.5
          ); //a^2 + b^2 = c^2
          //if the closest point is within radius distance to the center, it must be intersecting
          let mapIsInCircle = false;
          if (distance <= new_radius) {
            mapIsInCircle = true;
          } else mapIsInCircle = false;

          if (mapIsInCircle) {
            // layer.setVisible(true);
            // console.debug("setting to visible!", distance, new_radius, layerID, matchingPts.length );
            matchingPts[0].setVisible(true);
          } else {
            // layer.setVisible(false);
            matchingPts[0].setVisible(false);
            // console.log('IT VISIBLE MAKE IT STOP!', layer.get('map_type'), layer.get('type'));
          }
          // Object.keys(this.maps).forEach(this_map => {
          // 	if (this.maps[this_map].subject_bbox_geospatial) {
          // 		// add a bbox
          // 		map_coordinates_arr = this.maps[this_map].subject_bbox_geospatial.split(', ');
          // 		map_coordinates_polygon = [[map_coordinates_arr[0], map_coordinates_arr[2]],[map_coordinates_arr[0], map_coordinates_arr[3]],[map_coordinates_arr[1], map_coordinates_arr[3]],[map_coordinates_arr[1], map_coordinates_arr[2]]];
          // 		// figure out the area / size
          // 		area = Math.abs(map_coordinates_arr[1] - map_coordinates_arr[0]) * Math.abs(map_coordinates_arr[3] - map_coordinates_arr[2]
          // 		mapshape = new ol.Feature({
          // 			geometry: new ol.geom.Polygon([map_coordinates_polygon]),
          // 			// name: 'test_for_feature'
          // });
        }
      }
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
    timelineScroll: function () {
      // console.log('> timelineScroll');
      let first_div_past_scroll_date = "";
      if (this.is_mobile && 1 == 2) {
        // go through a list of all possible .year-orient divs
        // document.querySelectorAll('.year-orient').forEach((e, v) => {
        // 	var this_year = e.id.substring(12);
        // 	console.log('e, v, ', e, this_year, this.timeline_eras);
        // 	var outsideRect = document.querySelector('.timeline-years').getBoundingClientRect();  // reference to scroll target
        // 	var insideRect = document.querySelector('#year-orient-'+this.timeline_eras[this_year].era_end_year).getBoundingClientRect();  // reference to scroll target
        // 	var scrollLocation = insideRect['top'] - outsideRect['top'] - outsideRect['height'] - 30;
        // 	// console.log('this_year:', this_year, this.timeline_eras[this_year].era_end_year, scrollLocation);
        // 	if (scrollLocation > -176 && first_div_past_scroll_date=='') first_div_past_scroll_date = this_year;
        // })
      } else {
        // trying to find the mismatch of mobile vs desktop when scrolling TODO
        Object.keys(this.timeline_eras).forEach((this_year) => {
          var outsideRect = document
            .querySelector(".timeline-years")
            .getBoundingClientRect(); // reference to scroll target
          if (this.is_mobile) {
            var insideRect = document
              .querySelector(
                "#year-orient-" + this.timeline_eras[this_year].era_end_year
              )
              .getBoundingClientRect(); // reference to scroll target
          } else {
            var insideRect = document
              .querySelector(
                "#year-" + this.timeline_eras[this_year].era_end_year
              )
              .getBoundingClientRect(); // reference to scroll target
          }
          var scrollLocation =
            insideRect["top"] - outsideRect["top"] - outsideRect["height"] - 30;
          // console.log('this_year:', this_year, this.timeline_eras[this_year].era_end_year, scrollLocation);
          if (scrollLocation > -176 && first_div_past_scroll_date == "")
            first_div_past_scroll_date = this_year;
        });
      }
      // console.log('FINAL Location:', first_div_past_scroll_date);
      this.show_era = first_div_past_scroll_date;
    },
    /*setupTimelineScroll: function() {
			console.log('> setupTimelineScroll');
			setTimeout(() => {
				var outsideElem = document.querySelector('.timeline-years');
				outsideElem.addEventListener("scroll", () => {
					console.log('scroll', outsideElem.scrollTop);
					// iterate through each of the eras and find the first who's end year is past
					let first_div_past_scroll_date = '';
					Object.keys(this.timeline_eras).forEach(this_year => {
						var outsideRect = document.querySelector('.timeline-years').getBoundingClientRect();  // reference to scroll target
						var insideRect = document.querySelector('#year-'+this.timeline_eras[this_year].era_end_year).getBoundingClientRect();  // reference to scroll target
						var scrollLocation = insideRect['top'] - outsideRect['top'] - outsideRect['height'];
						// console.log('this_year:', this_year, this.timeline_eras[this_year].era_end_year, scrollLocation);
						if (scrollLocation > -176 && first_div_past_scroll_date=='') first_div_past_scroll_date = this_year;
					});
					// console.log('FINAL Location:', first_div_past_scroll_date);
					this.show_era = first_div_past_scroll_date;
				});
			}, 100);
		},*/
    clickEra: function (which) {
      console.log("> clickEra", which);
      if (this.show_pane != which) {
        this.show_pane = which;
      } else {
        this.show_pane = null;
      }
    },
    clickFacet: function (which) {
      console.log(
        "> clickFacet",
        which,
        ".facets-" + which.split("_").join("-") + "-swiper"
      );
      if (this.show_facet != which) {
        this.show_facet = which;
        this.$nextTick(() => {
          var facets_swiper = new Swiper(
            ".facets-" + which.split("_").join("-") + "-swiper",
            {
              slidesPerView: 1,
              breakpoints: {
                500: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                900: { slidesPerView: 4 },
              },
              spaceBetween: 25,
              // pagination: {
              // 	el: ".facets-swiper-pagination",
              // 	clickable: true,
              // },
              navigation: {
                nextEl: ".facets-swiper-button-next",
                prevEl: ".facets-swiper-button-prev",
              },
            }
          );
          console.log(":::", facets_swiper);
        });
      } else {
        this.show_facet = null;
      }
    },
    scrollTo: function (which_div) {
      console.log("scrollTo", which_div);
      // update button state
      this.show_era = which_div;
      // find location and move to it
      var outsideElem = document.querySelector(".timeline-years");
      var outsideRect = outsideElem.getBoundingClientRect(); // reference to scroll target
      var insideRect = document
        .querySelector("#year-orient-" + which_div)
        .getBoundingClientRect(); // reference to scroll target
      var scrollLocation =
        Math.abs(
          insideRect["top"] - outsideRect["top"] + outsideElem.scrollTop
        ) - 30;
      // console.log('>>>>>', outside['top'], inside['top'], scrollLocation, outsideElem.scrollTop);
      document.querySelector(".timeline-years").scrollTo({
        top: scrollLocation,
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    },
    manageTimelineScroll: function () {
      console.log("> manageTimelineScroll");
    },
    searchSubmitFromHomepage: function (event) {
      console.log("Event:", this.search_on_homepage);
      document.location.href = "/search/?q=" + this.search_on_homepage;
    },
    // showMaps: function(which) {
    // 	console.log('> showMaps base', which);
    // 	// this.results_visible = which;
    // },
    // isMobile: function() {
    // 	console.log('> isMobile', window);
    // 	if(window.innerWidth <= 768) {
    // 		console.log('mobile!');
    // 		return true;
    // 	} else {
    // 		console.log('desktop!');
    // 		return false;
    // 	}
    // },
  },
};
</script>
