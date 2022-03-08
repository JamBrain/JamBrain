import { h, Component }								from 'preact/preact';
import { shallowDiff }	 							from 'shallow-compare/index';

import SVGIcon										from 'com/svg-icon/icon';

export default class ContentCommonFlag extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props.children, nextProps.children);
	}

	render( props ) {
		//var _class = "content-common-flag" + (props.class ? " "+props.class : "");

        let Icon = null;
        if ( props.icon ) {
            Icon = <SVGIcon>{props.icon}</SVGIcon>;
        }

        return (
            <div class={cN('content-common-flag', props.class)}>
                {Icon}
                {props.children}
            </div>
        );

/*
        if ( !props.noflag && !props.noheader && (props.flag || props.flagIcon) ) {
            let FlagClass = cN('content-common-flag', props.flagClass ? props.flagClass : '');

            if ( props.flagIcon )
                ShowFlag = <div class={FlagClass}><SVGIcon>{props.flagIcon}</SVGIcon> <span>{props.flag}</span></div>;
            else if ( props.flag )
                ShowFlag = <div class={FlagClass}><span>{props.flag}</span></div>;
        }


		return <div class={_class}>{props.children}</div>;
        */
	}
}
