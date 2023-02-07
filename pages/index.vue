<template>
	<div>
		<!-- version 2 -->
		<svg width="0px" height="0px" id="defs-element" viewBox="0 0 0 0" style="display: none;">
			<defs id="defs-element">
				<symbol id="map-dot" width="20px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<circle fill-rule="nonzero" cx="10" cy="10" r="8.5" fill="inherit" stroke="#000000" stroke-width="3"></circle>
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
					<input placeholder="Search" v-model="search_on_homepage" id="header-search" type="text" />
					<button><em class="fa fa-search"></em></button>
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
							<div class="explore-image" style="background-image: url('/images/explore_by_people.jpg')"></div>
							People
							<br />
							<span v-if="tag_groups['people']">{{ tag_groups["people"].data.length }} results</span>
						</a>
					</div>
					<div class="swiper-slide">
						<a href="/empires-and-nations/">
							<div class="explore-image" style="background-image: url('/images/explore_by_empirenation.jpg');"></div>
							Empires and Nations
							<br />
							<span v-if="tag_groups['2empires_and_nations']">{{tag_groups["2empires_and_nations"].data.length}} results</span>
						</a>
					</div>
					<div class="swiper-slide">
						<a href="/explore/4features-2/">
							<div class="explore-image" style="background-image: url('/images/explore_by_cartouche.jpg');"></div>
							Cartouches
							<br />
							<span v-if="tag_groups['4features']">{{tag_groups["4features"].data[2].solr_ids_array.length}} results</span>
						</a>
					</div>
					<div class="swiper-slide">
						<a href="/explore/4features-5/">
							<div class="explore-image" style="background-image: url('/images/explore_by_animals.jpg');"></div>
							Animals
							<br />
							<span v-if="tag_groups['4features']">{{tag_groups["4features"].data[5].solr_ids_array.length}} results</span>
						</a>
					</div>
					<div class="curated-themes-swiper-pagination"></div>
				</div>
			</div>
			<div class="curated-themes-swiper-button-next swiper-button-next"></div>
			<div class="curated-themes-swiper-button-prev swiper-button-prev"></div>
		</div>

		<div :class="['explore-by explore-by-outer explore-by-timelines', { 'explore-by-timelines-active': show_pane }]">
			<div class="explore-by-header">
			<h2>Explore by Timelines</h2>
			<ul class="explore-by-tags">
				<li v-for="(era, era_year) in timeline_eras" :key="era_year">
					<a @click="scrollTo(era_year)" :class="[{ active: show_era == era_year }]" >{{ era.era }}</a>
				</li>
			</ul>
			</div>
			<div class="timeline-years" @scroll.passive="timelineScroll()" v-if="ready && !is_mobile">
				<!-- if it's NOT mobile -->
				<div class="years">
					<div class="year" :id="'year-' + year" :key="year" v-for="(index, year) in maps_by_years" >
						<div class="year-orient" :id="'year-orient-' + year">
							<div class="era" v-if="timeline_eras[year]">
								<div class="era-headline">
									{{ timeline_eras[year].era }} &nbsp;
									<span class="era-years">{{ timeline_eras[year].era_start_year }} - {{ timeline_eras[year].era_end_year }}</span>
								</div>
								<img class="era-image" :src="timeline_eras[year].background_image" loading="lazy" />
								<div class="era-text" v-html="timeline_eras[year].era_description"></div>
							</div>
						</div>
						<div class="year-text">{{ year }}</div>
						<div class="map-count">
							<template v-if="maps_by_years[parseInt(year)].length">
								<a @click="openDrawer(maps_by_years[parseInt(year)])" class="tooltip">
									<div class="top">
									{{ maps_by_years[parseInt(year)].length }} Map<template v-if="maps_by_years[parseInt(year).length + 1] != 1">s</template>
									in {{ parseInt(year) }}<i></i>
									</div>
									{{ maps_by_years[parseInt(year)].length }}
								</a>
							</template>
							<template v-else><span>0</span></template>
						</div>

						<div class="event-group">
							<details class="event" v-for="(event, index) in timeline_events[year]" :key="index">
								<summary class="event-name">
									<div class="event-right">
										<div v-if="event.solr_ids_array" class="map-count">
											<a @click="openDrawer(event.solr_ids_array)" class="tooltip">
											<div class="top">
												{{ event.solr_ids_array.length }} Related Maps<i></i>
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
			<div class="timeline-years" @scroll.passive="timelineScroll()" v-if="ready && is_mobile">
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
						<img class="era-image" :src="timeline_eras[year].background_image" loading="lazy" />
						<div class="era-text" v-html="timeline_eras[year].era_description"></div>
					</div>
				</div>
				<div class="year" :id="'year-' + year">
				<div class="year-text" :class="{ 'no-border': timeline_eras[parseInt(year) + 1] }">
					{{ year }}
				</div>
				<div class="event-group" v-if="timeline_events[year]">
					<details class="event" v-for="(event, index) in timeline_events[year]" :key="index">
						<summary class="event-name">
							<div class="event-right">
								<div v-if="event.solr_ids_array" class="map-count">
									<a @click="openDrawer(event.solr_ids_array)" class="tooltip">
									<div class="top">
										{{ event.solr_ids_array.length }} Related Maps<i></i>
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

		<div class="explore-by explore-by-outer explore-by-facets" v-if="ready == true">
			<div class="explore-by-header">
			<h2>Explore by Facets</h2>
			<ul class="explore-by-tags">
				<template v-for="(tag_group, index) in tag_groups">
					<li :key="index" v-if="index != 'institution_name_ssi' && index != 'years' && index != 'exhibits' && index != 'people'">
						<a @click="clickFacet(index)" :class="[{ active: show_facet == index }]" >{{ tag_group.show_name }}</a>
					</li>
				</template>
			</ul>
			</div>
			<template v-for="(tag_group, index) in tag_groups">
				<div :key="index" v-if="show_facet == index && index != 'institution_name_ssi' && index != 'exhibits' && index != 'years'">
					<!-- NOT mobile -->
					<div :class="['swiper facets-' + index.split('_').join('-') + '-swiper',]">
						<div class="swiper-wrapper">
							<div v-for="(tag, tag_index) in tag_groups[index].data" :key="tag_index" class="swiper-slide explore-slide">
								<a :href="'/explore/' + index + '-' + tag_index + '/'">
									<div class="explore-image" :style="'background-image: url(\'' + (tag.image ? tag.image : 'tag_groups[index].show_image') + '\');'"></div>
									<template v-if="tag.show_name">{{ tag.show_name }}</template><template v-else>{{ tag.name }}</template>
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
					<a @click="openDrawer(tag.solr_ids_array)" v-for="(tag, tag_index) in tag_groups.institution_name_ssi.data" :key="tag_index" class="swiper-slide explore-slide">
					<img :src="tag.image" loading="lazy" /><br />
					{{ tag.name }}<br />
					<a class="button-like primary">See {{ tag.count }} maps</a>
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
			<FrontpageMap title="Explore by Maz" :maps="maps" />
			</div>
		</div>

		</div>
	</div>
