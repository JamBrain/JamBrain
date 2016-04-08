<?php

// The 'openssl' command can be used to generate prime numbers 

// openssl prime -generate -bits 32

// Primes are usually more bits (2048), but can be as low as 16 bits (any lower gives you the same value).
// use '-hex' to generate prime as hex

// To check if a number is prime, feed it in to the openssl command

// openssl prime 51047

// That will tell you if it is or isn't prime
