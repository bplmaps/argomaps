export default {
	// Target: https://go.nuxtjs.dev/config-target
	target: 'static',

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'ARGO · American Revolutionary Geographies Online',
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
				content: 'Discover the historical geography of the American Revolutionary War era through maps, rich interpretive essays, and interactives. · A project of the Leventhal Map & Education Center at the Boston Public Library and the Washington Library at Mount Vernon.'
			},
			{ hid: 'og:title', name: 'og:title', content: 'ARGO · American Revolutionary Geographies Online' },
			{ hid: 'og:image', name: 'og:image', content: 'https://iiif.digitalcommonwealth.org/iiif/2/commonwealth:w9505r968/250,72,15744,9720/,1200/0/default.jpg' },
			{ hid: 'og:url', name: 'og:url', content: 'https://www.argomaps.org' },
		],
		link: [
			{ rel: 'preconnect', href: 'https://use.typekit.net' },
			{ rel: 'preconnect', href: 'https://rsms.me/' },
			{ rel: 'stylesheet', href: 'https://use.typekit.net/rok7eea.css' },
			{ rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
			{ rel: 'stylesheet', href: '/assets/swiper-bundle.min.css' },
			{ rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@main/dist/en/v7.0.0/legacy/ol.css' },
			{ rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.8.1/css/all.css', integrity: 'sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf', crossorigin: 'anonymous' },
		],
		script: [
			{ type: 'text/javascript', src: '/assets/swiper-bundle.min.js', body: true },
			{ type: 'text/javascript', src: 'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@main/dist/en/v7.0.0/legacy/ol.js', body: true },
		]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
		'~/static/assets/styles/main.css',
	],
	generate: { 
		'concurrency': 75,
		'interval': 300
	 },

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		// { src: '~/plugins/swiper-bundle.min.js', mode: 'client' }
		'@/plugins/ga',
		{ src: "~/plugins/tify", mode: "client" }, // create plugin.js in plugins dir
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		'@nuxt/postcss8'
	],

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		postcss: {
			plugins: {
			  tailwindcss: {},
			  autoprefixer: {},
			}
		  }
	}
}
