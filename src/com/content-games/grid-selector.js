import {h, Component} 				from 'preact/preact';

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
        this.setState(
            {
                'selected': selected,
                'expanded': false,
            }
        );
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
               [1, '1 per line', <div onclick={()=>this.onSelectLayout(1)} class="-click-catcher" />],
               [1, '2 per line', <div onclick={()=>this.onSelectLayout(2)} class="-click-catcher" />],
               [1, '3 per line', <div onclick={()=>this.onSelectLayout(3)} class="-click-catcher" />],
               [1, '4 per line', <div onclick={()=>this.onSelectLayout(4)} class="-click-catcher" />],
               [1, '5 per line', <div onclick={()=>this.onSelectLayout(5)} class="-click-catcher" />],
               [1, '6 per line', <div onclick={()=>this.onSelectLayout(6)} class="-click-catcher" />],
           ];

           ShowDropDown = (
               <Dropdown
                    items={options}
                    onmodify={this.onSelectLayout}
                    startExpanded={true}
                    value={selected}
                    selfManaged={false}
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
