import {h, Component}					from 'preact/preact';
import ContentCommonBody				from 'com/content-common/common-body';
import UIButton							from 'com/ui/button/button';

import $File							from 'shrub/js/file/file';

export default class ContentItemFiles extends Component {
	constructor(props) {
		super(props);
        this.onUpload = this.onUpload.bind(this);
	}

    onUpload( e ) {
		let {node, user} = this.props;

        if ( !user || !user.id )
            return null;

        if ( e.target.files && e.target.files.length ) {
            let file = e.target.files[0];

            return $File.RequestUpload(user.id, node.id, 0, file)
                .then( r => {
                    return $File.Upload(r, file);
                })
                .catch(err => {
                    this.setState({'error': err});
                });
        }
    }

    render(props, state) {
        return (
        <ContentCommonBody class="-files -body">
            <div class="-label">Files List</div>
            <label>
                <input type="file" name="file" style="display: none;" onchange={this.onUpload} />
                <UIButton>Upload</UIButton>
            </label>
        </ContentCommonBody>
        );
    }
}
