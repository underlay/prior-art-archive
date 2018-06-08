import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';

require('./searchResult.scss');

const propTypes = {
	data: PropTypes.object,
	isLoading: PropTypes.bool,
};
const defaultProps = {
	data: {},
	isLoading: false,
};

const SearchResult = function(props) {
	if (props.isLoading) {
		return (
			<div className={'search-result-wrapper loading'}>
				<div className={'title pt-skeleton'} />
				<div className={'description pt-skeleton'} />
				<div className={'date pt-skeleton'} />
			</div>
		);
	}
	const title = props.data.title || [];
	const url = props.data.url || [];
	const teaser = props.data.teaser || [];
	const copyright = props.data.copyright || [];
	const cpcCodes = props.data.cpccodes || [[]];
	let uploadDate;
	let publicationDate;

	try {
		/* Safari has a problem with dates formatted as such:
		"2016-02-23T11:57:43-0500" or "2016-02-23T16:57:43.000+0000"
		It seems the trailing timezone data causes an error. So - simply try to strip that
		And if it fails, don't render that associated date.
		*/
		uploadDate = props.data.uploadDate[0].replace(/[+-]{1}[0-9]{4}$/, '');
		publicationDate = props.data.publicationDate[0].replace(/[+-]{1}[0-9]{4}$/, '');
	} catch (err) {
		console.log('Invalid Date');
	}
	const source = props.data.source || [];
	const formattedUrl = url[0].replace('https://www.underlaycdn.net', 'https://www.priorartarchive.org/content');
	return (
		<div className={'search-result-wrapper'}>
			<div className={'title'}>
				<a href={formattedUrl}>
					{title[0]}
				</a>
			</div>
			<div className={'url'}>{formattedUrl}</div>
			<div className={'description'}>
				<div dangerouslySetInnerHTML={{ __html: teaser[0] }} />
			</div>
			<div className={'source'}>Source: {source[0]}</div>
			{uploadDate &&
				<div className={'date'}>Uploaded: {dateFormat(uploadDate, 'mmmm dS, yyyy')}</div>
			}
			{publicationDate &&
				<div className={'date'}>Published: {dateFormat(publicationDate, 'mmmm dS, yyyy')}</div>
			}
			{copyright[0] &&
				<div className={'date'}>©{copyright[0]}</div>
			}
			{cpcCodes[0][0] &&
				<div className="cpc-codes">
					<span>CPC Codes:</span>
					{cpcCodes[0].map((code)=> {
						return <span key={code} className="pt-tag pt-minimal">{code}</span>;
					})}
				</div>
			}
		</div>

	);
};

SearchResult.propTypes = propTypes;
SearchResult.defaultProps = defaultProps;
export default SearchResult;
