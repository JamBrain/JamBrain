
export default SmartDomains = [
    {
        "domain": "youtube.com",
        "icon_name": "youtube",
        "embed_test": "(?:youtube\\.com\\/watch\\?v=)(.*)(?:)",

	},
	{
        "domain": "youtu.be",
        "icon_name": "youtube",
        "embed_test": "(?:youtu\\.be\\/)(.*)(?:)",
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
        "domain": "twitter.com",
        "icon_name": "twitter",
        "embed_test": /twitter\.com\/(\w+)\/status(?:es)*\/(\d+)$/
    },
    {
        "domain": "soundcloud.com",
        "icon_name": "soundcloud"
    },
    {
        "domain": "itch.io",
        "embed_test": "(.*)\.itch\.io\/(.+)$"
    },
    {
        "domain": "gfycat.com",
        "embed_test": /gfycat\.com\/(\w+)/
    }
];

