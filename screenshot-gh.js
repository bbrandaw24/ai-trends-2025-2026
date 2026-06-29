const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const outputDir = path.resolve('screenshots');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const sections = [
  { selector: '.hero', name: '01-Hero' },
  { selector: '#agent', name: '02-AgentEvolution' },
  { selector: '#cost', name: '03-ReasoningCost' },
  { selector: '#multimodal', name: '04-Multimodal' },
  { selector: '#edge', name: '05-EdgeIntelligence' },
  { selector: '#vertical', name: '06-VerticalIndustry' },
  { selector: '#governance', name: '07-Governance' },
  { selector: '#data', name: '08-KeyData' },
  { selector: '#tripolar', name: '09-TriPolar' },
  { selector: '#predictions', name: '10-Predictions' },
  { selector: 'footer', name: '11-Sources' }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://bbrandaw24.github.io/ai-trends-2025-2026/', {
    waitUntil: 'networkidle'
  });
  await page.waitForTimeout(2000);

  const results = [];
  for (const section of sections) {
    try {
      const el = await page.$(section.selector);
      if (!el) { console.log(`SKIP: ${section.name}`); continue; }
      const box = await el.boundingBox();
      if (!box) { console.log(`SKIP: ${section.name} - no box`); continue; }
      const filepath = path.join(outputDir, `${section.name}.png`);
      await el.screenshot({ path: filepath });
      const stats = fs.statSync(filepath);
      results.push(`${section.name}.png: ${(stats.size/1024).toFixed(1)}KB`);
      console.log(`OK: ${section.name}.png`);
    } catch (e) {
      console.log(`ERR: ${section.name} - ${e.message}`);
    }
  }

  await browser.close();
  console.log('\n=== RESULTS ===');
  results.forEach(r => console.log(r));
  console.log(`\nTotal: ${results.length} screenshots`);
})();
