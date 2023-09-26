import DialogCommon from 'com/dialog/common/common';

export default function DialogSession() {
	return (
		<DialogCommon title="Session Expired" explicit ok>
			<div><strong>{"Oops!!"}</strong></div>
			<div>{"It looks like your session expired (and yes, it's probably a bug)."}</div>
			<div>{"Log in again to continue what you were doing."}</div>
		</DialogCommon>
	);
}
