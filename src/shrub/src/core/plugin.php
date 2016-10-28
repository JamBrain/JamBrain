<?php
/// Automatically included by ../plugin.php (gen.sh)

/// Plugins are called in the order they are added.
/// When you write a hook function, you can return True to raise an error. Otherwise don't, or return false.

/// PHP NOTES:
/// - Function references are strings containing the function name, not references like C.
/// - Calling a variable like $myvar($arg) looks up the function by the name stored in the string (not the variable name).
/// - If a function never returns, or does a "return;", it's the same as returning null;

$SH_HOOK = [];

/// @param [in] String $hook Name of the hook to lookup and call all functions of
/// @param [in] ... Any arguments passed to the function(s)
/// @retval Boolean True if hook returned a problem, False if no problem, null if no hook.
function plugin_Call( $hook, ...$args ) {
	global $SH_HOOK;
	
	if ( isset($SH_HOOK[$hook]) ) {
		$ret = false;
		foreach ( $SH_HOOK[$hook] as $func ) {
			$ret |= $func(...$args);
		}
		return $ret;
	}
	
	return null;
}

/// Like plugin_Call, but each function requires 1 input, and must return an output for the next function.
function plugin_Filter( $hook, $first_arg, ...$args ) {
	global $SH_HOOK;
	
	$ret = $first_arg;

	if ( isset($SH_HOOK[$hook]) ) {
		foreach ( $SH_HOOK[$hook] as $func ) {
			$ret = $func($ret, ...$args);
		}
	}
	
	return $ret;
}


/// @param [in] String $hook Name of the hook to attach the function to
/// @param [in] String $func Name of the function to attach
/// @retval Boolean On success
function plugin_Add( $hook, $func ) {
	global $SH_HOOK;
	
	// Create an array for the $hook name
	if ( !isset($SH_HOOK[$hook]) ) {
		$SH_HOOK[$hook] = [];
	}
	
	// If not already in the array, add it
	if ( !in_array($func, $SH_HOOK[$hook]) ) {
		$SH_HOOK[$hook][] = $func;
		return true;
	}
	return false;
}

/// @param [in] String $hook Name of the hook to remove the function from
/// @param [in] String $func Name of the function
/// @retval Boolean True on success, False if the function didn't exist, null if the hook itself doesn't exist
function plugin_Remove( $hook, $func ) {
	global $SH_HOOK;

	if ( !isset($SH_HOOK[$hook]) ) {
		return null;
	}
		
	$pos = array_search($func, $SH_HOOK[$hook]);
	if ( $pos !== false ) {
		unset($SH_HOOK[$hook][$pos]);

		if ( !count($SH_HOOK[$hook]) ) {
			unset($SH_HOOK[$hook]);
		}

		return true;
	}

	return false;
}
