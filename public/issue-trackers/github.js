
// https://developer.github.com/v3/

// Any github request with ?callback returns JsonP

// GitHub has a limit of 60 requests per hour per IP
// Logged in, the limit is 5000 requests per hour per IP

// TODO: Cache results in local storage

function github_GetRateLimits() {
	//https://api.github.com/rate_limit
	//https://api.github.com/rate_limit?callback=foo
}

function github_GetRepos(user,repos) {
	// https://api.github.com/repos/ludumdare/ludumdare
}

function github_GetReposIssues(user,repos)
	//https://api.github.com/repos/USER/REPO/issues
}

