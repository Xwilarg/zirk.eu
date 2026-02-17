# zirk.eu
Welcome on my website source code!

This repository is more as a reference points, if you want to look how the website is done etc but isn't really meant to be self-hosted because of some submodules being private, you'll however still find instructions on how to install dependencies etc

## Requirements
- imagemagick
- gifsicle
- npm i

Run scripts/resize.ps1 to resize images (compress some of them to make them less big)

you can then run `npm i` and `npm run build`

## Dependencies
Outside of those declared in the package.json, this project use the following others dependencies:

- http://github.com/Xwilarg/Lifeline: /life page of the website
- https://github.com/Xwilarg/zirk.eu-data (private): contains lot of info about the website content
- https://github.com/Xwilarg/zirk.eu-gamejam (private): contains the gamejams WebGL builds