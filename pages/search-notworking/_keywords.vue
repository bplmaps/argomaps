<template>

	<div class="advanced-search">
		<h1>Advanced Search {{search_url_keywords}}zz</h1>
		<form onsubmit="return false;" class="search-filter">
			<fieldset class="my-search">
				<legend>My Search</legend>
				<div class="filter-box">
					<div v-for="s_item, s_item_key in search_items" :key="s_item_key" :class="s_item.type"><span class="filter-box-text">{{s_item.show_query}} <span v-if="s_item.search_field && s_item.search_field != 'all_fields'">({{s_item.search_field}})</span></span><a @click="removeSearchItem(s_item_key)"></a></div>
					<!-- <div class="facet-years"><span class="filter-box-text">1740-1760</span><a @click="removeSearchItem('')"></a></div> -->
					<!--<div class="facet-mapscale"><span class="filter-box-text">1:20,000 - 1:5000,000</span><a @click="removeSearchItem('')"></a></div>-->
				</div>
			</fieldset>
			<fieldset class="search">
				<legend>Search</legend>
				<label class="filter-box">
					<div class="select-wrapper">
						<select id="search_fields" v-model="search_form.search_fields">
							<option value="all_fields">All fields</option>
							<option value="creator">Creator</option>
							<option value="title">Title</option>
							<option value="subject">Subject</option>
							<option value="place">Place</option>
						</select>
					</div>
					<input v-model="search_form.search" type="text" id="search" v-on:keyup="liveSearch" placeholder="Enter Search Items...">
					<button type="submit" @click="liveSearch('true')">Search ARGO Digital Collection</button>
				</label>
			</fieldset>
			<fieldset class="explore-facets">
				<legend>Explore By Facets</legend>

				<label class="filter-box">
					Year
					<div class="input-fields range_container">
						<div class="form_control">
							<input v-model="search_form.from_year" class="slider-text-inputs" type="number" id="startYearInput" @change="changeSearchYear"/>
							<input v-model="search_form.to_year" class="slider-text-inputs" type="number" id="endYearInput" @change="changeSearchYear" />
						</div>
						<div class="sliders_control">
							<input v-model="search_form.from_year" id="fromYearSlider" type="range" min="1740" max="1800" @change="changeSearchYear" />
							<input v-model="search_form.to_year" id="toYearSlider" type="range" min="1740" max="1800" @change="changeSearchYear" />
						</div>
					</div>
				</label>

				<!--<label class="filter-box">
					Map Scale
					<div class="input-fields range_container">
						<div class="form_control">
							<input class="slider-text-inputs" type="number" id="smallScaleInput" value="20000" min="20000" max="500000"/>
							<input class="slider-text-inputs" type="number" id="largeScaleInput" value="500000" min="20000" max="500000"/>
						</div>
						<div class="sliders_control">
							<input id="fromSlider" type="range" value="20000" min="20000" max="500000"/>
							<input id="toSlider" type="range" value="500000" min="20000" max="500000"/>
						</div>

						<! -- <input type="text" class="slider-text-inputs" id="scale_start" name="scale_start">
						<input type="text" class="slider-text-inputs" id="scale_end" name="scale_end">
						<input type="range" min="1:20,000" max="1:500,000" value="1:20,000" class="search-range" id="map_scale_range"> -->
					<!--</div>
				</label>-->

				<template v-for="tag_arr, tag_key in tag_groups">
					<label v-if="tag_key != 'years'" :key="tag_key" class="filter-box closable-filter" for="">
						{{tag_arr.show_name}}
						<div class="open-close-filter" @click="openCloseSearchFilters(tag_key);"></div>
						<div class="input-fields" v-if="!facets_closed[tag_key]">
							<label v-for="tag, tag_index in tag_arr.data" :key="tag_index">
								<input type="checkbox" :value="tag.id" v-model="search_form.facets" v-on:change="changeCheckbox">
								<span class="checkmark"></span>{{tag.name}}
							</label>
						</div>
					</label>
				</template>

			</fieldset>
		</form>
		<div class="search-results">
			<div class="search-sort">
				<h2> 
					<div class="loader" :class="{'loading': isLoading}" >{{search_start + " - " + search_end + " of " +search_total }}</div>
					<button v-if="search_can_load_more" @click="loadMore" :disabled="isLoading">Load more <!--{{this.search_page}}--></button>
				</h2>
				<label for="search_view_switch">View:</label>
				<div class="select-wrapper select-view">
					<select v-model="search_view" id="search_view_switch">
						<option value="">List</option>
						<option value="gallery-view">Gallery</option>
					</select>
				</div>
				<label for="search_sort_switch">Sort:</label>
				<div class="select-wrapper">
					<select id="search_sort_switch" v-model="search_form.sort" v-on:change="search">
						<option value="score+desc%2C+title_info_primary_ssort+asc">Relevance</option>
						<option value="title_info_primary_ssort+asc,+date_start_dtsi+asc">Title</option>
						<option value="date_start_dtsi+asc,+title_info_primary_ssort+asc">Date (asc)</option>
						<option value="date_start_dtsi+desc,+title_info_primary_ssort+asc">Date (desc)</option>
					</select>
				</div>
				<!-- <label class="filter-duplicates">
					<input name="search-duplicates" type="checkbox">
					<span class="checkmark"></span>Filter Duplicates (Stages)
				</label> -->
			</div>
			<textarea style="display:none;width: 100%; height: 100px;" v-model="url"></textarea>
			<ul :class="'results-list '+search_view">
				<!-- <li v-for="search_item, search_item_key in search_docs" :key="search_item_key">
					<div class="result-image" :style="'background-image: url(\'https://bpldcassets.blob.core.windows.net/derivatives/images/'+search_item.exemplary_image_ssi+'/image_thumbnail_300.jpg\');'"></div>
					<div class="result-text">
						<h3><a href="#">{{search_item.title_info_primary_tsi}}</a></h3>
						<p>{{search_item.title_info_primary_subtitle_tsi}}</p>
						<p class="when">{{search_item.when}}</p>
						<p class="who">{{search_item.who}}</p>
						<p class="where">{{search_item.scale}}</p>
					</div>
				</li> -->
				<li v-for="search_item, search_item_key in search_results" :key="search_item_key">
					<div class="result-image" v-if="maps[search_item]" :style="(maps[search_item].exemplary_image_ssi) ? 'background-image: url(\'https://bpldcassets.blob.core.windows.net/derivatives/images/'+maps[search_item].exemplary_image_ssi+'/image_thumbnail_300.jpg\');' : ''"></div>
					<div class="result-text" v-if="maps[search_item]">
						<h3><a :href="'/maps/'+search_item">{{maps[search_item].title_info_primary_tsi}}</a></h3>
						<p>{{maps[search_item].title_info_primary_subtitle_tsi}}</p>
						<p class="when">{{maps[search_item].date_range}}</p>
						<p class="who">{{maps[search_item].who}}</p>
						<p class="where">{{maps[search_item].scale_tsim}}</p>
					</div>
				</li>
			</ul>
		</div>
	</div>

		
