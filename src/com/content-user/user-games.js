import { h, Component } 				from 'preact/preact';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentItemBox					from 'com/content-item/item-box';
import ContentCommon					from 'com/content-common/common';

import $Node							from '../../shrub/js/node/node';

export default class ContentUserGames extends Component {
	constructor( props ) {
		super(props);

    }


    render( props ) {
        props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
        props.class.push("content-user-games");
        props.class.push("content-item-boxes");


        return(
            <div class={props.class}>
                <ContentItemBox {...props}/>
                <ContentItemBox {...props}/>
                <ContentItemBox {...props}/>
                <ContentItemBox {...props}/>
                <ContentItemBox {...props}/>
                <ContentItemBox {...props}/>
                <ContentItemBox {...props}/>
                <ContentItemBox {...props}/>
                <ContentItemBox {...props}/>
                <ContentItemBox {...props}/>
                <ContentItemBox {...props}/>
                <ContentItemBox {...props}/>
            </div>
        );

    }
}
