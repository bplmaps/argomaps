# argo

## Building locally

To run a live development server (client-rendered): `npm run dev`

To build locally with a full build chain, including a traverse of Collections API for all objects: `npm run generate`

To build locally with a client-rendered build chain, _skipping_ a traverse of Collections API for all objects: `npm run generate-staging`

## Continous integration

All pushes to `master` are immediately deployed to https://argo-staging.netlify.app, which executes `npm run generate-staging` (i.e., no Collections API scrape)

Manual deployment is set up to Netlify at https://www.argomaps.org, using `npm run generate` (with Collections API scrape)
