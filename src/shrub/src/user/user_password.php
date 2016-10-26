<?php

// Reference: http://blog.nic0.me/post/63180966453/php-5-5-0s-password-hash-api-a-deeper-look


function userPassword_Hash( $password ) {
	return password_hash($password, PASSWORD_DEFAULT); //, ['cost'=>10] );
}

function userPassword_Verify( $password, $hash ) {
	return password_verify($password, $hash);
}

//function userPassword_DoesPasswordNeedRehash($hash) {
//	return password_needs_rehash($hash, PASSWORD_DEFAULT); //, ['cost'=>10] );
//}
