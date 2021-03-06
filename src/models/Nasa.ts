
import moment, {Moment} from 'moment';

export default class Nasa {
	public id: number;
	public mass: string;
	public year: Moment;

	constructor(options: {
		id?: number;
	 	mass?: string;
		year?: Moment;
	} = {}){
		this.id = options.id || 0;
		this.mass = options.mass || '';
		this.year = options.year || moment();
	}
}