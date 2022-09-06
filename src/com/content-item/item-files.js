import {h, Component}					from 'preact/preact';
import ContentCommonBody				from 'com/content-common/common-body';
import UIButton							from 'com/ui/button/button';
import UILink							from 'com/ui/link/link';

import $File							from 'shrub/js/file/file';

export default class ContentItemFiles extends Component {
	constructor(props) {
		super(props);
        this.onUpload = this.onUpload.bind(this);
        this.onUploadAndEmbed = this.onUploadAndEmbed.bind(this);
	}

    onUpload( e ) {
		let {node, user} = this.props;

        if ( !user || !user.id || !node )
            return null;

        if ( e.target.files && e.target.files.length ) {
            let file = e.target.files[0];

            return $File.RequestUpload(user.id, node.id, 0, file)
                .then( r => {
                    if ( r.ok ) {
                        return $File.Upload(r, file)
                            .then(r2 => {
                                if ( r2.ok ) {
                                    return $File.ConfirmUpload(r.id, r.name, r.token, user.id);
                                }
                            });
                    }
                    else {
                        alert(r.message);
                    }
                })
                .then( r => {
                    console.log("Uploaded", r);
                })
                .catch(err => {
                    alert(err);
                    this.setState({'error': err});
                });
        }
    }

    onUploadAndEmbed( e ) {
		let {node, user} = this.props;

        if ( !user || !user.id || !node )
            return null;

        if ( e.target.files && e.target.files.length ) {
            let file = e.target.files[0];

            return $File.RequestUpload(user.id, node.id, 0, file, "$$embed.zip")
                .then( r => {
                    if ( r.ok ) {
                        return $File.Upload(r, file)
                            .then(r2 => {
                                if ( r2.ok ) {
                                    return $File.ConfirmUpload(r.id, r.name, r.token, user.id);
                                }
                            });
                    }
                    else {
                        alert(r.message);
                    }
                })
                .then( r => {
                    console.log("Uploaded", r);
                })
                .catch(err => {
                    alert(err);
                    this.setState({'error': err});
                });
        }
    }

    render(props, state) {
        let {node} = props;

        if ( props.edit ) {
            let files = [];
            node.files.forEach(e => {
                if ( !(files.status & 0x40) ) {
                    files.push(<li>{e.name} - {e.size} bytes</li>);
                }
            });

            return (
                <ContentCommonBody class="-files -body -upload">
                    <div class="-label">Downloads</div>
                    <ul>{files}</ul>
                    <label>
                        <input type="file" name="file" style="display: none;" onchange={this.onUpload} />
                        <UIButton class="-button">Upload</UIButton>
                    </label>
                    <label>
                        <input type="file" name="file" style="display: none;" onchange={this.onUploadAndEmbed} />
                        <UIButton class="-button">Upload & Embed</UIButton>
                    </label>
                </ContentCommonBody>
            );
        }

        if ( !node || !node.files || !node.files.length ) {
            return <div />;
        }

        // View //

        let files = [];
        node.files.forEach(e => {
            if ( !(e.status & 0x40) ) {
                files.push(<li><UILink href={"//files.jam.host/uploads/$"+node.id+"/"+e.name}>{e.name}</UILink> - {e.size} bytes</li>);
            }
        });

        if ( files.length ) {
            return (
                <ContentCommonBody class="-files -body -upload">
                    <div class="-label">Downloads</div>
                    <ul>{files}</ul>
                </ContentCommonBody>
            );
        }

        return <div />;
    }
}
