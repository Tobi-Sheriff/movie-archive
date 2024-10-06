const fs = require('fs');
const path = require('path');

async function namefunct(params) {
    // await fs.promises.writeFile(path.join(__dirname, './test/movies.json'), 'welcome');

    const content = await fs.promises.readFile(path.join(__dirname, './test/movies.json'), 'utf8');
    console.log(content);

}

namefunct();
