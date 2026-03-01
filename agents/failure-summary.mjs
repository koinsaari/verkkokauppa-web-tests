import { readFileSync, appendFileSync } from 'fs';

const RESULTS_FILE = 'test-results/results.json';
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'llama3.2:3b';

function extractFailures(suites) {
  const failures = [];
  for (const suite of suites) {
    if (suite.suites) failures.push(...extractFailures(suite.suites));
    if (suite.specs) {
      for (const spec of suite.specs) {
        for (const test of spec.tests) {
          const last = test.results[test.results.length - 1];
          if (last.status === 'failed' || last.status === 'timedOut') {
            failures.push({
              title: spec.title,
              file: suite.title,
              error: last.error?.message?.split('\n')[0] ?? 'Unknown error',
            });
          }
        }
      }
    }
  }
  return failures;
}

let results;
try {
  results = JSON.parse(readFileSync(RESULTS_FILE, 'utf-8'));
} catch {
  console.error(`Could not read ${RESULTS_FILE}, run playwright test first.`);
  process.exit(1);
}

const failures = extractFailures(results.suites ?? []);

if (failures.length === 0) {
  console.log('✅ All tests passed, nothing to analyze.');
  process.exit(0);
}

console.log(`\n❌ ${failures.length} test(s) failed. Asking ${MODEL} for analysis...\n`);

const prompt = `You are a QA engineer reviewing Playwright e2e test failures for verkkokauppa.com.

Failed tests:
${failures.map((f) => `Test: ${f.title}\nError: ${f.error}`).join('\n\n')}

For each failure give: one sentence on the likely cause and one sentence on what to fix or check. Be direct and specific.`;

let summary;
try {
  const res = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt, stream: false }),
  });
  const data = await res.json();
  summary = data.response;
} catch {
  console.error('Could not reach Ollama. Is it running?');
  process.exit(1);
}

console.log('=== AI Failure Analysis ===\n');
console.log(summary);

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `## AI Test Failure Analysis\n\n${failures.length} test(s) failed.\n\n${summary}\n`
  );
}