</template>

<style>
@import '../static/assets/ol.css';
@import '../static/assets/homepage-map.css';
</style>

<script>
import home_data from "~/data/home_data.json";
import Drawer from "~/components/drawer.vue";
import StoriesSwiper from '~/components/storiesSwiper.vue';
import FrontpageMap from "~/components/FrontpageMap.vue";

export default {
	name: "IndexPage",
	components: {
		Drawer,
		StoriesSwiper,
		FrontpageMap
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
			// results
			map_filter_results: [],
			// drawer_results_visible: [], //['commonwealth:hx11z473s', 'commonwealth:hx11z475b', 'commonwealth:hq37vv62q', 'commonwealth:hx11z4717'],
			// map_vector_layers: [],
			// windowWidth: window.innerWidth,
			map_html_icon: null,
			// mi_to_m_factor: 1609.34,
			layersByID: {},
			mapPopup: null,
		};
	},
	beforeMount() {
		// this.map_form.sizes = ["L", "XL", "M", "S", "A"];
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
		openDrawer(which_maps) {
			// emit open_drawer in footer
			this.$root.$emit('open_drawer', this.maps, which_maps) //like this
		},
		resize: function () {
			this.is_mobile = window.innerWidth <= 768;
		},
		getData: function (which_address) {
			this.$nextTick(() => {
				//TODO: maybe change how exactly the ready works: v-show or :class instead of v-if?
				this.ready = true; // prevent painting before data is available
				this.$nextTick(() => {
					this.setupSlider(); //once ready
				});
			});
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
	},
};
</script>
