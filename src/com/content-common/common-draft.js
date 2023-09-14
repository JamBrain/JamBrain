import './common-draft.less';

export default function ContentCommonDraft( props ) {
	return <div class={`draft ${props.class ?? ''}`}>Unpublished {props.draft ? props.draft : "Draft"}</div>;
}
