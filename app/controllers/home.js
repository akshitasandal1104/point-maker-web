import Controller from '@ember/controller';
import mapboxgl from 'mapbox-gl';
import config from '../config/environment';
import { APIROUTES } from '../routes/api-endpoints';
import axios from 'axios';


export default class HomeController extends Controller {
    // export default Ember.Controller.extend({
    selectedCordinates = null;
    isShowingModal = false;
    titleErr = false;
    flag = '';
    selectedItem = {};

    constructor() {
        super();
        let selectedCordinates = localStorage.getItem('selectedCordinates');
        if (selectedCordinates) {
            localStorage.removeItem('selectedCordinates');
        }
    }

    actions = {
        delete(item) {
            const url = config.API.baseUrl + config.API.apiVersion + APIROUTES.points + '/' + item.id;
            axios({
                method: 'delete',
                url: url,
            }).then(res => {
                console.log(res)
                if (res.status === 200) {
                    window.location.reload();
                }
            }).catch(err => console.log(err));
        },

        toggleModal(flag = '', item = {}) {
            this.toggleProperty('isShowingModal');
            if (flag === 'add') {
                this.flag = flag;
                setTimeout(() => {
                    let selectedCordinates = localStorage.getItem('selectedCordinates');
                    if (selectedCordinates) {
                        selectedCordinates = JSON.parse(selectedCordinates);
                    }
                }, 250);
            } else if (flag === 'edit') {
                this.flag = flag;
                this.titleValue = item.title;
                this.selectedItem = item;
            }
        },

        submit() {
            if (!this.titleValue) {
                this.toggleProperty('titleErr');
                this.titleErr = true;
                return;
            }
            let selectedCordinates = JSON.parse(localStorage.getItem('selectedCordinates'));
            let payload;
            let method;
            let url;
            debugger
            if (this.flag === 'add') {
                const coordinates = { "type": 'Point', "coordinates": [selectedCordinates.lng, selectedCordinates.lat] };
                payload = {
                    "point": {
                        "title": this.titleValue,
                        "coordinates": JSON.stringify(coordinates)
                    }
                };
                method = 'post';
                url = config.API.baseUrl + config.API.apiVersion + APIROUTES.points;
            } else {
                payload = {
                    "point": {
                        "title": this.titleValue,
                    }
                };
                method = 'patch';
                url = config.API.baseUrl + config.API.apiVersion + APIROUTES.points + '/' + this.selectedItem.id;
            }
            axios({
                method: method,
                url: url,
                data: payload
            }).then(res => {
                if (res.status === 201 || res.status === 200) {
                    this.toggleProperty('isShowingModal');
                    window.location.reload();
                }
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