import Controller from '@ember/controller';
import mapboxgl from 'mapbox-gl';
import config from '../config/environment';
import { APIROUTES } from '../routes/api-endpoints';
import axios from 'axios';

export default class HomeController extends Controller {
    // export default Ember.Controller.extend({
    selectedCordinates = null;
    isShowingModal = false;

    constructor() {
        super();
        let selectedCordinates = localStorage.getItem('selectedCordinates');
        if (selectedCordinates) {
            localStorage.removeItem('selectedCordinates');
        }
    }

    actions = {
        delete(item) {
            console.log(item)
        },

        toggleModal(flag = '', item = {}) {
            this.toggleProperty('isShowingModal');
            if (flag === 'add') {
                setTimeout(() => {
                    let selectedCordinates = localStorage.getItem('selectedCordinates');
                    if (selectedCordinates) {
                        selectedCordinates = JSON.parse(selectedCordinates);
                        console.log(selectedCordinates);
                    }
                }, 500);
            } else if (flag === 'edit') {
                console.log(item)
                this.titleValue = item.title;
            }
        },

        add() {
            let selectedCordinates = JSON.parse(localStorage.getItem('selectedCordinates'));
            const coordinates = { "type": 'Point', "coordinates": [selectedCordinates.lng, selectedCordinates.lat] };
            const payload = {
                "point": {
                    "title": this.titleValue,
                    "coordinates": JSON.stringify(coordinates)
                }
            }
            // console.log(payload);
            // return
            axios({
                method: 'post',
                url: config.API.baseUrl + config.API.apiVersion + APIROUTES.points,
                data: payload
            }).then(res => {
                console.log(res)
            }).catch(err => console.log(err));
        }
    }

    async renderMap() {
        const url = config.API.baseUrl + config.API.apiVersion + APIROUTES.points;
        axios.get(url).then((res) => {
            if (res.status === 200) {
                const points = [...res.data];
                mapboxgl.accessToken = config.mapbox.accessToken;
                const map = new mapboxgl.Map({
                    container: 'map', // container ID
                    style: config.mapbox.map.style, // style URL
                    center: config.mapbox.map.center, // starting position [lng, lat]
                    zoom: config.mapbox.map.zoom // starting zoom
                });

                map.on('click', function (e) {
                    this.selectedCordinates = e.lngLat;
                    localStorage.setItem('selectedCordinates', JSON.stringify(this.selectedCordinates));
                });
                for (let i = 0; i < points.length; i++) {
                    let marker = new mapboxgl.Marker()
                        .setLngLat(points[i].coordinates)
                        // .setPopup(new mapboxgl.Popup().setHTML("<div>" + points[i].title + "</div>"))
                        .addTo(map);
                }
            }
        }).catch(err => console.log(err));
    }
}