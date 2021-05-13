import Component from '@ember/component';

export default Component.extend({
    // parent: Ember.inject.controller('parent'), 
	actions: {
		edit(t) {
			console.log(t)
		},

		delete(t) {
			console.log(t)
		}
	}


});