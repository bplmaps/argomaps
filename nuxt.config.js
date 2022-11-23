export default {
	// Target: https://go.nuxtjs.dev/config-target
	target: 'static',

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'argo',
		htmlAttrs: {
		lang: 'en'
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' },
			{ name: 'format-detection', content: 'telephone=no' },
			{
				hid: 'description',
				name: 'description',
				content: 'Leveraging new technology and the recent drive by many museums, libraries, and archives to digitize their collections, the portal will collate digitized maps of North America made between 1750 and 1800 into a single user-friendly portal.'
			},
			{ hid: 'og:title', name: 'og:title', content: 'this.project.title' },
			{ hid: 'og:image', name: 'og:image', content: 'this.project.image' },
			{ hid: 'og:url', name: 'og:url', content: 'this.project.url' },
		],
		link: [
			{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
			{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
			{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap' },
			{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700' },
			{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;700' },
			{ rel: 'stylesheet', href: '/assets/swiper-bundle.min.css' },
			{ rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@main/dist/en/v7.0.0/legacy/ol.css' },
			{ rel: 'stylesheet', href: '/assets/main.css' },
			{ rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.8.1/css/all.css', integrity: 'sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf', crossorigin: 'anonymous' },
			{ rel: 'stylesheet', href: '/assets/tify.css' }
		],
		script: [
			{ type: 'text/javascript', src: '/assets/swiper-bundle.min.js', body: true },
			{ type: 'text/javascript', src: 'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@main/dist/en/v7.0.0/legacy/ol.js', body: true },
		]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
		// '/assets/main.css',
	],
	//generate: { fallback: '404.html' },

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		// { src: '~/plugins/swiper-bundle.min.js', mode: 'client' }
		{ src: "~/plugins/tify", mode: "client" }, // create plugin.js in plugins dir
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
	],

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
	}
}
