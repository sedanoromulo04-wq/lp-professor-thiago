const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const IGNORE = ['.vercel', 'node_modules', 'watch.js', '.image-slots', 'uploads'];
const DEBOUNCE_MS = 2000;

let timer = null;
let deploying = false;

function deploy() {
  if (deploying) return;
  deploying = true;
  console.log('\n🚀 Alteração detectada — fazendo deploy...\n');
  try {
    execSync('vercel --prod', { stdio: 'inherit', cwd: __dirname });
    console.log('\n✅ Deploy concluído!\n');
  } catch (e) {
    console.error('\n❌ Erro no deploy.\n');
  }
  deploying = false;
}

fs.watch(__dirname, { recursive: true }, (event, filename) => {
  if (!filename) return;
  const shouldIgnore = IGNORE.some(p => filename.includes(p));
  if (shouldIgnore) return;

  clearTimeout(timer);
  timer = setTimeout(deploy, DEBOUNCE_MS);
});

console.log('👁️  Monitorando alterações na pasta do projeto...');
console.log('   Salve qualquer arquivo para disparar o deploy automático.');
console.log('   Pressione Ctrl+C para parar.\n');
