import YoutubeEmbed from './youtube';
import './embed-video.less';

export default function AutoEmbed( props ) {
	switch ( props.link.info.domain ) {
		case "youtube.com":
			return <YoutubeEmbed id={props.link.match} />;
		case "youtu.be":
			return <YoutubeEmbed id={props.link.match} />;
		default:
			console.warn("failed to embed link", props.link);
			break;
	}
}
