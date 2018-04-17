<?php

// https://github.com/martenson/disposable-email-domains
function is_disposable_email( $email ) {
	$path = realpath(dirname(__FILE__)) . '/disposable_email_blacklist.conf';
	$mail_domains_ko = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
	$mail_domains_ko = array_fill_keys($mail_domains_ko, true);
	$domain = mb_strtolower(explode('@', trim($email))[1]);
	return (isset($mail_domains_ko[$domain]) || array_key_exists($domain, $mail_domains_ko));
}
