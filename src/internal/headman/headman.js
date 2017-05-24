export default class HeadMan {
  static insertMeta(meta) {
    var existingMeta = document.getElementsByTagName('meta');

    for (var i = 0; i < existingMeta.length; i++) {
      if (existingMeta[i].name != 'viewport' && (existingMeta[i].name !== null || existingMeta[i].getAttribute("property") !== null)) {
        document.head.removeChild(existingMeta[i]);
      }
    }

    for (var key in meta) {
      if (document.querySelector('meta[property="' + key + '"]') !== null) {
        document.querySelector('meta[property="' + key + '"]').setAttribute("content", meta[key]);
      } else {
        var newMeta = document.createElement('meta');
        newMeta.setAttribute("property", key);
        newMeta.setAttribute("content", meta[key]);
        document.head.appendChild(newMeta);
      }
    }
  }

  static setTitle(title) {
    document.title = title;
  }
}
