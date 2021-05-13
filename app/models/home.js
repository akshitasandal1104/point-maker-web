import Model from '@ember-data/model';

export default class HomeDataModel extends Model {
    @attr('string') title;
    @attr('array') coordinates;
    @attr('number') id;
}
