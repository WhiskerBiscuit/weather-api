const fs = require('fs');
let htmlTemplate = '';

// Load HTML template on server start
fs.readFile('./build/index.html', (err, html) => {
    if (err) {
        throw err;
    }
    htmlTemplate = html;
});

module.exports = () => {
    return htmlTemplate;
};
