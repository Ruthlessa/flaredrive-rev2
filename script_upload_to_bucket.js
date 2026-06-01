#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('https');

const BUCKET_ID = 'A5Jj-eCv2slk';
const COOKIE = 'session_token_here'; // 暂时用手动上传更简单

console.log('=== 10张图片准备就绪 ===');
console.log('目录: /tmp/random_images/');
console.log('现在请手动上传这10张图片到:');
console.log('  https://asq.mcaq.us.ci/bucket/A5Jj-eCv2slk/');
console.log('');

const files = fs.readdirSync('/tmp/random_images/');
console.log(`共 ${files.length} 张图片:`);
files.forEach(file => console.log(`  - ${file}`));
