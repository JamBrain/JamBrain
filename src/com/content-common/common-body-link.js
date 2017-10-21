import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';
import Sanitize							from '../../internal/sanitize/sanitize';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

import InputText						from 'com/input-text/text';
import InputDropdown					from 'com/input-dropdown/dropdown';

import $Tag								from '../../shrub/js/tag/tag';


export default class ContentCommonBodyField extends Component {
	constructor( props ) {
		super(props);

		this.state = {};
		this.onModifyTag = this.onModifyTag.bind(this);
	}

	onModifyTag( e ) {
		const nextSelected = e.target.dataset.id;
		const onModifyTag = this.props.onModifyTag;

		this.setState({'value': parseInt(nextSelected)});

		if ( onModifyTag ) {
			onModifyTag(e);
		}
	}

	componentDidMount() {
		$Tag.Get(this.props.filter)
			.then(r => {
				if ( r.tag && r.tag.length ) {
					let that = this;

					let NewState = {
						'items': [],
						'indexes': {}
					};
					r.tag.forEach(item => {
						NewState.indexes[item.id] = NewState.items.length;
						NewState.items.push([item.id, item.name]);
					});

					this.setState(NewState);
				}
			});
	}

	render( props, state ) {
		var Class = ["content-common-body","-link"];

		var Limit = 64;
		var NamePlaceholder = props.namePlaceholder ? props.namePlaceholder : 'Name';
		var UrlPlaceholder = props.urlPlaceholder ? props.urlPlaceholder : 'Url';

		if (props.editing && state.items) {
			Class.push('-editing');
			const value = state.value != undefined ? state.value : (props.tag ? props.tag : 0);
			return (
				<div class={cN(Class, props.class)}>
					<InputDropdown class="-name"
						items={state.items}
						value={value}
						onmodify={this.onModifyTag}
						useClickCatcher={true}
					/>
					<InputText class="-url"
						value={props.url}
						onmodify={props.onModifyUrl}
						placeholder={UrlPlaceholder}
						max={Limit}
					/>
				</div>

			);
		}
		else if ( state.items && props.url ) {
			var Index = props.tag ? state.indexes[props.tag] : 0;
			var Tag = state.items[Index];
			var Text = Sanitize.sanitize_URI(props.url);
			var Href = Text.indexOf('//') != -1 ? Text : '';

			var ShowLink = Href ? (<a href={Href} target="_blank">{Text}</a>) : <span>{Text}</span>;

			return (
				<div class={cN(Class, props.class)}>
					<strong title={Tag[0]}>{Tag[1]}:</strong> {ShowLink}
				</div>
			);
		}
		return <div />;
	}
}
