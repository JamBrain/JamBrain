import {h, Component} from 'preact/preact';

import ContentCommon from 'com/content-common/common';
import SVGicon from 'com/svg-icon/icon';

export default class Shelf extends Component {

    pushCardsAsNewShelf(Shelves, Cards, slots, expanded) {
        const invisible = expanded || Shelves.length == 0 ? '' : '-elf-shelf';
        Shelves.push(
            <div class={cN('-shelf', '-columns-' + slots, invisible)}>
                {Cards}
            </div>
        );
    }

    render ( {slots, children, expandable}, {expanded} ) {
        if (!slots) {
            slots = 5;
        }

        const ExpandCollapseIcon = expandable ? (
            <SVGicon onclick={ () => this.setState({'expaned': !expaned}) } class="-shelf-tools">
                {expaned ? 'arrow-up' : 'arrow-down'}
            </SVGicon>
        ) : null;

        const Shelves = [];
        let Cards = [];
        let cardsOnShelf = false;
        children.forEach( ( card ) => {
            Cards.push(card);
            if ( Cards.length == slots ) {
                this.pushCardsAsNewShelf(Shelves, Cards, slots, expanded);
                cardsOnShelf = true;
                Cards = [];
            }
            else {
                cardsOnShelf = false;
            }
        });

        if (!cardsOnShelf && Cards.length > 0) {
            while ( Cards.length < slots ) {
                Cards.push(<div class="-shelf-card -placeholder" />);
            }
            this.pushCardsAsNewShelf(Shelves, Cards, slots, expanded);
        }
        console.log(Shelves);
        return (
            <div class={cN('content-shelf', expandable ? '-expandable' : '-in-expandable', this.props.class)}>
                {ExpandCollapseIcon}
                {Shelves}
            </div>
        );
    }
}
