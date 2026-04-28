const fs = require('fs');

const lines = fs.readFileSync('zones.txt', 'utf-8').trim().split('\n');
const data = [];

for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split('\t');
    if (parts.length >= 2) {
        data.push({
            cve: parts[0].trim(),
            mun: parts[1].trim(),
            region: parts.length > 2 ? parts[2].trim() : ''
        });
    }
}

if (!fs.existsSync('src/data')) {
    fs.mkdirSync('src/data', { recursive: true });
}

fs.writeFileSync('src/data/zones.json', JSON.stringify(data, null, 2), 'utf-8');
console.log('Successfully generated src/data/zones.json with ' + data.length + ' records.');
