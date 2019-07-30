// Process {markup} and {key: markup}

'use strict';

// same as UNESCAPE_MD_RE plus a space
var UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;
const left_bracket = 0x7B /* { */
const right_bracket = 0x7D /* } */
const colon = 0x3A /* : */  

function markup(state, silent) {
  var found,
    colonPos = 0,
    keyContent = "",
      content,
      token,
      max = state.posMax,
      start = state.pos;

  if (state.src.charCodeAt(start) !==left_bracket /*0x5E ^ */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode
  if (start + 2 >= max) { return false; }

  state.pos = start + 1;

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === colon /*0x5E ^ */) {
      colonPos = state.pos;
    }

    if (state.src.charCodeAt(state.pos) === right_bracket /*0x5E ^ */) {
      found = true;
      break;
    }

    state.md.inline.skipToken(state);
  }

  if (!found || start + 1 === state.pos) {
    state.pos = start;
    return false;
  }

  if (colonPos > 0) {
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
  token         = state.push('chptr_open', 'span class=\'chptr-markup\'', 1);
  token.markup  = '{';

  if (keyContent) {
    token = state.push('chptr_key_open', 'span class=\'chptr-key\'', 1)    
    token = state.push('text', '', 0)
    token.content = keyContent.replace(UNESCAPE_RE, '$1');
    token = state.push('chptr_key_close', 'span', -1);
  }

  token         = state.push('text', '', 0);
  token.content = content.replace(UNESCAPE_RE, '$1');

  token         = state.push('chptr_close', 'span', -1);
  token.markup  = '}';

  state.pos = state.posMax + 1;
  state.posMax = max;
  return true;
}


module.exports = function chptr_plugin(md) {
  md.inline.ruler.after('emphasis', 'chptr', markup);
};
