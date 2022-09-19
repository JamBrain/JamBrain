import {h, Component}					from 'preact';
import ContentCommonBody				from 'com/content-common/common-body';
import UIButton							from 'com/ui/button/button';
import UILink							from 'com/ui/link/link';

import $File							from 'shrub/js/file/file';

export default class ContentItemEmbedFile extends Component {
	constructor(props) {
		super(props);

        this.state = {
            'status': 0,
            'uploads': []
        };

        this.onUpload = this.onUpload.bind(this);
	}

    onUpload( e ) {
		let {node, user} = this.props;

        if ( !user || !user.id || !node )
            return null;

        if ( e.target.files && e.target.files.length ) {
            let file = e.target.files[0];

            this.setState({'status': 2});

            return $File.RequestUpload(user.id, node.id, 0, file, "$$embed.zip")
                .then( r => {
                    if ( r.ok ) {
                        this.setState({'status': 3});

                        return $File.Upload(r, file)
                            .then(r2 => {
                                if ( r2.ok ) {
                                    this.setState({'status': 4});
                                    return $File.ConfirmUpload(r.id, node.id, r.name, r.token, user.id)
                                    .then( r3 => {
                                        // Terrible hack
                                        let newState = this.state.uploads;
                                        newState.push(r3);
                                        this.setState(newState);
                                        return r3;
                                    });
                                }
                            });
                    }
                    else {
                        this.setState({'status': 1});
                        alert(r.message);
                    }
                })
                .then( r => {
                    this.setState({'status': 5});
                    // @ifdef DEBUG
                    console.log("Uploaded", r);
                    // @endif
                })
                .catch(err => {
                    this.setState({'status': 5});
                    alert(err);
                    this.setState({'error': err});
                });
        }
    }

    onDelete( e ) {
        let {node, user} = this.props;

        if ( !user || !user.id || !node )
            return null;

        // @ifdef DEBUG
        console.log("onDelete", e.id, e.name);
        // @endif

        return $File.RequestDelete(e.id, e.name, node.id)
            .then( r => {
                if ( r.ok ) {
                    return $File.Delete(r);
                        /*.then(r2 => {
                            if ( r2.ok ) {
                                return $File.ConfirmDelete(r.id, r.name, r.token, user.id);
                            }
                        });*/
                }
                else {
                    alert(r.message);
                }
            })
            .then( r => {
                // @ifdef DEBUG
                console.log("Deleted", r);
                // @endif
            })
            .catch(err => {
                alert(err);
                this.setState({'error': err});
            });
    }

    render(props, state) {
        let {node, parent} = props;

        let latestFiles = {};
        node.files.forEach(e => {
            latestFiles[e.name] = e;
        });

        // Show the upload interface
        if ( props.edit ) {
            if ( !node || !parent || !node_CanUpload(parent) ) {
                return <div />;
            }

            let files = [];
            Object.values(latestFiles).forEach(e => {
                if ( (e.status & 0x1) && (e.status & 0x40) ) {
                    let func = this.onDelete.bind(this, e);
                    files.push(<li>{e.name} [{e.status.toString(16)}] - {e.timestamp} - {e.size} bytes - <UIButton style="display: inline;" onclick={func}>delete</UIButton></li>);
                }
            });

            for ( let idx = 0; idx < state.uploads.length; ++idx ) {
                files.push(<li>{state.uploads[idx].name}</li>);
            }

            const status = [
                "",
                "ERROR",
                "Requested...",
                "Uploading...",
                "Verifying...",
                "Successfully uploaded file",
            ];

            const isUploading = (state.status > 0 && state.status < 5);
            const uploadButton = isUploading ? "" : <UIButton class="-button">Upload .zip file</UIButton>;

            return (
                <ContentCommonBody class="-files -body -upload">
                    <div class="-label">Embed HTML5</div>
                    <div class="-footer">Use this to embed an HTML5 version of your game.</div>
                    <ul>{files}</ul>
                    {(state.status > 0) ? <div class="-footer">Status: {status[state.status]}</div> : ""}
                    <label>
                        <input type="file" name="file" style="display: none;" onchange={this.onUpload} />
                        {uploadButton}
                    </label>
                    <div class="-footer">For details on how to prepare a file for embedding, see the <UILink href="//ludumdare.com/resources/guides/embedding/">Embedding Guide</UILink>.</div>
                </ContentCommonBody>
            );
        }

        if ( !node || !node.files || !node.files.length ) {
            return <div />;
        }

        // View //
/*
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
*/

        return <div />;
    }
}