</template>

<script>
import home_data from '~/data/home_data.json'
import Drawer from "~/components/drawer.vue";

export default {
	name: 'IndexPage',
	components: {
		Drawer,
	},
	asyncData ({ route }) {
		return {
			tag_groups: home_data.tag_groups,
			// maps_by_years: home_data.maps_by_years,
			// timeline_events: home_data.timeline_events,
			// timeline_eras: home_data.timeline_eras,
			// show_era: Object.keys(home_data.timeline_eras)[0],// make first one active
			search_url_keywords: route.query.q,
			maps: home_data.maps,
		}
	},
	data () {
		return {
			ready: false,
			search_form: {},
			search_items: [],
			search_total: '',
			search_docs: [],
			search_results: [],
			search_view: '',
			search_start: 0,
			search_end: 0,
			search_can_load_more: false,
			search_page: 0,
			search_total_pages: 0,

			remote_search_items: [],
			remote_search_total: '',
			remote_search_docs: [],
			remote_search_results: [],
			remote_search_start: 0,
			remote_search_end: 0,
			remote_search_can_load_more: false,
			remote_search_page: 0,
			remote_search_total_pages: 0,
			remote_search_page: 0,
			remote_search_total_pages: 0,
		
			intersect_results: [],
			
			search_perpage: 20,

			isLoading: false,
			abort_controller: null,
			search_debouncer: null,

			url: '',// test reporting only 
			hybrid_search_url: '', // for getting full live results for hybrid searches
			// interface
			facets_closed: {},
			// local maps?
			maps: {},
			// results
			drawer_results_visible: [],//['commonwealth:hx11z473s', 'commonwealth:hx11z475b', 'commonwealth:hq37vv62q', 'commonwealth:hx11z4717'],
		}
	},
	beforeMount() {
		// set up facets array to have all open to begin
		Object.keys(this.tag_groups).forEach(this_tag_group_index => {
			this.facets_closed[this_tag_group_index] = false;
		});
		// set up search form
		this.search_form.from_year = 1740;
		this.search_form.to_year = 1800;
		this.search_form.search_fields = 'all_fields';
		this.search_form.facets = [];
		this.search_form.sort = 'score+desc%2C+title_info_primary_ssort+asc';

		if (this.search_url_keywords) {
			// prefill the search box
			this.search_items.push({'query':this.search_url_keywords, 'show_query':this.search_url_keywords, 'type':'keyword', 'search_field':'all_fields', 'live_search':true, 'local_filter':false});

			// this.search_form.x = this.search_url_keywords;
		}

		this.search();
	},
	methods: {
		openCloseSearchFilters: function(which) {
			console.log('> openCloseSearchFilters:', which);
			this.facets_closed[which] = !this.facets_closed[which];
			console.log(this.facets_closed);
			this.facets_closed = JSON.parse(JSON.stringify(this.facets_closed));
		},
		liveSearch: function(event) {
			console.log('liveSearch', event);
			if ((event=='true' || event.keyCode=='13') && this.search_form.search) {
				console.log(this.search_form);
				// remvoe any current tags that don't belong
				for (let i=0;i<this.search_items.length;i++) {
					if (this.search_items[i].type == 'keyword') this.search_items.splice(i);
				}
				// pressing enter saves keyword and sends to search blacklight
				this.search_items.push({'query':this.search_form.search, 'show_query':this.search_form.search, 'type':'keyword', 'search_field':this.search_form.search_fields, 'live_search':true, 'local_filter':false});
				this.search_form.search = '';
				this.search_form.search_fields = 'all_fields';
				this.search_results = []; // clear current search results
				// this.search_page = 1; // apparently we don't need to reset the page?
				this.search();
			}
			// console.log(this.search_form.search);
		},
		removeSearchItem: function(which) {
			console.log('removeSearchItem', which, this.search_items[which]);
			// if item removed was a years facet form's reset years
			if (this.search_items[which].type == 'facet-years') {
				this.search_form.from_year = 1740;
				this.search_form.to_year = 1800;
			}
			// if item removed was a tag, uncheck any tags that don't match
			if (this.search_items[which].type == 'tag') {
				if (this.search_form.facets.indexOf(this.search_items[which].tag_id) !== -1) this.search_form.facets.splice(this.search_form.facets.indexOf(this.search_items[which].tag_id), 1)
			}
			// remove this from its own list
			this.search_items.splice(which, 1);
			// search again
			this.search_results = []; // clear current search results
			this.search();
		},
		changeSearchYear: function(which) {
			console.log('changeSearchYear', which);
			for(let i=0;i<this.search_items.length;i++) {
				console.log('type: ', this.search_items[i]);
				if (this.search_items[i].type=='facet-years') this.search_items.splice(i, 1);
			}
			this.search_items.push({'from_year':this.search_form.from_year,'to_year':this.search_form.to_year,'show_query':this.search_form.from_year+' - '+this.search_form.to_year,'type':'facet-years', 'live_search':true, 'local_filter':false});
			this.search_results = []; // clear current search results
			this.search();
		},
		changeCheckbox: function() {
			console.log('changeCheckbox', this.search_form.facets.length, this.search_form.facets);
			// remvoe any current tags that don't belong
			for (let i=0;i<this.search_items.length;i++) {
				if (this.search_items[i].type == 'tag') this.search_items.splice(i);
			}
			// go through any of the checked facets
			for (let i=0;i<this.search_form.facets.length;i++) {
				// look for name of the tag
				let name = '';
				let category = '';
				Object.keys(this.tag_groups).forEach(this_tag_group_index => {
					// console.log('::', this_tag_group_index);
					for (let j=0;j<this.tag_groups[this_tag_group_index].data.length;j++) {
						if (this.tag_groups[this_tag_group_index].data[j].id==this.search_form.facets[i]) {
							name = this.tag_groups[this_tag_group_index].data[j].name;
							category = this.tag_groups[this_tag_group_index].data[j].category;
						}
					}
				});
				// add tag to group
				let this_is_live_search = (category=='institution_name_ssi' || category=='languages') ? true : false;
				this.search_items.push({'tag_id':this.search_form.facets[i], 'show_query':name, 'tag_category':category, 'type':'tag', 'live_search':this_is_live_search, 'local_filter':!this_is_live_search});
			}
			// console.log('search_results:', maps_that_match_tags);
			this.search_results = []; // clear current search results
			this.search();
		},
		loadMore: function() {
			console.log(">loadMore");
			this.search_page++;
			this.search(true);
		},
		search: function(loadMore=false) {
			console.log('> search', loadMore, this.search_url_keywords);
			this.isLoading = true;
			let sort = '&sort='+this.search_form.sort;
			let dates = '';
			let query = ''; // &q=boston
			let search_fields = ''; // &search_field=all_fields
			let institution = ''; // &f_inclusive[institution_name_ssi][]=
			let language = ''; // &f_inclusive[institution_name_ssi][]=
			let perpage = '&per_page='+this.search_perpage; // &per_page=100
			let page = '&page=1';

			//reset page if we arent loading more 
			if(!loadMore) {
				this.search_page = 1;
				this.remote_search_page = 1;
			}
			else{
				this.remote_search_page++;
				page = '&page=' + (this.remote_search_page);
			}

			// get a list of facets we'll actually filter by
			let filter_tag_ids = [];
			let live_search_requests = false;
			let local_filter_requests = false;

			for (let i=0;i<this.search_items.length;i++) {
				if (this.search_items[i].type=='facet-years') {
					dates = '&range[date_facet_yearly_itim][begin]='+this.search_items[i].from_year+'&range[date_facet_yearly_itim][end]='+this.search_items[i].to_year;
					// console.log('dates', dates);
				}
				// console.log('.....', this.search_items[i]);
				if (this.search_items[i].search_field) { // only show text searches
					query += '&q='+this.search_items[i].query;
					search_fields = '&search_field='+this.search_items[i].search_field;
				}
				if (this.search_items[i].type == "tag") { // only show text searches
					if (this.search_items[i].tag_category == 'institution_name_ssi') {
						institution += '&f_inclusive[institution_name_ssi][]='+this.search_items[i].show_query;
					}
					if (this.search_items[i].tag_category == 'languages') {
						language += '&f_inclusive[lang_term_ssim][]='+this.search_items[i].show_query;
					}
				}

				// console.log('II', this.search_items[i].live_search);
				if (this.search_items[i].live_search) live_search_requests = true;
				if (this.search_items[i].local_filter) local_filter_requests = true;
				// we've already filtered by these
				if (this.search_items[i].tag_category == 'institution_name_ssi') continue;
				if (this.search_items[i].tag_category == 'languages') continue;
				filter_tag_ids.push(this.search_items[i].tag_id);
			}
			if (this.search_items.length==0) live_search_requests = true;
			// console.log('tag IDs', filter_tag_ids);
			console.log('do we have live search? ', live_search_requests, 'local filter?', local_filter_requests);

			//TODO: if we have a pending remote search(es), maybe we cancel and do this new one 

			if (live_search_requests) {
				// if we're merging both local and live search, we need a lot more live results
				if (local_filter_requests) perpage = '&per_page=500'; // server imposed limit: 500

				let url = 'https://collections.leventhalmap.org/search?utf8=✓&search_index[]=all_fields&query[]=&search_index[]=creator&query[]=&search_index[]=title&query[]=&op=AND&f_inclusive[collection_name_ssim][]=American+Revolutionary+War-Era+Maps+(Collection+of+Distinction)&search_field=advanced&commit=Search'
					+dates+query+search_fields+institution+language+sort+perpage+page+'&format=json';
				this.url = url;// to paint it on the screen temporarily

				//options set for case where we must do a local AND remote search
				let options = {shouldMerge: false, local_filter_requests: local_filter_requests, filter_tag_ids: filter_tag_ids, loadMore: true};

				if(!local_filter_requests){
					options.shouldMerge = false;
				}
				this.remoteSearch(url, options);	
				
			} else {
				this.localSearch(filter_tag_ids);
			}
		},
		remoteSearch: async function(url, options){
			let defaultOptions = {shouldMerge: false, local_filter_requests: false, filter_tag_ids: [], loadMore: false};
			options = {...defaultOptions, ...options};
			console.log(">remoteSearch",url, options);
			let shouldMerge = options.shouldMerge;
			let loadMore = options.loadMore;
			let local_filter_requests = options.local_filter_requests;
			let filter_tag_ids = options.filter_tag_ids;
			let loopIter = 0;
			let promises = [];

			//put the URL in a more controllable format
			let newUrl = new URL(url);
			let params = new URLSearchParams(url);

			if(!shouldMerge && !loadMore && !local_filter_requests) {
				this.search_total = "Loading Results...";
				this.remote_search_page = 1;
			}

			let debounce_delay = 200;
			let timer = 0;
			// if(this.search_debouncer != null){
			// 	console.log('clearing existing timeout');
			// 	clearTimeout(this.search_debouncer);
			// 	this.search_debouncer = null;
			// 	timer = debounce_delay;

				//also abort any existing queries we were making because they are wrong now
				if(this.abort_controller != null) {
					// this.prev_abort_controller = new AbortController();
					this.abort_controller.abort(); //set the signal to abort [immutable?]
				}
				this.abort_controller = new AbortController(); //replace the abort controller with a new one

			// } else{
				// console.log('no current timeout-->this one should run immediately')
			// }
			
			// console.log('Debouncer setup for: ', timer);
			// this.search_debouncer = setTimeout( () => { 
			// 	console.log('Debounced fxn runs');
			// }, timer);
			

			do {
				// let page = '&page='+ (this.remote_search_page ? this.remote_search_page : 1);
				console.warn("run search for page ", this.remote_search_page);
				loopIter++;
				// get results
				var removeSearchResult = await fetch(`${newUrl.origin}${newUrl.pathname}?${params.toString()}`,{
					method: 'GET',
					signal: this.abort_controller.signal,
					// headers: {"Content-Type": "application/x-www-form-urlencoded"},
					// headers: {'Content-Type': 'application/json'},
				})
				.then( response => {
					if (!response.ok) { 
						throw new Error('Network response was not ok', response);
						return;
					} else return response.json();	//fix me please and put back into javascript.json
				})			
				.then((response) => {
					console.log('search returned!', response.response.pages);
					if (response.response.pages) {
						// set up search vars to report above?
						this.remote_search_start = (response.response.pages.current_page - 1) * response.response.pages.limit_value + 1;
						// this.remote_search_page = response.response.pages.current_page;
						this.remote_search_total_pages = response.response.pages.total_pages;
						this.remote_search_total = response.response.pages.total_count + ' Results';
				
						// figure out what the last current record would be
						this.remote_search_end = response.response.pages.current_page * response.response.pages.limit_value;
						if (this.remote_search_end > response.response.pages.total_count) this.remote_search_end = response.response.pages.total_count;
						
						// can we load more?
						this.remote_search_can_load_more = (response.response.pages.next_page==null) ? false : true;

						//manage the results we got
						if(shouldMerge || loadMore){
							for (let i=0;i<response.response.docs.length;i++) {
								this.remote_search_docs.push(response.response.docs[i]); // console.log('___', this.search_docs[i]);
								this.remote_search_results.push(response.response.docs[i].id);
							}	
						} else {
							this.remote_search_docs = response.response.docs;	
							this.remote_search_results = [];
							this.intersect_results = [];
							for (let i=0;i<this.remote_search_docs.length;i++) {
								this.remote_search_results.push(this.remote_search_docs[i].id);
							}	
						}
				
						//if we have no local filters, the search results are the remote search results
						if(!local_filter_requests){
			
							this.search_docs = this.remote_search_docs;
							this.search_results = this.remote_search_results.slice( this.search_perpage * (this.search_page - 1), this.search_perpage * this.search_page);
							this.search_start = this.remote_search_start;
							this.search_page = this.remote_search_page;
							this.search_total_pages = this.remote_search_total_pages;
							this.search_total = this.remote_search_total;
							this.search_end = this.remote_search_end;
							this.search_can_load_more = this.remote_search_can_load_more;
							this.isLoading = false;
							console.log("no local search, assign results to be equal to remote", this.search_results);
						} else  {
							console.log('merging local and live results');
							this.intersectSearches(url, options); 						
						}

						return true;

					} else {
						console.log('Looks like there was a problem. Status Code: ', response.status);
						return false;
					}
				})
				.catch(function(err) {
					console.log('Fetch Error :-S', err);
					return false;
				});

				//manage promises
				promises.push(removeSearchResult);
	
				// this.remote_search_page  = (this.remote_search_page + 1)
			} 	while( false && local_filter_requests && (this.remote_search_page < this.remote_search_total_pages) && loopIter < 300 )

			Promise.all(promises).then((values) => {
				console.warn('all promises returned!', values);				
			});
			return promises; 
		},
		localSearch: function(filter_tag_ids){
			// only local filter requests, so let's just use those to populate
			// filter results if we have local checkboxes
			let maps_that_match_tags = [];
			let maps_that_match_tags_new = [];
			Object.keys(this.maps).forEach(this_map => {
				// console.log(this.maps[this_map].map_tag_ids);
				for (let i=0;i<filter_tag_ids.length;i++) {
					if (this.maps[this_map].map_tag_ids.includes(filter_tag_ids[i])) {
						// console.log('got one:', filter_tag_ids[i], this_map);
						if (!maps_that_match_tags.includes(this_map)) maps_that_match_tags.push(this_map);
					}
				}
			});
			// console.log('Maps that match:', maps_that_match_tags);
			this.search_total = maps_that_match_tags.length + ' Results';
			this.search_start = 1;
			this.search_total_pages = this.search_total / this.search_perpage;

			this.search_results = maps_that_match_tags.slice(0, this.search_perpage * this.search_page);
			// figure out what the last current record would be
			this.search_end = this.search_perpage * this.search_page;
			console.log('?? > ', this.search_end, this.search_total);
			if (this.search_end > parseInt(this.search_total)) this.search_end = this.search_total;
			// can we load more?
			this.search_can_load_more = (this.search_end <= parseInt(this.search_total));
			this.isLoading = false;

			return this.search_results;

		},
		intersectSearches: function(url, options){
			let defaultOptions = {shouldMerge: false, local_filter_requests: false, filter_tag_ids: [], loadMore: false};
			options = {...defaultOptions, ...options};
			console.log(">intersectSearches", url, options);
			
			let filter_tag_ids = options.filter_tag_ids;
			
			//put the URL in a more controllable format
			let newUrl = new URL(url);
			let params = new URLSearchParams(url);

			// filter results if we have local checkboxes
			let maps_that_match_tags = [];

			//go through local maps
			Object.keys(this.maps).forEach(this_map => {
				// go through all maps to see which local filters match
				for (let i=0;i<filter_tag_ids.length;i++) {
					if (this.maps[this_map].map_tag_ids.includes(filter_tag_ids[i])) {
						// console.log('got one:', filter_tag_ids[i], this_map);
						if (!maps_that_match_tags.includes(this_map)) maps_that_match_tags.push(this_map);
					}
				}
			});
			console.log('Live search results:', this.remote_search_results.length, this.remote_search_results);
			console.log('Internal maps the match tags:', maps_that_match_tags.length, maps_that_match_tags);

			// now actually intersect (below) and filter
			// if we have any maps that match a tag filter
			if (maps_that_match_tags.length) {
				for (let i=0;i<this.remote_search_results.length;i++) {
					if (maps_that_match_tags.indexOf(this.remote_search_results[i]) !== -1) {
						this.intersect_results.push(this.remote_search_results[i]);
					}
				}

				console.log('Intersection of internal + live:', this.intersect_results.length, this.intersect_results);

				this.search_results = this.intersect_results.slice( this.search_perpage * (this.search_page - 1), this.search_perpage * this.search_page);
				this.search_total = this.intersect_results.length + (this.remote_search_page < this.remote_search_total_pages ? "+" : '')  + ' Results';
				this.search_start = this.search_perpage * (this.search_page - 1) + 1;
				this.search_end = this.search_perpage * this.search_page;
				if (this.search_end > this.intersect_results.length) this.search_end = this.intersect_results.length;

				//if we need to get more of the maps remotely 
				if (this.intersect_results.length < this.search_perpage * this.search_page ) {
					console.log("we dont have enough results, we need to query remotely again if we can");
					options.shouldMerge = true;

					//if there more search pages other than the one we just got 
					if(this.remote_search_page < this.remote_search_total_pages) {

						//if this is the initial search, we must now initiate getting the other records
						params.set('page', this.remote_search_page + 1);
						this.remote_search_page  = (this.remote_search_page + 1);

						//get them page by page and evaluate 
						this.remoteSearch(`${newUrl.origin}${newUrl.pathname}?${params.toString()}`, options);

						//get all the other ones all at once 
						if(false){
							for(let j=2; j <= remote_search_total_pages; j++){
								//get them page by page and evaluate 
								params.set('page', j);
								let searchResultPromise = this.remoteSearch(`${newUrl.origin}${newUrl.pathname}?${params.toString()}`, options);
								promises.push(searchResultPromise);											
							}

							Promise.all(promises).then((values) => {
								console.warn('all promises returned!', values);

								
							});

						}
						
					} else{
						this.isLoading = false;
					}

				} else {
					console.log("we already have enough results, we dont need to get more just yet");
					this.isLoading = false;
				}

			}
		},
		isMobile: function() {
			// console.log('> isMobile');
			if(this.windowWidth <= 768) {
				// console.log('mobile!');
				return true;
			} else {
				// console.log('desktop!');
				return false;
			}
		},
	}
}
</script>
