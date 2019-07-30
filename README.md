# markdown-it-chptr

[![NPM version](https://img.shields.io/npm/v/markdown-it-chptr.svg?style=flat)](https://www.npmjs.org/package/markdown-it-chptr)
[![Coverage Status](https://img.shields.io/coveralls/spikying/markdown-it-chptr/master.svg?style=flat)](https://coveralls.io/r/spikying/markdown-it-chptr?branch=master)

> Chptr plugin for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser.  Formats {markup} and {key: markup} notations.

`something {marked} with some {foo: bar baz}` => `something <span class='chptr-markup'>marked</span> with some <span class='chptr-markup'><span class='chptr-key'>foo</span>bar baz</span>`

Markup is based on [chptr](https://github.com/spikying/chptr) definitions.


## Install

node.js, browser:

```bash
npm install markdown-it-chptr
bower install markdown-it-chptr --save
```

## Use

```js
var md = require('markdown-it')()
            .use(require('markdown-it-chptr'));

md.render('something {marked} with some {foo: bar baz}') // => '<p>something <span class='chptr-markup'>marked</span> with some <span class='chptr-markup'><span class='chptr-key'>foo</span>bar baz</span></p>'
```

_Differences in browser._ If you load script directly into the page, without
package system, module will add itself globally as `window.markdownitChptr`.


## License

Based on Markdown-it-sup
[MIT](https://github.com/spikying/markdown-it-chptr/blob/master/LICENSE)
