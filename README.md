
#iRepresent
###Because Political App-athy has its Issues™

iRepresent is an iPhone application that allows users to become vested in the political happenings of King County, Washington. You can bring to light and harness the collective will of the people to champion your issue's cause and even take part in the democratic process by voting your say on new and popular topics.

[Download it FREE, on the App Store](https://store.apple.com/iRepresent)

***

##**API Reference**
###Authenticate to Application (GET /sign_in)

**EXAMPLE:**
HTTPS/1.1 GET https://`host`:`port`/sign_in

> `host` — The hostname/ip address where the iRepresent application resides.
> `port` — The port the iRepresent application is running off of (omit if `80`).

**PURPOSE:**
Used to authenticate a user to the application. Successful authentication results in the creation of an `access_token` which is used to provide subsequent authentication to protected endpoints.

***

**REQUEST PARAMETERS:**
`none`

***

**REQUEST HEADERS:**
In order to authenticate to the `/sign_in` endpoint, the user/client must provide a Basic HTTP authentication `Authorization` header that is comprised of a base64-encoded concatenation of the username and password joined by a colon. i.e., `username:password`

> **Authorization**: Basic cmFpbmJvd2ZhcnRpbmc6dW5pY29ybnM=

***

**REQUEST BODY:**
`none`

***

**RESPONSE BODY:**
```javascript
{
success: <result>,
msg: <message>,
data: {
token: <token>
} 
}
``` 

> `result` — A boolean indicating the success of the user authentication request.
> `message` — Information regarding the result of the user authentication request.
> `token` — The value of the `access_token` used to subsequently authenticate the user to the application.

***

##**Endpoints > users**

###Create a New User (POST /users)
***

**EXAMPLE:**
HTTPS/1.1 POST https://`host`:`port`/users

> `host` — The hostname/ip address where the iRepresent application resides.
> `port` — The port the iRepresent application is running off of (omit if `80`).

**PURPOSE:**
Used to create a new user into the application. Successful creation will result in the automatic logging in (and subsequent issuing of an `access_token` to) the user.

**REQUEST PARAMETERS:**
`none`

**REQUEST HEADERS:**
`none`

**REQUEST BODY:**
```javascript
{
username: <username>,
password: <password>,
email: <email>
}
```

> `username` — The account name of the newly created user.
> `password` — The password of the newly created user.
> `email` — The email address of the newly created user.

**RESPONSE BODY:**

```javascript
{
success: <result>,
msg: <message>,
data: {
token: <token>
}
}
```
> `result` — A boolean indicating the success of the user creation request.
> `message` — Information regarding the result of the user creation request.
> `token` — The value of the `access_token` used to subsequently authenticate the user to the application.

***

##**Endpoints > issues**

###Retrieve a List of User Issues (GET /issues)
***

**EXAMPLE:**
HTTPS/1.1 GET https://`host`:`port`/issues[?sort=`sort`]

> `host` — The hostname/ip address where the iRepresent application resides.
> `port` — The port the iRepresent application is running off of (omit if `80`).
> `sort` — *(optional)* The sorting of returned `Issue` objects. The `popular` value (default) uses an algorithm to find issues which have a close spread of yes and no votes, weighed proportionally with higher count values, whereas the `newest` value lists the most recently created issues first.

**PURPOSE:**
Used to return a list of `Issue` objects that the user has voted on. The `access_token` that authenticates the user to this endpoint will be used to ensure that only issues which the user has voted yes or no on are returned in this feed.

**REQUEST PARAMETERS:**
> `sort` — Indicates the sorting preference for the returned `Issue` objects. Defaults to `popular` when unspecified.

**REQUEST HEADERS:**
This is a protected endpoint that requires a valid `access_token` that can be obtained from authenticating to the `/sign_in` endpoint or creating a user through the `/users` endpoint.

> **Token**: sajrh23h/JK9uiwrr9jJ/A2r0ipalallmfmqwru8sFG2jalsd==

**REQUEST BODY:**
`none`

**RESPONSE BODY:**

```javascript
{
success: <result>,
msg: <message>,
data: {
<data>
}
}
```
> `result` — A `Boolean` indicating the success of the user issues request.
> `message` — Information regarding the result of the user issues request.
> `data` — An `Array` of 0 or more `Issue` objects in which the authenticated user has voted and ordered via the method specified by the optional `sort` request parameter.

**ISSUE OBJECTS:**
An example of an `Issue` object is provided below for reference:

```javascript
{
author_id: <author>,
title: <title>,
content: <content>,
votes: {
yes: <yes_votes>,
no: <no_votes>
},
date_created: <created>
}
```
> `author` — The `user_id` who created the `Issue`.
> `title` — A display heading for the `Issue`.
> `content` — A description of the `Issue`.  
> `yes_votes` — A tally of the affirmative votes on the `Issue`.
> `no_votes` — A tally of the negative votes on the `Issue`.
> `created` — The date and time that the `Issue` was created.

***

###Create a New Issue (POST /issues)
***

**EXAMPLE:**
HTTPS/1.1 POST https://`host`:`port`/issues

> `host` — The hostname/ip address where the iRepresent application resides.
> `port` — The port the iRepresent application is running off of (omit if `80`).

**PURPOSE:**
Used to create a new issue in the application.

**REQUEST PARAMETERS:**
`none`

**REQUEST HEADERS:**
This is a protected endpoint that requires a valid `access_token` that can be obtained from authenticating to the `/sign_in` endpoint or creating a user through the `/users` endpoint.

> **Token**: sajrh23h/JK9uiwrr9jJ/A2r0ipalallmfmqwru8sFG2jalsd==

**REQUEST BODY:**

```javascript
{
title : <title>,
content : <content>
}
```

> `title` — The heading of the newly created `Issue`.
> `content` — Descriptive information of the newly created `Issue`.

**RESPONSE BODY:**

```javascript
{
success: <result>,
msg: <message>
}
```
> `result` — A boolean indicating the success of the user issue request.
> `message` — Information regarding the result of the user issue request.

***

###Cast a Vote on an Issue (PUT /issues/id)
***

**EXAMPLE:**
HTTPS/1.1 PUT https://`host`:`port`/issues/`issue_id`

> `host` — The hostname/ip address where the iRepresent application resides.
> `port` — The port the iRepresent application is running off of (omit if `80`).
> `issue_id` — The `issue_id` of the `Issue` that the vote is casted on.

**PURPOSE:**
Used to update the vote count of an `Issue`.

**REQUEST PARAMETERS:**
`none`

**REQUEST HEADERS:**
This is a protected endpoint that requires a valid `access_token` that can be obtained from authenticating to the `/sign_in` endpoint or creating a user through the `/users` endpoint.

> **Token**: sajrh23h/JK9uiwrr9jJ/A2r0ipalallmfmqwru8sFG2jalsd==

**REQUEST BODY:**
```javascript
{
vote : <vote>
}
```
> `vote` — A `Boolean` value, indicating an affirmative vote if `true` and a negative vote it `false`.

**RESPONSE BODY:**

```javascript
{
success: <result>,
msg: <message>
}
```
> `result` — A boolean indicating the success of the vote cast request.
> `message` — Information regarding the result of the vote cast request.

***
**CREDITS:**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*iOS:*

* Randy McLain

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*JavaScript:*

* Aaron Martone
* Eeshan Kumar
* Emre Surmeli
* Jonathan Ullberg

**TO DO:**

