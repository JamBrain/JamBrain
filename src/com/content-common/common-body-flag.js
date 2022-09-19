import {h, Component, toChildArray} from 'preact/preact';
import cN from 'classnames';
import {shallowDiff}	 							from 'shallow-compare/index';

import UIIcon										from 'com/ui/icon';

export default class ContentCommonFlag extends Component {
	constructor( props ) {
		super(props);
	}

    shouldComponentUpdate( nextProps ) {
		return shallowDiff(toChildArray(this.props.children), toChildArray(nextProps.children));
	}

    render( props ) {
		//var _class = "content-common-flag" + (props.class ? " "+props.class : "");

        let Icon = null;
        if ( props.icon ) {
            Icon = <UIIcon>{props.icon}</UIIcon>;
        }

        return (
            <div class={cN('flag', props.class)}>
                {Icon}
                {props.children}
            </div>
        );

/*
        if ( !props.noflag && !props.noheader && (props.flag || props.flagIcon) ) {
            let FlagClass = cN('content-common-flag', props.flagClass ? props.flagClass : '');

            if ( props.flagIcon )
                ShowFlag = <div class={FlagClass}><UIIcon>{props.flagIcon}</UIIcon> <span>{props.flag}</span></div>;
            else if ( props.flag )
                ShowFlag = <div class={FlagClass}><span>{props.flag}</span></div>;
        }


		return <div class={_class}>{props.children}</div>;
        */
	}
}
