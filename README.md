# Google Doc to HTML

## Installation
```bash
npm i mryan-code-google-docs-to-html googleapis
```

## Usage
```bash
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

const googleDocHTMLArray = googleDocToHTML(googleDocResponse);
```

This package converts a Google Doc to HTML.
