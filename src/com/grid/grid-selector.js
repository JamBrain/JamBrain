import { Component } from 'preact';
import './grid-selector.less';

import Dropdown							from 'com/input-dropdown/dropdown';
import {Icon, Button} from 'com/ui';

/** @deprecated */
export default class GridSelector extends Component {
    constructor( props ) {
		super(props);
        this.state = {
            'expanded': false,
            'selected': null,
        };

        this.onSelectLayout = this.onSelectLayout.bind(this);
        this.onToggleDropDown = this.onToggleDropDown.bind(this);
        this.onHideDropDown = this.onHideDropDown.bind(this);
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
        DEBUG && console.log('toggle dropdown', this.state);

        this.setState({'expanded': !this.state.expanded});
    }

    onHideDropDown() {
      this.setState({'expanded': false});
    }

    onSelectLayout( index ) {
        this.handleNewSelection(index);
    }

    render( props, {expanded, selected} ) {
       let ShowDropDown = null;

       const ShowToggle = <Button onClick={this.onToggleDropDown}><Icon src="cog" /></Button>;

       if ( expanded ) {
           const options = [
               [1, '1 per line', <div onClick={()=>this.onSelectLayout(1)} class="-click-catcher" />],
               [1, '2 per line', <div onClick={()=>this.onSelectLayout(2)} class="-click-catcher" />],
               [1, '3 per line', <div onClick={()=>this.onSelectLayout(3)} class="-click-catcher" />],
               [1, '4 per line', <div onClick={()=>this.onSelectLayout(4)} class="-click-catcher" />],
               [1, '5 per line', <div onClick={()=>this.onSelectLayout(5)} class="-click-catcher" />],
               [1, '6 per line', <div onClick={()=>this.onSelectLayout(6)} class="-click-catcher" />],
           ];

           ShowDropDown = (
               <Dropdown
                    items={options}
                    onModify={this.onSelectLayout}
                    expanded={expanded}
                    value={selected}
                    selfManaged={false}
                    onhide={this.onHideDropDown}
                />
            );
       }

       return (
           <div class={`${props.class ?? ''} grid-selector`}>
                {ShowToggle}
                {ShowDropDown}
           </div>
       );
    }
}
