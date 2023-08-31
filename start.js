const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./script_enum.json', 'utf8'));
const scriptName = config.scriptName || 'defaultScript';

const script = require(`./dist/${scriptName}`);

// Your startup logic here
