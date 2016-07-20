# CT-3000
Tool for Computational Thinking classes for children age 8 to 12. Built by [Q42](https://www.q42.com) together with [Blink](https://www.blink.nl/educatie) and [CodeUur](http://www.codeuur.nl).

Accompanying classroom material is available for free at https://wereld.blink.nl/7-8/smart-life. It contains preparation material, handouts and digibord presentations to fill five hours of class. Be aware it's all in Dutch!

Interested in this project? Mail [lukas@q42.nl](mailto:lukas@q42.nl).

## Installing

Clone the repo, cd into it and install dependencies:
```
git clone git@github.com:q42/ct-3000.git
cd ct-3000
npm install
```

## Developing

Start your development environment on http://localhost:8000:
```
npm run start
```

### How the parser works

All parsing is handled in the `classes/parser.js` file. A string is tokenized by the `canto34` packages and the tokens are inserted in a promise-tree for parsing. This tree recognizes the following language:

```
sentence =  statements || if-else-construct
statements = statement || statement :: and :: statements
statement = object :: operator :: value
object = STRING
operator = '=' || '>' || '<'
value = STRING || 'string'
if-else-construct = if :: statements :: then :: statements
```

The resulting parsed object (if valid) is returned and evaluated. Based on the objects and rules in `classes/parser.js` the new value is assigned (Redux store) and propagated to the corresponding components for rendering.

## Deploying

The project has no back-end. It can be installed as a static website. The version at http://www.ct3000.nl is hosted on Google Cloud Storage. To use connection with the digibord, it uses a Google Firebase  connection.

Step 1: get some google stuff on your machine:
```
TODO install gsutil
TODO authenticate
```

Step 2: create a release into the dist directory:
```
npm run release
```

Step 3: sync the release to the GCS bucket:
```
npm run deploy
```

### Setting up your GCS bucket

Step 1: default READ access for all users:
```
gsutil defacl ch -u AllUsers:R gs://www.ct3000.nl
```

Step 2: serve index.html (when root is accessed) and 404.html (when page not found):
```
gsutil web set -m index.html -e 404.html gs://www.ct3000.nl
```

## License

This project is licensed under the terms of the MIT license.
