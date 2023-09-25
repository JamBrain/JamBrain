import DialogCommon from 'com/dialog/common/common';

export default function DialogUserConfirm() {
	return (
		<DialogCommon title="Cookie Problem" explicit ok>
			<div>{"If you are seeing this message, then we were not able to set your login cookie."}</div>
			<div>Please whitelist <code>https://api.ldjam.com</code> (and <code>https://api.jam.host</code>) so we can log you in.</div>
		</DialogCommon>
	);
}
