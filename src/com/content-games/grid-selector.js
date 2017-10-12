import { h, Component } 				from 'preact/preact';

import Dropdown							from 'com/input-dropdown/dropdown';
import ButtonBase						from '../button-base/base';
import SVGIcon 							from 'com/svg-icon/icon';

export default class GridSelector extends Component {
    constructor( props ) {
		super(props);
        this.state = {
            'expanded': false,
            'selected': null,
        };

        this.onSelectLayout = this.onSelectLayout.bind(this);
        this.onToggleDropDown = this.onToggleDropDown.bind(this);
    }

    componentDidMount() {
       if ( !this.state.selected ) {
          this.handleNewSelection(this.props.defaultLayout);
       }
    }

    handleNewSelection( selected ) {
        const onChangeLayout = this.props.onChangeLayout;
        this.setState({'selected': selected});
        if ( onChangeLayout ) {
            onChangeLayout(selected);
        }
    }

    onToggleDropDown() {
        console.log('toggle dropdown', this.state);
        this.setState({'expanded': !this.state.expanded});
    }

    onSelectLayout( index ) {
        this.handleNewSelection(index);
        this.setState({
            expanded: false,
            selected: index,
        });
    }

    render( props, {expanded, selected} ) {
       let ShowDropDown = null;

       const ShowToggle = (
            <ButtonBase onclick={this.onToggleDropDown}>
                <SVGIcon>cog</SVGIcon>
            </ButtonBase>
       );

       if ( expanded ) {
           const options = [
               [1, '1 per line'],
               [2, '2 per line'],
               [3, '3 per line'],
               [4, '4 per line'],
               [5, '5 per line'],
               [6, '6 per line'],
           ];

           ShowDropDown = (
               <Dropdown
                    items={options}
                    onmodify={this.onSelectLayout}
                    startExpanded={true}
                />
            );
       }

       return (
           <div class={cN(props.class, 'grid-selector')}>
                {ShowToggle}
                {ShowDropDown}
           </div>
       );
    }
}
