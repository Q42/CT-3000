# CT-3000
Tool for Computational Thinking classes for children age 8 to 12. See it working at [www.ct3000.nl](http://www.ct3000.nl/#/tool). Built by [Q42](https://www.q42.com) together with [Blink](https://www.blink.nl/educatie) and [CodeUur](http://www.codeuur.nl).

Accompanying classroom material is available for free at https://wereld.blink.nl/7-8/smart-life. It contains preparation material, handouts and digibord presentations to fill five hours of class. Be aware it's all in Dutch!

Interested in this project? Mail  [lukas@q42.nl](mailto:lukas@q42.nl).

## Why another tool?

When teaching children to code, usually [Scratch](https://scratch.mit.edu/) or a similar block-based programming tool is used. But these tools are pretty far away from what professional developers daily use.

On the other hand, getting into Javascript, Python, Ruby or whatever other programming language, requires children to know both English and a difficult syntax.

So we set out to build a tool that's in between. Children are introduced to the concept of variables and IF-THEN statements. In their own language, with minimal syntax difficulties. That makes it limiting, but also powerful in a classroom setting where the teacher doesn't necessarily know programming, but can give the class anyway.

## Working with CT-3000

When you open the editor, at the bottom you see all your variables and their state after running your code.

On the left is where you type the code, on the right is the preview of how the computer interprets it.

In the code editor, type `deur = open`. As you can see in the variables, the door is now open at the end of running your code.

Now on the next line, type `als deur = open dan kat = buiten`. In the preview, you'll see that the computer notices that the door is open, and let's the cat outside.

There are a lot more options, just try out the cheat sheet below. You can even play internet radio!

### Cheat sheet
```
lamp = aan / uit
weer = goed / slecht
deur = open / dicht
bericht = "...."
muziek = 3fm / sky/ klassiek / jazz / uit
kat = binnen / buiten
tijd = 11:45

lamp = (rood,groen,blauw), for example lamp = (255,0,100)
tijd > 11:45 (later dan 11:45)
tijd < 11:45 (eerder dan 11:45)

als ... dan ...
als ... en ... dan ... en ...
```

### Examples
Set the lamp to full red
```
lamp = aan
lamp = (255,0,0)
```

When the door opens at night, welcome home!
```
als deur = open en tijd > 17:00 dan lamp = aan en muziek = jazz en bericht = "Welkom thuis!"
```

## Developing

Clone the repo, cd into it and install dependencies:
```
git clone git@github.com:q42/ct-3000.git
cd ct-3000
npm install
```

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
