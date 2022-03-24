//export {default, default as ContentCommon} from "com/content-common/common";

// Common document types
export {default as CommonHeader} from "./common-header";
export {default as CommonSection} from "./common-section";
export {default as CommonArticle} from "./common-article";
export {default as CommonAside} from "./common-aside";
export {default as CommonFooter} from "./common-footer";

// MK TODO: Make this legal
/*
export Document {
	CommonHeader as Header,
	CommonSection as Section,
	CommonArticle as Article,
	CommonAside as Aside,
	CommonFooter as Footer,
}
*/

// Common document Content types
// Each has an optional header, one or more sections, and an optional footer
export {default as Header} from "./header";
export {default as Section} from "./section";
export {default as Footer} from "./footer";

// MK TODO: Make this legal
/*
export Content {
	Header,
	Section,
	Footer,
};
*/

// MK TODO: Make this legal
/*
export default Common {
	Document,
	Content
};
*/
