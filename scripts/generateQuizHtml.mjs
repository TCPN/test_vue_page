#!/usr/bin/env node

import ejs from 'ejs';
import fs from 'node:fs';
import path from 'node:path';
import { getQuizsDetails } from './collectQuizList.ts';

const tplPath = process.argv[2] || './src/quizs/quiz.template.html';
const quizsPath = process.argv[3] || './src/quizs';

// read args as files
console.log('List quizs in', quizsPath);
const quizs = await getQuizsDetails(quizsPath);
console.log('Quizs to process:', quizs.map(q => q.key));
const tpl = fs.readFileSync(tplPath).toString();
const renderTpl = ejs.compile(tpl, { filename: tplPath });

for (const { key, quizDir, ...meta } of quizs) {
  console.log(`Processing ${key}...`);
  const rendered = renderTpl({ ...meta });
  const outFile = path.resolve(quizDir, 'index.html');
  fs.writeFileSync(outFile, rendered);
  console.log(`Generated ${outFile}`);
}
