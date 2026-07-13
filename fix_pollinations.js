const fs = require('fs');

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
  
  // Extract Title
  const titleMatch = beforeMatch.match(/title:\s*['"]([^'"]+)['"]/);
  const title = titleMatch ? titleMatch[1] : 'event';
  
  // Extract Category
  const catMatch = beforeMatch.match(/category:\s*['"]cat_([^'"]+)['"]/);
  const cat = catMatch ? catMatch[1] : '';

  // Build a highly descriptive prompt
  const prompt = `${title} ${cat} high quality professional photography no text`;
  const encodedPrompt = encodeURIComponent(prompt);
  
  return `image: 'https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true'`;
});

fs.writeFileSync('js/data/events.js', before + after);
console.log('Successfully updated new images to use AI generated high quality images via pollinations.ai!');
