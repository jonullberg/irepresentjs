
#**iRepresent** — App-athy is an Issue™

iRepresent is an app that allows users to harness the collective voting power of their community. They can easily raise public awareness and bring issues to light as well as show their support by voting for or against other outstanding stuff.

Get it [FREE in the App Store](https://store.apple.com/iRepresent).

***
> **NOTICE** — The endpoints outlined in this document are not designed for public use. This documentation outlines the application's consumption of these resources. All requests to, and responses from, these endpoints are handled automatically.

##**API Documentation >** Endpoints
***
###**Create New User ** > POST /users

**PURPOSE** > This endpoint is used to create a new `User`.

**PARAMS** > This endpoint *does not * require any parameters to be sent to it.

**HEADERS** > This endpoint *does not* require any request headers to be sent to it.

**BODY** > This endpoint requires a request body with the following syntax:

```javascript
{
    username: <username>,
    password: <password>,
    email: <email> 
}
```

> `username:`  `required String` — The account name for the newly-created `User`. 
> `password:` `required String` — The password for the newly-created `User`.
> `email:` `required String` — The email address for the newly-created `User`.

**RESPONSE** > Upon validation of the request, this endpoint will send a response in the following syntax:

```javascript
{
    success: <result>,
    message: <message>
}
```

> `result` — A `Boolean` indicating if the creation of the `User` was successful.
> `message` — A `String` that provides information as to the result of the request.



***
###**Authenticate Existing User** > GET /sign_in

**PURPOSE** > This endpoint is used to authenticate supplied credentials and issue an `access token`.

**PARAMS** > This endpoint *does not * require any parameters to be sent to it.

**HEADERS** > This endpoint requires an `Authorization` header whose value is: `Basic` and a base64-encoded concatenation in the syntax: `username`:`password`.

> **Authorization** : Basic cmFpbmJvd2ZhcnRpbmc6dW5pY29ybnM=

**BODY** > This endpoint *does not* require a request body to be sent to it.

**RESPONSE** > Upon validation of the request, this endpoint will send a response in the following syntax:

```javascript
{
    success: <result>,
    message: <message>,
    data: {
        token: <token>
    }
}
```

> `result` — A `Boolean` indicating if the authentication request was successful.
> `message` — A `String` that provides information as to the result of the request.
> `token` — A `String` that comprises of the `access token` value used to authenticate subsequent requests.




***
###**View User Issues** > GET /issues

**PURPOSE** > This endpoint is used to obtain a list of `Issues` that the `User` has voted on.

**PARAMS** > This endpoint supports a `sort` parameter which determines how the returned `Issues` are sorted.

*Examples:*
GET /issues
GET /issues?`sort`=newest
GET /issues?`sort`=popular

> `sort:` `optional String` — Indicates the type of sort to perform on the returned data. The default, `popular`, returns `Issues` that proportionally have a higher tally of votes and who are within a close spread between up and down votes. The other option, `newest` returns `Issues` sorted by the most recently created first.

**HEADERS** > This is a protected endpoint which requires that a valid `access token` be supplied via a custom request header called `eat`. (Endpoint Authentication Token). This token provides the endpoint with identification and context of its respective authenticated `User`.

> **eat** : 83hHJHfuy382thk/aoJjf3ff/Uafamro==

**BODY** > This endpoint *does not* require a request body to be sent to it.

**RESPONSE** > Upon validation of the request, this endpoint will send a response in the following syntax:

```javascript
{
    success: <result>,
    message: <message>,
    data: {
        <issues>
    }
}
```

> `result` — A `Boolean` indicating if the user issues request was successful.
> `message` — A `String` that provides information as to the result of the request.
> `issues` — An `Array` of `Issues` which the authenticated `User` has voted on, optionally sorted in the method indicated in the **PARAMS** section.

***
###**Create New Issue** > POST /issues

**PURPOSE** > This endpoint is used to create a new `Issue`.

**PARAMS** > This endpoint *does not* require any parameters to be sent to it.

**HEADERS** > This is a protected endpoint which requires that a valid `access token` be supplied via a custom request header called `eat`. (Endpoint Authentication Token). This token provides the endpoint with identification and context of its respective authenticated `User`.

> **eat** : 83hHJHfuy382thk/aoJjf3ff/Uafamro==

**BODY** > This endpoint requires a request body with the following syntax:

```javascript
{
    title: <title>,
    content: <content>
}
```

> `title:`  `required String` — A heading for the newly-created `Issue`. 
> `content:` `required String` — A description for the newly-created `Issue`.


**RESPONSE** > Upon validation of the request, this endpoint will send a response in the following syntax:

```javascript
{
    success: <result>,
    message: <message>,
    data: {
        id: <id>
    }
}
```

> `result` — A `Boolean` indicating if the creation of the `Issue` was successful.
> `message` — A `String` that provides information as to the result of the request.
> `id` — The ID of the newly-created `Issue`.



***
###**Vote On Issue** > PUT /issues/[issue_id]

**PURPOSE** > This endpoint is used to cast a vote on an `Issue`.

**PARAMS** > This endpoint supports an `issue_id` parameter which indicates the `Issue` that is being voted on.

*Example:*
PUT /issues/551239583920039

> `issue_id:` `required Number` — Specifies the `issue_id` of the `Issue` that the request's vote is being cast upon.

**HEADERS** > This is a protected endpoint which requires that a valid `access token` be supplied via a custom request header called `eat`. (Endpoint Authentication Token). This token provides the endpoint with identification and context of its respective authenticated `User`.

> **eat** : 83hHJHfuy382thk/aoJjf3ff/Uafamro==

**BODY** > This endpoint requires a request body with the following syntax:

```javascript
{
    vote: <votes>
}
```

> `vote:`  `required String` — The value `yes` to indicate an affirmative/agreeing vote, or `no` to indicate a negating/disagreeing vote for the `Issue` specified by the `issue_id` in the request URL


**RESPONSE** > Upon validation of the request, this endpoint will send a response in the following syntax:

```javascript
{
    success: <result>,
    message: <message>
}
```

> `result` — A `Boolean` indicating if the creation of the `Issue` was successful.
> `message` — A `String` that provides information as to the result of the request.



***
**CREDITS** > *alphabetized*

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*iOS:*

* Randy McLain

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*JavaScript:*

* Aaron Martone
* Eeshan Kumar
* Emre Surmeli
* Jonathan Ullberg

***
**THANKS TO** > NodeJS, Express, Mongoose, Mongoose Validator, MongoDB, EAT, Body Parser, Passport, Passport-HTTP, Gulp, Gulp-JSHint, Gulp-Mocha, Mocha, Chai, ChaiHTTP, JSHint-Stylish, BCrypt and Heroku.