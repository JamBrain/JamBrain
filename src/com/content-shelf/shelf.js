import {h, Component} from 'preact/preact';

import ContentCommon from 'com/content-common/common';
import SVGicon from 'com/svg-icon/icon';

export default class Shelf extends Component {

    render ( {slots, children, expandable}, {expanded} ) {
        const ExpandCollapseIcon = expandable ? (
            <SVGicon onclick={ () => this.setState({'expaned': !expaned}) } class="-shelf-tools">
                {expaned ? 'arrow-up' : 'arrow-down'}
            </SVGicon>
        ) : null;

        const Shelves = [];
        let Cards = [];
        children.forEach( ( card ) => {
            Cards.push(card);
            if ( Cards.length == slots ) {
                const invisible = expaned || Shelves.length == 0 ? '' : '-elf-shelf';
                Shelves.push(
                    <div class={cN('-shelf', '-columns-' + slots, invisible)}>
                        {Cards}
                    </div>
                );
                Cards = [];
            }
        });

		while ( Cards.length % slots !== 0 ) {
			Cards.push(<div class="-shelf-card -placeholder" />);
		}

        return (
            <ContentCommon class={cN('content-shelf', this.props.class)}>
                {ExpandCollapseIcon}
                {Shelves}
            </ContentCommon>
        );
    }
}
