import {h, Component} 				from 'preact/preact';

export default class OptionsList extends Component {
    /*
        `onClickItem` use this props as callbck for clicks
        `items` is an array, of options. Each item in the
        array defines
            `dataId`: Should be a unique string
            `Contents`: Any type of JSX element
            `Overlay`: An invisible div that fills up the
                same space as the content and catches clicks
                for specific callbacks per item.

        if `onClickItem` is set it will only be invoked if
        the item also has a `dataId`. So for separators, simply
        omit the dataId.
    */

    render ( {onClickItem, items} ) {
		const ShowItems = [];

        items.forEach(([dataId, Contents, Overlay]) => {

			let ClickCatcher = null;
			if ( !Overlay && dataId ) {
				ClickCatcher = (
					<div
						class="-click-catcher"
						onclick={onClickItem ? onClickItem : ()=>{}}
						data-id={dataId}
					/>
				);
			}

			ShowItems.push(
				<div class="-item"
					data-id={dataId}
				>
					{Contents}
					{Overlay}
					{ClickCatcher}
				</div>
			);
		});

		return (
			<div class="option-list">
				{ShowItems}
			</div>
		);
    }
}
