import Fetch from '../../shrub/js/internal/fetch';
import UIEmbedFrame from "com/ui/embed/frame/frame";

export default SmartDomains = [
    {
        "domain": "@base",
        "component": UIEmbedFrame
    },
    {
        "domain": "github.com",
        "icon_name": "github"
    },
    {
        "domain": "twitch.tv",
        "icon_name": "twitch"
    },
    {
        "domain": "reddit.com",
        "icon_name": "reddit"
    },
    {
        "parent": "@base",
        "domain": "twitter.com",
        "icon_name": "twitter",
        "embed_test": /twitter\.com\/(\w+)\/status(?:es)*\/(\d+)$/
    },
    {
        "domain": "soundcloud.com",
        "icon_name": "soundcloud"
    },
    {
        "parent": "@base",
        "domain": "itch.io",
        "embed_test": /(.*)\.itch\.io\/(.+)$/
    },
    {
        "parent": "@base",
        "name": "Gfycat",
        "domain": "gfycat.com",
        "embed_test": /gfycat\.com\/(\w+)/
    },
    {
        "parent": "@base",
        "name": "Sketchfab",
        "domain": "sketchfab.com",
        "embed_test": /sketchfab\.com\/models\/(\w+)/,
        "heavy": true,
        "thumbnail": (props) => {
            return Fetch.Get("https://api.sketchfab.com/v3/models/" + props.link.match)
            .then((res) => {
                return res.thumbnails.images[1].url;
            });
        },
        "autoplay": true
    },
    {
        "parent": "@base",
        "name": "Youtube",
        "domain": "youtube.com",
        "icon_name": "youtube",
        "embed_test": "(?:youtube\\.com\\/watch\\?v=)(.*)(?:)",
        "heavy": true,
        "thumbnail": (props) => {
            let yt_thumbnail_prefix = "https://i.ytimg.com/vi/";
            let yt_thumbnail_suffix = "/mqdefault.jpg";
            let video_id = props.link.match;

            return yt_thumbnail_prefix + video_id + yt_thumbnail_suffix;
        },
        "autoplay": true
    },
    {
        "parent": "youtube.com",
        "domain": "youtu.be",
        "embed_test": "(?:youtu\\.be\\/)(.*)(?:)"
    },
];

