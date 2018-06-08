const AWS = require('aws-sdk');
const parse = require('parse-head');
const tmp = require('tmp');
const crypto = require('crypto');
const request = require('request-promise');
const fs = require('fs');
const exiftool = require('node-exiftool');
const exiftoolBin = require('dist-exiftool');

const isDev = false;
const apiUrl = isDev
	? 'http://localhost:9876'
	: 'https://api.priorartarchive.org';

/* Get reference to S3 client */
const s3 = new AWS.S3();

exports.parseMetaAndInsert = function(event, context, callback) {
	/* Validate file size */
	if (event.Records[0].s3.object.size === 0) {
		return callback(null, '0 Size');
	}

	/* Validate Extension */
	const objectKey = event.Records[0].s3.object.key.replace(/\+/g, ' ');
	/* We seem to have a bug where spaces in objectKeys are passed in as + signs. */
	/* Seems like the opposite https://forums.aws.amazon.com/thread.jspa?threadID=55746 */

	const extension = objectKey.split('.').pop().toLowerCase();
	const allowedExtensions = ['html', 'htm', 'pdf'];
	if (allowedExtensions.indexOf(extension) === -1) {
		return callback(null, 'Invalid Extension');
	}

	/* Build object params */
	const newFolderName = crypto.randomBytes(4).toString('hex');
	const companySlug = isDev ? 'cisco' : event.Records[0].s3.object.key.split('/')[0];
	const s3SftpParams = {
		Bucket: 'prior-art-archive-sftp',
		Key: objectKey,
	};
	console.log('ObjectKey is ', objectKey);

	return new Promise((resolve, reject)=> {
		/* Generate hash of S3 file */
		const hash = crypto.createHash('md5');
		const stream = s3.getObject(s3SftpParams).createReadStream();

		stream.on('data', (data) => {
			hash.update(data);
		});

		stream.on('end', () => {
			const digest = hash.digest('hex');
			resolve(digest);
		});
		stream.on('error', (err) => {
			reject(err);
		});
	})
	.then((hash)=> {
		/* Check to make sure that file does not already */
		/* exist in the systemusing the generated hash   */
		const getExistingAsset = request({
			uri: `${apiUrl}/assets?hash=${hash}`,
			json: true,
		});
		const getCompany = request({
			uri: `${apiUrl}/companies?slug=${companySlug}`,
			json: true,
		});
		return Promise.all([hash, getExistingAsset, getCompany]);
	})
	.then(([hash, existingAssetData, companyData])=> {
		if (existingAssetData) { throw new Error('Asset already exists with hash ', hash, ' sourcePath: ', objectKey); }
		if (!companyData) { throw new Error(`Company '${companySlug}' does not exist`); }

		/* Extract metadata from file */
		const generateMetadata = new Promise((resolve, reject)=> {
			const tmpobj = tmp.fileSync();
			const tempFile = fs.createWriteStream(tmpobj.name);
			s3.getObject(s3SftpParams).createReadStream().pipe(tempFile);
			tempFile.on('finish', ()=> {
				tempFile.close(()=> {
					/* HTML */
					if (extension === 'html' || extension === 'htm') {
						fs.readFile(tmpobj.name, 'utf8', function (err, data) {
							if (err) { console.log(err); }
							parse(data).then(function(tags) {
								const metadata = {};
								tags.forEach((tag)=> {
									if (tag.nodeName.toLowerCase() === 'meta' && tag.name) {
										metadata[tag.name.toLowerCase()] = tag.content;
									} else {
										metadata[tag.nodeName.toLowerCase()] = tag.innerText;
									}
								});
								resolve(metadata);
							});
						});
					}

					/* PDF */
					if (extension.toLowerCase() === 'pdf') {
						const ep = new exiftool.ExiftoolProcess(exiftoolBin);

						ep.open()
						.then(() => ep.readMetadata(tmpobj.name, ['-File:all']))
						.then((data, err) => {
							if (err) {
								console.log(err);
								callback(null, 'Error 1');
							}
							const pdfData = data.data[0];
							const metadata = {};
							Object.keys(pdfData).forEach((key)=> {
								metadata[key.toLowerCase()] = pdfData[key];
							});

							resolve(metadata);
						})
						.then(() => ep.close());
					}
				});
			});
		});
		return Promise.all([hash, companyData, generateMetadata]);
	})
	.then(([hash, companyData, metadata])=> {
		const copyObject = new Promise((resolve, reject)=> {
			s3.copyObject({
				Bucket: 'www.underlaycdn.net',
				Key: `${newFolderName}/${hash}.${extension}`,
				CopySource: `prior-art-archive-sftp/${objectKey}`,
				ACL: 'public-read',
			}, (err, data)=> {
				if (err) { reject(err); }
				resolve(data);
			});
		});

		return Promise.all([hash, companyData, metadata, copyObject]);
	})
	.then(([hash, companyData, metadata])=> {
		const dateString = metadata.pushdate || metadata.date || metadata.uploaddate;
		const createAsset = request({
			method: 'POST',
			uri: `${apiUrl}/assets`,
			json: true,
			body: {
				url: `https://www.underlaycdn.net/${newFolderName}/${hash}.${extension}`,
				originalFilename: objectKey.replace(`${companySlug}/`, ''),
				title: metadata.title,
				description: metadata.description,
				datePublished: Date.parse(dateString) ? new Date(dateString) : undefined,
				md5Hash: hash,
				companyId: companyData.id,
				sourcePath: objectKey,
			},
		});
		return Promise.all([companyData, createAsset]);
	})
	.then(([companyData, newAsset])=> {
		const kafkaObject = {
			url: newAsset.url,
			fileId: newAsset.md5Hash,
			title: newAsset.title,
			description: newAsset.description,
			dateUploaded: newAsset.createdAt,
			datePublished: newAsset.datePublished,
			companyId: companyData.id,
			companyName: companyData.name,
			sourcePath: newAsset.sourcePath,
		};
		return request({
			method: 'POST',
			uri: `${apiUrl}/assets/kafka`,
			json: true,
			body: kafkaObject,
		});
	})
	.then(()=> {
		return callback(null, 'Success!');
	})
	.catch((err)=> {
		console.log('Error on event: ', event);
		console.log('Error on objectKey: ', objectKey);
		console.log('Error', err);
		return callback(err, null);
	});
};
