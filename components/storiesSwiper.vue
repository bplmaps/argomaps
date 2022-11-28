<template>

<div class="explore-by curated-stories-slider">
        <h2>Explore by Stories</h2>
        <div class="swiper curated-stories-swiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="story in storiesArray" v-bind:key="story.url">
              <a :href="story.url">
                <div
                  class="swiper-image"
				  :style="{ backgroundImage: 'url(' + story.image + ')' }"
                ></div>
                <p>{{story.text}}</p>
              </a>
            </div>
            
          </div>
          <div class="curated-stories-swiper-pagination"></div>
        </div>
        <div
          class="curated-stories-swiper-button-next swiper-button-next"
        ></div>
        <div
          class="curated-stories-swiper-button-prev swiper-button-prev"
        ></div>
      </div>

</template>




<script>
export default {
	data () {
		return {
			storiesArray: [
				{text: "The Forgotten Theater of the American Revolution", "url": "/story-forgotten-theater/", "image": "/images/stories_forgotten_theater.jpg" },
				{text: "Mapping the American Revolution", "url": "/explore/exhibits-0/", "image": "/content/campaigns/facets_29_image_compress_100.jpg" },
				{text: "George Washington's Maps", "url": "/explore/exhibits-1/", "image": "/content/campaigns/facets_28_image_compress_100.jpg" },
			]
		}
	}
}
</script>
