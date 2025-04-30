# Google Doc to HTML

## Description
This package converts a Google Doc to HTML.

## Note
I'm sure you're already familiar with the [googleapis](https://github.com/googleapis/google-api-nodejs-client) package, and the [path](https://nodejs.org/api/path.html) package. Incase not, I included a basic example of how to use em below.

## Installation
```bash
npm i mryan-code-google-docs-to-html googleapis path
```

## Usage
```javascript
import { google } from "googleapis";
import { googleDocToHTML } from "mryan-code-google-docs-to-html";
const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve("google-service.json"),
    scopes: ["https://www.googleapis.com/auth/documents.readonly"],
});
google.options({
    timeout: 10000,
    auth: auth,
});
const docs = google.docs("v1");
const googleDocResponse = await docs.documents.get("whatever_id");
const googleDocHTMLArray = await googleDocToHTML(googleDocResponse);
```
