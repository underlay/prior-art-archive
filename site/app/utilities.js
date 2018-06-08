export const apiUrlPrefix = function() {
	let urlPrefix = ' https://prior-art-archive-api-prod.herokuapp.com';
	if (window.location.origin.indexOf('dev.priorartarchive.org') > -1) {
		urlPrefix = ' https://prior-art-archive-api-dev.herokuapp.com';
	}
	if (window.location.origin.indexOf('localhost:') > -1) {
		urlPrefix = 'http://localhost:9876';
	}
	return urlPrefix;
};

export const searchFetch = function(opts) {
	const searchRoute = 'https://docker-usptofe.herokuapp.com/rest/esresults';

	return fetch(searchRoute, opts)
	.then((response)=> {
		if (!response.ok) {
			return response.json().then((err)=> { throw err; });
		}
		return response.json();
	});
};

export const apiFetch = function(path, opts) {
	const urlPrefix = apiUrlPrefix();
	const finalRoute = `${urlPrefix}${path}`;

	return fetch(finalRoute, {
		...opts,
		credentials: 'include',
	})
	.then((response)=> {
		if (!response.ok) {
			return response.json().then((err)=> { throw err; });
		}
		return response.json();
	});
};

export function generateHash(length) {
	const tokenLength = length || 32;
	const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

	let hash = '';
	for (let index = 0; index < tokenLength; index++) {
		hash += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return hash;
}

export function s3Upload(file, progressEvent, finishEvent, index) {
	function beginUpload() {
		const folderName = window.location.hostname !== 'localhost' && window.location.hostname !== 'dev.pubpub.org'
			? generateHash(8)
			: '_testing';

		const extension = file.name !== undefined ? file.name.substr((~-file.name.lastIndexOf('.') >>> 0) + 2) : 'jpg';

		// const filename = folderName + '/' + new Date().getTime() + '.' + extension;
		const filename = folderName + '/' + (Math.floor(Math.random() * 8)) + new Date().getTime() + '.' + extension;
		const fileType = file.type !== undefined ? file.type : 'image/jpeg';
		const formData = new FormData();

		formData.append('key', filename);
		formData.append('AWSAccessKeyId', 'AKIAJQ5MNLCTIMY2ZF7Q');
		formData.append('acl', 'public-read');
		formData.append('policy', JSON.parse(this.responseText).policy);
		formData.append('signature', JSON.parse(this.responseText).signature);
		formData.append('Content-Type', fileType);
		formData.append('success_action_status', '200');
		formData.append('file', file);
		const sendFile = new XMLHttpRequest();
		sendFile.upload.addEventListener('progress', (evt)=>{
			progressEvent(evt, index);
		}, false);
		sendFile.upload.addEventListener('load', (evt)=>{
			finishEvent(evt, index, file.type, filename, file.name);
		}, false);
		sendFile.open('POST', 'https://s3-external-1.amazonaws.com/assets.pubpub.org', true);
		sendFile.send(formData);
	}

	const getPolicy = new XMLHttpRequest();
	const urlPrefix = apiUrlPrefix();
	getPolicy.addEventListener('load', beginUpload);
	getPolicy.open('GET', `${urlPrefix}/uploadPolicy?contentType=${file.type}`);
	getPolicy.send();
}
