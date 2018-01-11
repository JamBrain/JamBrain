import {h, Component}		from 'preact/preact';

export default class UIEmbedFrame extends Component {
	constructor(props) {
		super(props);

		this.state = {
			"height": window.innerHeight + "px",
			"width": window.innerWidth + "px",
			"visible": false
		};

		this.onMessage = this.onMessage.bind(this);
	}

	componentDidMount() {
		this.ifr.onload = () => {
			this.ifr.contentWindow.postMessage('request_height', "*");
		};

		window.addEventListener('message', this.onMessage);
	}

	componentWillUnmount() {
		window.removeEventListener('message', this.onMessage);
	}

	onMessage(event) {
		if (event.data.hasOwnProperty("request_height") && event.data.hasOwnProperty("url")) {
			if (event.data.request_height > 0 && event.data.url == this.props.link.url) {
				this.setState({"height": event.data.request_height, "visible": true});
			}
		}
	}

	render( props, state ) {
		let {url} = this.props.link;
		let {height, width, visible} = this.state;

		let src = API_ENDPOINT + "/vx/embed?url=" + url;

		let style;
		if (!visible) {
			style = "visibility: hidden; position: absolute;";
		}

		return (
			<iframe style={style} width="100%" height={height} sandbox="allow-same-origin allow-popups allow-forms allow-scripts allow-top-navigation" ref={(f) => this.ifr = f } frameborder="none" scrolling="no" src={src} />
		);
	}
}
