const fs = require('fs');

function fixMojibake(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');

  // Common mojibake patterns: UTF-8 bytes double-encoded as Latin-1 then re-encoded as UTF-8
  const fixMap = [
    // naira sign ₦
    ['â¦', '₦'],
    // superscript 2 ²
    ['Â²', '²'],
    // superscript 3 ³
    ['Â³', '³'],
    // middle dot ·
    ['Â·', '·'],
    // multiplication sign ×
    ['Ã·', '×'],
    // em dash —
    ['â', '—'],
    // en dash –
    ['â', '–'],
    // sun ☀ + variation selector
    ['â', '☀️'],
    // sunrise 🌅
    ['ð', '🌅'],
    // crescent moon 🌙
    ['ð', '🌙'],
    // house 🏠
    ['ð ', '🏠'],
    // brick 🧱
    ['ð§±', '🧱'],
    // door 🚪
    ['ðª', '🚪'],
    // key 🔑
    ['ð', '🔑'],
    // window 🪟
    ['ðª', '🪟'],
    // left-right arrow ↔
    ['âï¸', '↔️'],
    // down arrow ⬇
    ['â¬ï¸', '⬇️'],
    // sparkles ✨
    ['â¨', '✨'],
    // check mark ✅
    ['â', '✅'],
    // black square ⬛
    ['â¬', '⬛'],
    // couch 🛋️
    ['ðï¸', '🛋️'],
    // telescope 🔭
    ['ð­', '🔭'],
    // construction crane 🏗️
    ['ðï¸', '🏗️'],
    // gear ⚙️
    ['âï¸', '⚙️'],
    // lightning ⚡
    ['â¡', '⚡'],
    // warning ⚠️
    ['â ï¸', '⚠️'],
    // light bulb 💡
    ['ð¡', '💡'],
    // robot 🤖
    ['ð¤', '🤖'],
    // clipboard 📋
    ['ð', '📋'],
    // castle 🏰
    ['ð°', '🏰'],
    // palette 🎨
    ['ð¨', '🎨'],
    // shower 🚿
    ['ð¿', '🚿'],
    // bucket 🪣
    ['ðª£', '🪣'],
    // ladder 🪜
    ['ðª', '🪜'],
    // tractor 🚜
    ['ð', '🚜'],
    // window 🪟 (another variant)
    ['ðª', '🪟'],
    // bar chart 📊
    ['ð', '📊'],
    // floppy disk 💾
    ['ð¾', '💾'],
    // printer 🖨️
    ['ð¨ï¸', '🖨️'],
    // mobile phone 📲
    ['ð²', '📲'],
  ];

  let count = 0;
  fixMap.forEach(([bad, good]) => {
    const before = c.split(bad).length - 1;
    if (before > 0) {
      c = c.split(bad).join(good);
      count += before;
      console.log('  Fixed', before, 'x:', JSON.stringify(bad.substring(0,6)), '->', good);
    }
  });

  fs.writeFileSync(filePath, c, 'utf8');
  console.log('Total fixes in', filePath + ':', count);
}

fixMojibake('C:/Users/HP/Buildmart/frontend/src/components/Visualizer3D.js');
fixMojibake('C:/Users/HP/Buildmart/frontend/src/components/Estimator.js');
console.log('All done!');
