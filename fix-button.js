const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) { 
        results = results.concat(walk(file));
      } else { 
        results.push(file);
      }
    });
  } catch (e) {}
  return results;
}
const files = walk('./app').concat(walk('./_legacy_routes')).concat(walk('./components'));
files.forEach(f => {
  if (f.endsWith('.tsx') || f.endsWith('.ts')) {
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes('@/components/ui/Button')) {
      fs.writeFileSync(f, content.replace(/@\/components\/ui\/Button/g, '@/components/ui/button'));
      console.log('Fixed:', f);
    }
  }
});
