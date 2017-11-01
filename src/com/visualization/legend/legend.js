import {h, Component} 				from 'preact/preact';

export default class Legend extends Component {

	constructor( props ) {
		super(props);

    }

    render( props ) {

        if ( !(props && props.colors && props.names) ) {
            console.warn('Legend was created with invalid props', props);
            return;
        }

		let {colors, names} = props;

        let Legend = [];
		for (var index = 0; index < names.length; index++) {
			let name = names[index];
			let color = colors[index];

			let legendclass = cN("-shape-circle", "vis_bg_color_"+color, props.class);

			Legend.push(
                <li>
                    <span class={legendclass}></span>
                    <p>{name}</p>
                </li>
			);

		}

        return (
			<div class="-legend">
				<ul>
					{Legend}
				</ul>
			</div>
        );
    }
}
