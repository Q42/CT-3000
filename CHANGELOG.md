# next



# 2.0.0

* Moved hosting from Google Cloud Storage to Firebase Hosting, enabling pretty URL's
* Replaced hash routing with browser history routing. The old routes redirect to the new ones, so `/#/tool` redirects to `/nl/tool`
* When navigating to the digiboard, the ID is set in the URL. This way, when a teacher (accidentally) refreshes the digibord, the ID stays the same
* Made the tool multilingual, added English and German (`/de/tool` and `/en/tool`). The landingpage is still only in Dutch
* Added mouseovers to the variables at the bottom of the screen, so users can see the name of the variable, it's usage, and an example.
* Made the landingpage responsive so users on a phone/tablet can still read it and hit the `Aan de slag` button.
* Added google analytics page tracking. Mainly so we can see if it's used at all :)
* Improved database usage, the tool only accesses the database when a digibord ID has been provided in code
* Added templates to preload code, currently only using `nl/welkom`: https://ct-3000.firebaseapp.com/nl/tool/welkom
* Bugfix: the `message` value is no longer lowercased in the preview screen
* Upgraded all `npm` dependencies
* *beta*: Project the value of `lamp` variable on your Philips Hue lights: https://ct-3000.firebaseapp.com/nl/tool/hue

# 1.0.0

initial release