
// https://confluence.atlassian.com/bitbucket/use-the-bitbucket-cloud-rest-apis-222724129.html

// Any request with ?callback returns JsonP

// Rate limits are in the thousands
// https://confluence.atlassian.com/bitbucket/rate-limits-668173227.html

// TODO: Cache results in local storage anyway

// Not available
//function bitbucket_GetRateLimits() {
//}

function bitbucket_GetRepos(user,repos) {
	// https://api.bitbucket.org/2.0/repositories/sykhronics/gelhtml
}

function bitbucket_GetReposIssues(user,repos)
	// NOTE: Issue Tracker must be public, otherwise returns forbidden
	// https://api.bitbucket.org/2.0/repositories/sykhronics/gelhtml/issues
}

