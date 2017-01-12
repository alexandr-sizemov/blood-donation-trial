export class Donor {
	constructor(
		public firstName: string,
		public lastName: string,
		public telephone: string,
		public email: string,
		public bloodGroup: string
	) {
		this.firstName = firstName || '';
		this.lastName = lastName || '';
		this.telephone = telephone || '';
		this.email = email || '';
		this.bloodGroup = bloodGroup || '';
	}
}