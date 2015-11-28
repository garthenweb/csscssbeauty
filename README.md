# CSSCSS Beauty
Executes [CSSCSS](http://zmoazeni.github.io/csscss/) and shows the result beautified on a local server. The result will automatically be updated once a file change.

## Installation

Install [NodeJS](http://nodejs.org/), [NPM](https://npmjs.org/), [Ruby](https://www.ruby-lang.org) and [CSSCSS](http://zmoazeni.github.io/csscss/).

Then install CSSCSSBeauty by npm:

``` bash
npm install csscssbeauty -g
```

## Usage

``` bash
csscssbeauty --port=9999 --browser=Chrome /path/to/file_1.css /path/to/file_2.css  /path/to/file_n.css
```

* `port` is optional, default is 8787.
* `browser` is optional, default is the default browser. Set to false if no browser should be opened.
