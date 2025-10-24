import path from 'node:path';
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

export function listQuizs(dirPath: string) {
  const result = execSync(`ls ${dirPath}`).toString();
  return result.split('\n').filter(s => s.startsWith('ep'));
}

export async function getQuizsDetails(dirPath: string) {
  const quizDirs = listQuizs(dirPath);
  return Promise.all(quizDirs.map(async (quizName) => {
    const quizDir = path.join(dirPath, quizName);
    const metaPath = path.join(quizDir, 'meta.js');
    const meta = await import(path.resolve(metaPath));
    return { key: quizName, quizDir, link: `./${quizName}/`, ...meta };
  }));
}

if (import.meta.main) {
  const quizsDir = process.argv[2];
  const outputFile = process.argv[3];
  const quizs = await getQuizsDetails(path.resolve(quizsDir));
  writeFileSync(outputFile, `export const quizs = ${JSON.stringify(quizs, null, 2)};\n`);
  console.log(`Found ${quizs.length} quizs and wrote to`, outputFile);
}
