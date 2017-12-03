import {h, Component} 				from 'preact/preact';
import {shallowDiff}	 				from 'shallow-compare/index';
import Sanitize							from '../../internal/sanitize/sanitize';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

import InputText						from 'com/input-text/text';
import InputDropdown					from 'com/input-dropdown/dropdown';

import $Tag								from 'shrub/js/tag/tag';


export default class ContentCommonBodyField extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'items': null,			// raw tag results
			'itemlist': null,		// pairs (index, name) for the drop-down
			'indexes': null,		// lookup table that takes ids and converts them in to dropdown indexes
			'tag': props.tag ? props.tag : 0,
		};

		this.onModifyTag = this.onModifyTag.bind(this);
	}

	componentDidMount() {
		$Tag.Get(this.props.filter)
			.then(r => {
				if ( r && r.tag && r.tag.length ) {
					let that = this;

					let NewState = {
						'items': r.tag,
						'itemlist': [],
						'indexes': {},
						'tag': 0,
					};
					r.tag.forEach(item => {
						NewState.indexes[item.id] = NewState.itemlist.length;
						NewState.itemlist.push([item.id, item.name]);
					});

					NewState.tag = NewState.itemlist[0][0];

					this.setState(NewState);
				}
			});
	}

	onModifyTag( Index, e ) {
		this.setState({'tag': Index});
		this.props.onModifyTag(Index, e);
	}

	render( props, state ) {
		let UrlPlaceholder = props.urlPlaceholder ? props.urlPlaceholder : 'URL (example: http://some.website.com/file.zip)';

		if ( props.editing && state.itemlist && state.indexes ) {
			return (
				<div class={cN('content-common-link', '-editing', props.class)}>
					<InputDropdown class="-tag"
						items={state.itemlist}
						value={state.tag}
						onmodify={this.onModifyTag}
						useClickCatcher={true}
						selfManaged={true}
					/>
					<InputText class="-name"
						value={props.name}
						onmodify={props.onModifyName}
						placeholder={state.itemlist[state.indexes[state.tag]][1]}
						maxlength={64}
					/>
					<InputText class="-url"
						value={props.url}
						onmodify={props.onModifyUrl}
						placeholder={UrlPlaceholder}
						maxlength={512}
					/>
				</div>
			);
		}
		else if ( state.itemlist && props.url ) {
			let Index = props.tag ? state.indexes[props.tag] : 0;
			let Tag = state.itemlist[Index];
			let Text = Sanitize.sanitize_URI(props.url);
			let Href = Text.indexOf('//') != -1 ? Text : '';

			let ShowLink = Href ? (<a href={Href} target="_blank">{Text}</a>) : <span>{Text}</span>;

			let ShowName = props.name ? props.name : Tag[1];

			let Icon = 'earth';
			if ( state.items[Index].icon ) {
				Icon = state.items[Index].icon;
			}

			return (
				<div class={cN('content-common-link', props.class)}>
					<div class="-name" title={'$'+Tag[0]+" - "+Tag[1]}><SVGIcon small>{Icon}</SVGIcon> <span>{ShowName}</span></div>
					<div class="-url">{ShowLink}</div>
				</div>
			);
		}
		return <div />;
	}
}
