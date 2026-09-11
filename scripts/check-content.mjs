import fs from 'node:fs';import path from 'node:path';
const errors=[];const forbidden=/\u2014|&mdash;|&#0*8212;|&#x0*2014;/i;
for(const dir of ['app','components/eon','components/campaign','lib/eon','docs','tests']){for(const file of fs.readdirSync(dir,{recursive:true})){const p=path.join(dir,file);if(fs.statSync(p).isFile()&&/\.(tsx?|jsx?|mjs|md|json|css)$/.test(p)&&forbidden.test(fs.readFileSync(p,'utf8').replace(/^export function cleanText.*$/m,'')))errors.push(p);}}
if(forbidden.test(fs.readFileSync('README.md','utf8')))errors.push('README.md');
if(errors.length){console.error('Forbidden punctuation in:',errors);process.exit(1);}console.log('Authored source and published content punctuation check passed.');
