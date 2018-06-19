/* eslint-disable max-len */
import React from 'react';

require('./contributions.scss');

const Contributions = function() {
	return (
		<div className={'contributions-wrapper'}>
			<div className={'container narrow'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<h1>Contribution Guidelines</h1>

						<p>Contribute only those documents which are technical in nature and will aid USPTO to make inform decision in granting or rejecting patents. </p>

						<p><b>File formats supported:</b></p>
						<ul>
							<li>Word</li>
							<li>Pdf, Images</li>
							<li>Web pages</li>
							<li>Excel</li>
							<li>Text</li>
							<li>Video</li>
						</ul>

						<p><b>Metadata Requirements:</b></p>
						<ul>
							<li>Title</li>
							<li>Description</li>
							<li>Creation Date</li>
							<li>Publication Date</li>
							<li>Modification Date</li>
							<li>Copyright</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contributions;
