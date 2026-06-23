const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'Imagens-tetos');
const files = fs.readdirSync(dir);

let appJsPath = path.join(__dirname, 'app.js');
let appJsContent = fs.readFileSync(appJsPath, 'utf8');

files.forEach((file, index) => {
  const ext = path.extname(file);
  const newName = `projeto-${index + 1}${ext.toLowerCase()}`;
  
  // Renomeia o arquivo
  fs.renameSync(path.join(dir, file), path.join(dir, newName));
  
  // Substitui no app.js
  // Escapa caracteres especiais para a regex
  const safeFileName = file.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(safeFileName, 'g');
  appJsContent = appJsContent.replace(regex, newName);
});

fs.writeFileSync(appJsPath, appJsContent);
console.log('Arquivos renomeados e app.js atualizado com sucesso.');
