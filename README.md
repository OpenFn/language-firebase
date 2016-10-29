Language firebase
==================

Language Pack for building expressions and operations to make HTTP calls to
firebase.

Documentation
-------------
## fetchData
`fetchData(1,2,3)` takes three arguments:

1. the `endpoint` of the data on firebase

2. the `query`, a date string or UNIX timestamp which instructs the job to only fetch submissions after a certain date. After the first run of the job, subsequent runs will only fetch *NEW* submissions.

3. the `postUrl` is where the wide-format JSON representation of each form submission should be sent. Note that a `formId` key will be added to each form submission for later filtering/routing.

#### sample configuration
```js
{
  "username": "taylor@openfn.org",
  "password": "supersecret",
  "baseUrl": "https://something.firebase.com"
}
```

### sample fetchSubmissions expression

```js
fetchData({
    "getEndpoint": "Observations.json",
    "query": function(state) {
        return {"orderBy": `\"id\"`, "limitToLast": state.lastSubmissionDate }
    },
    "postUrl": "https://www.openfn.org/inbox/your-uuid"
})
```

[Docs](docs/index)


Development
-----------

Clone the repo, run `npm install`.

Run tests using `npm run test` or `npm run test:watch`

Build the project using `make`.
