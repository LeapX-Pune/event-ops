const fs = require('fs');

const keywordMap = {
  'evt_033': 'symphony,orchestra',
  'evt_034': 'dj,festival',
  'evt_035': 'jazz,band',
  'evt_036': 'rock,concert',
  'evt_037': 'piano,recital',
  'evt_038': 'marathon,runner',
  'evt_039': 'tennis,match',
  'evt_040': 'football,stadium',
  'evt_041': 'snowboard,extreme',
  'evt_042': 'basketball,court',
  'evt_043': 'modern,art',
  'evt_044': 'sculpture,museum',
  'evt_045': 'digital,vr',
  'evt_046': 'renaissance,painting',
  'evt_047': 'abstract,art',
  'evt_048': 'startup,pitch',
  'evt_049': 'fintech,finance',
  'evt_050': 'leadership,speaker',
  'evt_051': 'ecommerce,laptop',
  'evt_052': 'realestate,building',
  'evt_053': 'streetfood,market',
  'evt_054': 'wine,tasting',
  'evt_055': 'vegan,salad',
  'evt_056': 'baking,pastry',
  'evt_057': 'seafood,grill',
  'evt_058': 'spa,retreat',
  'evt_059': 'yoga,meditation',
  'evt_060': 'medicine,doctor',
  'evt_061': 'therapy,mentalhealth',
  'evt_062': 'nutrition,healthy',
  'evt_063': 'edtech,classroom',
  'evt_064': 'university,campus',
  'evt_065': 'language,study',
  'evt_066': 'science,laboratory',
  'evt_067': 'writing,notebook'
};

const content = fs.readFileSync('js/data/events.js', 'utf8');

const startIndex = content.indexOf("id: 'evt_033'");
if (startIndex === -1) {
  console.log("evt_033 not found!");
  process.exit(1);
}

const before = content.substring(0, startIndex);
let after = content.substring(startIndex);

after = after.replace(/image:\s*['"][^'"]+['"]/g, (match, offset, fullText) => {
  const beforeMatch = fullText.substring(Math.max(0, offset - 300), offset);
  const idMatch = beforeMatch.match(/id:\s*['"](evt_\d+)['"]/);
  const id = idMatch ? idMatch[1] : null;
  
  if (id && keywordMap[id]) {
    const num = id.replace('evt_', '');
    return `image: 'https://loremflickr.com/800/600/${keywordMap[id]}?lock=${num}'`;
  }
  
  return match; // fallback
});

fs.writeFileSync('js/data/events.js', before + after);
console.log('Successfully applied accurate keywords to new images!');
