import Controller from '@ember/controller';
import mapboxgl from 'mapbox-gl';
import config from '../config/environment';

// export default class HomeController extends Controller {
export default Ember.Route.extend({
    t: 10,

    init: function() {
        // this._super();
        // setTimeout(() => {
        //     console.log(this.get('mapData'));
        // }, 3000);
    },

    // model: function() {
    //     var entries = this.get('mapData');
    //     console.log(entries)
    // },

    async renderMap() {
        const response = await fetch('https://glacial-scrubland-15511.herokuapp.com/api/v1/points');
		let data = await response.json();
		mapboxgl.accessToken = config.mapbox.accessToken;
		const map = new mapboxgl.Map({
			container: 'map', // container ID
			style: config.mapbox.map.style, // style URL
			center: config.mapbox.map.center, // starting position [lng, lat]
			zoom: config.mapbox.map.zoom // starting zoom
		});
		// map.addControl(
		// 	new MapboxGeocoder({
		// 		accessToken: mapboxgl.accessToken,
		// 		mapboxgl: mapboxgl
		// 	})
		// );

		map.on('click', function (e) {
			this.selectedCordinates = e.lngLat;
			console.log(this.payload);
		});
		for (let i = 0; i < data.length; i++) {
			let marker = new mapboxgl.Marker()
				.setLngLat(data[i].coordinates)
				// .setPopup(new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>"))
				.addTo(map);
		}
	}
});