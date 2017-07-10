export default {
	Diff,
	Compare
};

export function Diff( a, b ) {
	for ( let i in a )
		if ( !(i in b) )
			return true;
	for ( let i in b )
		if ( a[i] !== b[i] )
			return true;
	return false;
}

export function Compare( instance, nextProps, nextState ) {
	return (
		Diff(instance.props, nextProps) ||
		Diff(instance.state, nextState)
	);
}
