import { h }		 				from 'preact/preact';

export default {
	EmbedTwitch,
	EmbedHitbox,
	EmbedYouTube,

	EmbedTwitchChat,
	EmbedHitboxChat,
	EmbedYouTubeChat
};

const IFrame = (props) => (
	<iframe class={props.class} src={props.src} frameborder="0" scrolling="no" allowfullscreen></iframe>
);

export function EmbedTwitch( _class, _src ) {
	return <IFrame class={_class} src={_src} />;
}
export function EmbedTwitchChat() {
	
}

export function EmbedHitbox() {
	
}
export function EmbedHitboxChat() {
	
}

export function EmbedYouTube() {
	
}
export function EmbedYouTubeChat() {
	
}



