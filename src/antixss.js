const sanitizeHtml = require('sanitize-html');

function escapeHtml(str) {
  return sanitizeHtml(str, {
    allowedTags: ['b', 'i', 'em', 'strong', 'u', 'a'],
    allowedAttributes: {
      'a': [ 'href' ]
    },
    allowedSchemes: ['https']
  });
}

module.exports = { escapeHtml };