This is the **Internal API** used by Ludum Dare. Go check out the [Public API](http://dev.ludumdare.com/api/) instead.

**NOTE**: This API is *NOT* a truly RESTful API. It relies on the PHP session, cookies and state set by the website. 
It follows a RESTful style, but it is effectively just an AJAX API that outputs JSON.

**IMPORTANT**: It **should not** be used by 3rd party services. No guarantees are made to preserve API compatibility.
