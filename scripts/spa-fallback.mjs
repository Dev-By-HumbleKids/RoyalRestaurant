// GitHub Pages serves 404.html for unknown paths; copying index.html lets the SPA router handle deep links.
import { copyFileSync } from 'node:fs';
copyFileSync('dist/index.html', 'dist/404.html');
console.log('SPA fallback: dist/404.html created');
