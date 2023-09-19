import './image.less';

function onImgError( e ) {
	const srcError = e.target.getAttribute('srcError');
	if ( srcError ) {
		e.target.src = srcError;

		// NOTE: This event does not buble, so there's no need to call stopPropagation()
	}
}


/**
 * @typedef {Object} ImageProps
 * @prop {string} src - the image source
 * @prop {string} [srcError] - fallback image source if the image is blank or it fails to load
 * @prop {string} [alt] - alt text for the image
 * @prop {string} [class] - css classes applied to the image. To align the image, use '-left', '-right', or '-center'.
 * @prop {number} [width] - width of the image
 * @prop {number} [height] - height of the image
 * @prop {boolean} [eager] - load the image immediately instead of lazily
 * @prop {boolean} [internalOnly] - only allow internal or static URLs. i.e. (///image.png) or (/image.png)
 * @prop {boolean} [decorative] - image is decorative and should be ignored by screen readers
 */

// MK TODO: add a flag that allows (disallows) external URLs

/**
 * Component that wraps \<img\>. Lazy loads images by default, and supports a fallback image.
 * @param {ImageProps} props
 */
export function Image( props ) {
	let {src, srcError, alt, eager, internalOnly, decorative, ...otherProps} = props;
	// NOTE: eager loading is the default, but we're lazy the default instead

	/** @type {{"loading" ?: "eager" | "lazy"}} */
	const lazyProps = eager ? {} : {'loading': 'lazy'};

	// NOTE: Per MDN, an empty alt tag means that the image is decorative and should be ignored by screen readers.
	//   To make this intention more obvious, we add an empty alt tag if Image is marked as decorative.
	const altProps = alt ? {alt} : (decorative ? {'alt': ''} : {});

	srcError = srcError ? (srcError.startsWith('///') ? STATIC_ENDPOINT + srcError.slice(2) : (internalOnly && !srcError.startsWith('/') ? undefined : srcError)) : undefined;
	src = src ? (src.startsWith('///') ? STATIC_ENDPOINT + src.slice(2) : (internalOnly && !src.startsWith('/') ? undefined : src)) : undefined;

	let errorProps = {};
	if ( srcError ) {
		// If we have a fallback and src is invalid, we can use srcError as the src
		if ( !src || src === "" ) {
			src = srcError;
		}
		// Otherwise, add an error handler
		else {
			errorProps = {
				'onError': onImgError,
				'srcError': srcError
			};
		}
	}

	// MK LEGACY NOTE: there was a `block` property here. It added a '-block' style. It's unclear to me the intent.
	//  I've added -left, -right, and -center styles instead. I'm assuming the intent was centering, but if not, then that's why it broke.

	// NOTE: errorProps comes before otherProps so that the error handler can be overridden
	return <img src={src} {...altProps} {...errorProps} {...otherProps} {...lazyProps} />;
}
