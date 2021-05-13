import Route from '@ember/routing/route';
import config from '../config/environment';
import { APIROUTES } from '../routes/api-endpoints';
import axios from 'axios';

// export default class HomeRoute extends Route {
export default Ember.Route.extend({

	// model: function () {
	// 	return this.get('mapData');
	// },

	async model() {
		const url = config.API.baseUrl + config.API.apiVersion + APIROUTES.points;
		let response = await axios.get(url).then((res) => {
			if (res.status === 200) {
				this.set('mapData', res.data);
				return res.data;
			}
		}).catch(err => console.log(err));
		return response;
	},

	setupController: function(controller, model) {
		this._super(controller, model);
		controller.set('mapData', model);
	},

	detectController: function () {}.observes('setupController').on('init')
})