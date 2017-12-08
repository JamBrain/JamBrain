import {h, render} from 'preact/preact';

import DialogPromise from "com/dialog/promise/promise";

export default class Dialog {
  static popup(title, body, props) {
    if (props == null) {
      props = {};
    }

    let defaults = {
      title: title,
      ok: true,
    };

    if(typeof body === "string") {
      body = <div>{body}</div>;
    }

    props = Object.assign({}, defaults, props);

    return new Promise(function(resolve, reject) {
      try {
        render(<DialogPromise resolve={resolve} reject={reject} {...props}> {body} </DialogPromise>, document.getElementById("layout"));
      }
      catch (e) {
        console.error(e);
        throw e;
      }
    });
  }

  static confirm(title, body, props) {
    if (props == null) {
      props = {};
    }

    let defaults = {
      ok: true,
      cancel: true
    };

    props = Object.assign({}, defaults, props);

    return this.popup(title, body, props);
  }

  static alert(title, body, props) {
    return this.popup(title, body, props);
  }
}
