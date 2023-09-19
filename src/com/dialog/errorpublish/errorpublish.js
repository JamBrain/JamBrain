import DialogCommon from 'com/dialog/common/common';

export default function DialogErrorPublish( props ) {
	return <>
		<DialogCommon title="Publish failed" ok>
			<p>Looks like publishing failed.</p>
			<p>Error: <em>{decodeURI(props.args)}</em></p>
		</DialogCommon>
	</>;
}
