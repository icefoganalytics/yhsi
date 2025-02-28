import http from '@/apis/http-client';

const designationTypesUrl = '/api/designation-types';

export default {
	getAll() {
		return http
			.get(designationTypesUrl)
			.then((response) => response.data)
			.catch(console.error);
	},
};
