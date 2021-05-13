import Route from '@ember/routing/route';

// export default class HomeRoute extends Route {
export default Ember.Route.extend({

	// model: function () {
	// 	return this.get('mapData');
	// },

	async model() {
		const response = await fetch('https://glacial-scrubland-15511.herokuapp.com/api/v1/points');
		const data = await response.json();
		this.set('mapData', data);
		return data;
	},

	setupController: function(controller, model) {
		this._super(controller, model);
		controller.set('mapData', model);
	},

	detectController: function () {}.observes('setupController').on('init')
})