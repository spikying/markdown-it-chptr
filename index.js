// Process {markup} and {key: markup}

'use strict';

// same as UNESCAPE_MD_RE plus a space
var UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;
const leftBracket = 0x7B; /* { */
const rightBracket = 0x7D; /* } */
const colon = 0x3A; /* : */

function markup(state, silent) {
  var found,
    isParagraph = false,
    colonPos = 0,
    keyContent = '',
      content,
      token,
      max = state.posMax,
      start = state.pos;

  if (state.src.charCodeAt(start) !== leftBracket /*0x5E ^ */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode
  if (start + 2 >= max) { return false; }

  state.pos = start + 1;

  if (state.src.charCodeAt(state.pos) === leftBracket && state.src.charCodeAt(max - 1 === rightBracket)) {
    isParagraph = true;
  }

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === colon) {
      colonPos = state.pos;
    }

    if (state.src.charCodeAt(state.pos) === rightBracket ) {
      found = true;

      if (isParagraph && state.src.charCodeAt(state.pos + 1) === rightBracket) {
        state.md.inline.skipToken(state);
      }

      break;
    }

    state.md.inline.skipToken(state);
  }


  if (!found || start + 1 === state.pos) {
    state.pos = start;
    return false;
  }

  if (isParagraph) {
    content = state.src.slice(start + 2, state.pos - 1);
  } else if (colonPos > 0) {
    keyContent = state.src.slice(start + 1, colonPos);
    content = state.src.slice(colonPos + 1, state.pos);
   } else {
    content = state.src.slice(start + 1, state.pos);
  }

  // // don't allow unescaped spaces/newlines inside
  // if (content.match(/(^|[^\\])(\\\\)*\s/)) {
  //   state.pos = start;
  //   return false;
  // }

  // found!
  state.posMax = state.pos;
  state.pos = start + 1;

  // Earlier we checked !silent, but this implementation does not need it
  if (isParagraph) {
    token = state.push('chptr_para_open', 'span class=\'chptr-para\'', 1);
    token.markup = '{{';
  } else if (keyContent) {
    token = state.push('chptr_key_open', 'span class=\'chptr-key\'', 1);
    token.markup = '{';
    token = state.push('text', '', 0);
    token.content = keyContent.replace(UNESCAPE_RE, '$1');
    token = state.push('chptr_key_close', 'span', -1);
    token = state.push('chptr_key_open', 'span class=\'chptr-value\'', 1);
    token.markup = ':';
  } else {
    token = state.push('chptr_open', 'span class=\'chptr-markup\'', 1);
    token.markup = '{';
  }

  token = state.push('text', '', 0);
  token.content = content.replace(UNESCAPE_RE, '$1');

  if (isParagraph) {
    token = state.push('chptr_para_close', 'span', -1);
    token.markup = '}}';
  } else if (keyContent) {
    token = state.push('chptr_key_close', 'span', -1);
  } else {
    token = state.push('chptr_close', 'span', -1);
    token.markup = '}';
  }


  state.pos = state.posMax + 1;
  state.posMax = max;
  return true;
}

/*eslint camelcase: ignore*/
module.exports = function chptrPlugin(md) {
  md.inline.ruler.after('emphasis', 'chptr', markup);
};
