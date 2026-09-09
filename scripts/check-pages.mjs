import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile('dist/index.html','utf8');
const page=new URL('https://example.github.io/sandbox/');
const assets=[...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map(match=>match[1]);
assert.ok(assets.length>=2,'Build must include JavaScript and CSS');
for(const asset of assets){
 const url=new URL(asset,page);
 assert.ok(url.pathname.startsWith('/sandbox/assets/'),`Asset escapes the Pages project path: ${url.pathname}`);
 await access(`dist/${url.pathname.slice('/sandbox/'.length)}`);
}
assert.ok(!html.includes('/src/main.js'),'Pages must serve the build, not source files');
console.log('Pages asset check passed: compiled JS and CSS resolve under a repository subpath.');
