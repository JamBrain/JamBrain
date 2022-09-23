import {h, Component} from 'preact';
import cN from 'classnames';

import {UIIcon, UIButton} from 'com/ui';
import FooterButtonMinMax 				from 'com/content-common/common-footer-button-minmax';
import ContentItemBox					from 'com/content-item/item-box';
import ContentCommonBody				from 'com/content-common/common-body';
import ContentLoading					from 'com/content-loading/loading';
import $Node							from 'shrub/js/node/node';

export const randomPick = (maxExclusive, n) => {
	const ret = [];
	while (ret.length < n) {
		let v = Math.floor(Math.random() * maxExclusive);
		if (ret.indexOf(v) === -1) ret.push(v);
	}
	return ret;
};

const N_RESHUFFLE_BEFORE_RELOAD = 6;
const N_SHOW_MAX = 4;

export default class TimelineRateGames extends Component {
	constructor(props) {
		super(props);
		this.state = {
			"expanded": true,
			"loading": true
		};

		this.handleMinMax = this.handleMinMax.bind(this);
		this.handleRefresh = this.handleRefresh.bind(this);
	}

	handleMinMax() {
		this.setState(prevState => ({"expanded": !prevState.expanded}));
	}

	handleRefresh() {
		if (this.state.loading) return;

		this.setState(prevState => {
			const {reshuffles, feed} = prevState;

			if (reshuffles < N_RESHUFFLE_BEFORE_RELOAD && feed) {
				const l = feed.length;
				return {'reshuffles': reshuffles + 1, 'pick': randomPick(l, Math.min(l, N_SHOW_MAX))};
			}

			this.getGames(this.props);
			return null;
		});
	}

	componentDidMount() {
		this.getGames(this.props);
	}

	componentWillReceiveProps(nextprops) {
		const {props} = this;
		if (props.featured && props.featured != nextprops.featured) {
			this.getGames(nextprops);
		}
	}

	getGames(props) {
		if ( !props.featured || !props.featured.id ) {
			return;
		}

		const {id} = props.featured;
		const methods = ['smart', 'parent'];
		const types = ['item'];
		const subtypes = ['game'];
		const subsubtypes = 'compo+jam+extra';
		const tags = null;
		const more = null;
		const limit = 30;
		this.setState({'loading': true});
		$Node.GetFeed( id, methods, types, subtypes, subsubtypes, tags, more, limit )
		.then(r => {
			const l = (r.feed && r.feed.length) || 0;
			if (l === 0) {
				this.setState({
					'feed': [],
					'pick': [],
					'loaded': new Date(),
					'loading': false,
					'reshuffles': 0,
				});
			}
			else {
				$Node.Get(r.feed /*.map(elem => elem.id)*/)
				.then(r => {
					this.setState({
						'feed': r.node,
						'pick': randomPick(l, Math.min(l, N_SHOW_MAX)),
						'loaded': new Date(),
						'loading': false,
						'reshuffles': 0,
					});
				})
				.catch(err => {
					this.setState({'error': err, 'loading': false});
				});
			}
		})
		.catch(err => {
			this.setState({'error': err, 'loading': false});
		});
	}

	render(props, {expanded, feed, pick, error, loading}) {
		//    if (!this.event_canRate(props.featured)) return null;
		const HeaderClass = cN('content-common-header');
		const MainClass = cN('content -common rate-games', !expanded && 'minimized');

		let Games;
		if (error) {
			Games = <div class="-warning"><UIIcon src="bug" /><span>An error occurred while loading the games.</span></div>;
		}
		else if (loading) {
			Games = <ContentLoading />;
		}
		else if (feed.length == 0) {
			Games = <ContentCommonBody>Sorry, there are no published games yet</ContentCommonBody>;
		}
		else {
			Games = <div class="games-pick">{pick.map(idx => <ContentItemBox node={feed[idx]} noevent />)}</div>;
		}

		const FooterLeft = [];
		const FooterRight = [];
		FooterLeft.push(<FooterButtonMinMax onClick={this.handleMinMax} />);
		FooterRight.push((
			<UIButton class={cN("content-common-footer-button", '-refresh')} title='Refresh' onClick={this.handleRefresh}>
				<UIIcon src="refresh" /><div class="-count">Refresh</div>
			</UIButton>
		));
		FooterRight.push((
			<UIButton class={cN("content-common-footer-button", '-all-games')} href={props.featured && `/events/ludum-dare/${props.featured.slug}/games/`}>
				<UIIcon src="gamepad" /><div class="-count">All Games</div>
			</UIButton>
		));

		return (
		<div class={MainClass}>
			<div class={HeaderClass}><UIIcon src="gamepad" /> <span>Play, Rate, and give Feedback</span></div>
				<div class="-bodies">
					<div class="_inline-if-not-minimized">
					{Games}
					</div>
					<div class="_inline-if-not-minimized">
					<strong>TIP</strong>: For more ratings and feedback, leave feedback on the games you play, and give <UIIcon src="heart" />'s to feedback you like.
					</div>
				</div>
				<div class={cN('content-common-footer', (FooterLeft.length + FooterRight.length) ? '-has-items' : '')}>
				<div class="-left">
					{FooterLeft}
				</div>
				<div class="-right">
					{FooterRight}
				</div>
			</div>
		</div>
		);
	}
}
