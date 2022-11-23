importScripts("https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@main/dist/en/v7.0.0/legacy/ol.js");     
// importScripts("https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@main/dist/en/v7.0.0/legacy/ol.js");     
onmessage = (message) => {
    console.log('Message received from main script', message, typeof mapCircle );
    console.log(this);
    workerResult = {data: []};
    postMessage(workerResult);
}