import { Map } from 'esri-mods';

export default class MapService {
  map: String;
  search: String;
  constructor() {
	this.map = new Map({
		basemap: 'streets'
	});
  }
}
