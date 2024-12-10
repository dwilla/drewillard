const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../node_modules/amazon-ivs-player/dist/assets/');
const targetDir = path.join(__dirname, '../public/');

// Create public directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

// Copy WASM files
['amazon-ivs-wasmworker.min.wasm', 'amazon-ivs-wasmworker.min.js'].forEach(file => {
  fs.copyFileSync(
    path.join(sourceDir, file),
    path.join(targetDir, file)
  );
});

console.log('IVS files copied successfully!'); 