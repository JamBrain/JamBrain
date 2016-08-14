// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin

if (!Array.prototype.copyWithin) {
	Array.prototype.copyWithin = function(target, start/*, end*/) {
		// Steps 1-2.
		if (this == null) {
			throw new TypeError('this is null or not defined');
		}

		var O = Object(this);

		// Steps 3-5.
		var len = O.length >>> 0;

		// Steps 6-8.
		var relativeTarget = target >> 0;

		var to = relativeTarget < 0 ?
		Math.max(len + relativeTarget, 0) :
		Math.min(relativeTarget, len);

		// Steps 9-11.
		var relativeStart = start >> 0;

		var from = relativeStart < 0 ?
		Math.max(len + relativeStart, 0) :
		Math.min(relativeStart, len);

		// Steps 12-14.
		var end = arguments[2];
		var relativeEnd = end === undefined ? len : end >> 0;

		var final = relativeEnd < 0 ?
		Math.max(len + relativeEnd, 0) :
		Math.min(relativeEnd, len);

		// Step 15.
		var count = Math.min(final - from, len - to);

		// Steps 16-17.
		var direction = 1;

		if (from < to && to < (from + count)) {
			direction = -1;
			from += count - 1;
			to += count - 1;
		}

		// Step 18.
		while (count > 0) {
			if (from in O) {
				O[to] = O[from];
			} else {
				delete O[to];
			}

			from += direction;
			to += direction;
			count--;
		}

		// Step 19.
		return O;
	};
}