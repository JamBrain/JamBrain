# COM (Components)

This directory contains Preact components (like React components, but lighter). Preact (and Buble) supports JSX, which as you'll see, features an HTML-like syntax right in the JavaScript.

**NOTE:** Most components generate HTML, but [svg-icon](svg-icon/) generates SVG.

### Naming Style
Components tend to be named like so:

```
/subject-purpose/
/subject-purpose/purpose.ext
```

CSS classes use the same naming convention. Generally speaking, CSS follows the RSCSS style guide.

http://rscss.io/

This means that child classes of a component tend to be prefixed with a dash, and use the `>` child selector.

```css
.subject-purpose {
	& > .-title {
		font-size: 1.2em;
	}
}
```

For more details, see the CSS style guide.

[LINK]

When used in JavaScript code, the class tends to be named in StudlyCaps.

```js
class SubjectPurpose extends Component {
	// ...
}
```

When importing, omit the file extension. You can also omit any prefixes and use `com/` as the base folder name.

```js
import SubjectPurpose					from 'com/subject-purpose/purpose';
```

If you're curious why we need to mention the filename at all, remember this is not NodeJS. The actual ES6 import specification regrettably doesn't say anything about using an implied `index.js` file, even though a typical web server _would_ be configured to return an `index.blah` file. More importantly though, working with several files with the exact same filename is difficult to follow in a standard text editor.

After importing, the classes can be used in JSX.

```js
	return <SubjectPurpose>I have a purpose!</SubjectPurpose>;
```

For more details, see the Preact documentation: 

https://preactjs.com/

And the JS style guide:

[LINK]

## Views
Views are how the website reconfigures the layout. Depending on the content type of the active node, we switch views.

Most views have a sidebar, but on Moblie, the sidebar is hidden.

* [/view-timeline/](view-timeline/) - Timeline view. If you're familiar with classic Ludum Dare, it's that view.
* [/view-single/](view-single/) - Single post view.
* [/view-user/](view-user/) - Single user view. AKA user pages.
* [/view-game/](view-game/) - Single game or tool view.
* [/view-article/](view-article/) - Single article view. No sidebar.
* [/view-event/](view-event/) - Single event view. View with a slightly reconfigured sidebar.
* [/view-browse/](view-browse/) - Multi-content type view. I.e. all events, articles, games, tools, etc.

## Content
Views are just how things are arranged. These are the actual posts, articles, and game pages themselves.

* [/content-post/](content-post/) - Posts, as typically seen in the timeline.
* ...

## Sidebar
These are the sidebar components seen in most wide views. 

Sidebar components tend to summaries. The full data from widgets tends to be available in either a Dialog, or a separate page.

* [/sidebar-calendar/](sidebar-calendar/) - The 7x3 grid that lets you learn about what's coming up.
* [/sidebar-shortlist/](sidebar-shortlist/) - A base layout type fo some of the sidebar items.
* [/sidebar-upcoming/](sidebar-upcoming/) - Upcoming key dates. 3 items. The next LD event, plus 2 more.
* [/sidebar-trending/](sidebar-trending/) - (disabled) Trending game jams and events.
* [/sidebar-tv/](sidebar-tv/) - The television sidebar widget (not the popup). Uses data from `Jammer.tv`
* [/sidebar-support/](sidebar-support/) - The tail-end "support us" component.

## Navigation
A few specific components related to navigation.

* [/nav-bar/](nav-bar/) - The navigation bar seen at the top of the website.
* [/nav-link/](nav-link/) - Prefer this to `<a href='...'></a>` links, as it keeps us from reloading when URLs change.

## Dialogs
Dialogs are popups used to give you a choice. They are modal, meaning they take full control, and are the focus, until dismissed.

Many dialogs change the URL. For example `#search` or `#tv`. This way, the URL can be copied+pasted.

Generally speaking, you can think of everything in a URL that comes before the `#` as what appears **under** the dialog, and everything after the `#` what appears **in** the dialog.

* [/dialog-search/](dialog-search/) - Searching and Browsing
* [/dialog-newpost/](dialog-newpost/) - Choices for when you make a new post. Where to post it, whether you want to post a question or write an article, etc.
* [/dialog-publish/](dialog-publish/) - Publish confirmation dialog. When you include any `@names`, it tells you who you're going to send notifications to.
* [/dialog-tv/](dialog-tv/) - Jammer.tv video watcher and browser

## Drop Downs
Drop downs are similar to dialogs, in that they are used to give choice, but don't change the URL (`#`).

* [/dropdown-notification/](dropdown-notification/) - View your notifications, and dismissed alerts.
* [/dropdown-settings/](dropdown-settings/) - Several user specific options. View your page, set your avatar, log out, etc.

## Buttons
TODO

* [/button-base/](button-base/) - ?

## Other
TODO

* [/svg-icon/](svg-icon/) - (NOTE: **SVGIcon**, not SvgIcon) ?
* [/overlay-dark/](overlay-dark/) - ?
* [/overlay-clear/](overlay-clear/) - ?
