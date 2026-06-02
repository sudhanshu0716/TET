const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  purple: '\x1b[35m'
};

const summaryPath = path.join(__dirname, '../../summary.json');
const htmlReportPath = path.join(__dirname, '../../load-test-report.html');

console.log(`${colors.purple}${colors.bright}📊 Reading load test summary file from: ${summaryPath}...${colors.reset}`);

if (!fs.existsSync(summaryPath)) {
  console.error(`${colors.red}❌ Error: summary.json not found! Execute k6 load test first.${colors.reset}`);
  process.exit(1);
}

try {
  const rawData = fs.readFileSync(summaryPath, 'utf8');
  const summary = JSON.parse(rawData);
  const metrics = summary.metrics || {};

  // Extract key metrics with safe fallbacks
  const totalRequests = metrics.http_reqs?.values?.count || 0;
  const requestRate = (metrics.http_reqs?.values?.rate || 0).toFixed(2);
  const avgLatency = (metrics.http_req_duration?.values?.avg || 0).toFixed(2);
  const medLatency = (metrics.http_req_duration?.values?.med || 0).toFixed(2);
  const p95Latency = (metrics.http_req_duration?.values?.['p(95)'] || 0).toFixed(2);
  const maxLatency = (metrics.http_req_duration?.values?.max || 0).toFixed(2);
  const failureRate = ((metrics.http_req_failed?.values?.rate || 0) * 100).toFixed(2);
  const totalFailed = metrics.http_req_failed?.values?.passes || 0;
  const totalSuccess = metrics.http_req_failed?.values?.fails || totalRequests;
  const peakVUs = metrics.vus?.values?.max || metrics.vus?.values?.value || 0;
  const totalIterations = metrics.iterations?.values?.count || 0;

  // Process checks
  let checksPassed = 0;
  let checksFailed = 0;
  const checksList = [];

  // Recurse function to extract checks from groups
  function extractChecks(groupObj) {
    if (groupObj.checks && groupObj.checks.length > 0) {
      groupObj.checks.forEach(c => {
        checksPassed += c.passes;
        checksFailed += c.fails;
        checksList.push({
          name: c.name,
          path: c.path,
          passes: c.passes,
          fails: c.fails,
          successRate: ((c.passes / (c.passes + c.fails || 1)) * 100).toFixed(1)
        });
      });
    }
    if (groupObj.groups && groupObj.groups.length > 0) {
      groupObj.groups.forEach(extractChecks);
    }
  }

  if (summary.root_group) {
    extractChecks(summary.root_group);
  }

  const totalChecks = checksPassed + checksFailed;
  const checksSuccessRate = totalChecks > 0 ? ((checksPassed / totalChecks) * 100).toFixed(2) : '100.00';

  // --- 1. PRINT ASCII DASHBOARD TO CONSOLE ---
  console.log(`\n${colors.cyan}=============================================================`);
  console.log(`${colors.bright}🚀 TET PREP APP - HIGH CONCURRENCY LOAD TEST RESULTS 🚀`);
  console.log(`=============================================================${colors.reset}`);
  console.log(`👥 Peak Concurrency (VUs)   : ${colors.bright}${peakVUs}${colors.reset}`);
  console.log(`🔄 Total Iterations Runs    : ${colors.bright}${totalIterations}${colors.reset}`);
  console.log(`📥 Total HTTP Requests      : ${colors.bright}${totalRequests}${colors.reset} (Rate: ${requestRate} req/s)`);
  
  const failColor = parseFloat(failureRate) > 5 ? colors.red : (parseFloat(failureRate) > 0 ? colors.yellow : colors.green);
  console.log(`❌ HTTP Request Failure Rate: ${failColor}${failureRate}%${colors.reset} (Failed: ${totalFailed} / Success: ${totalSuccess})`);
  
  console.log(`⏱️  Latency Metrics (Round-trip duration):`);
  console.log(`   - Average                : ${colors.cyan}${avgLatency} ms${colors.reset}`);
  console.log(`   - Median (p50)           : ${colors.cyan}${medLatency} ms${colors.reset}`);
  console.log(`   - 95th Percentile (p95)  : ${colors.green}${colors.bright}${p95Latency} ms${colors.reset} 👈 (Target SLA: <2000ms)`);
  console.log(`   - Maximum                : ${colors.red}${maxLatency} ms${colors.reset}`);

  console.log(`🛡️  Assertion Checks         : ${colors.bright}${checksPassed} passed${colors.reset}, ${checksFailed} failed (Success Rate: ${checksSuccessRate}%)`);
  console.log(`${colors.cyan}=============================================================${colors.reset}\n`);

  // --- 2. GENERATE A GORGEOUS PREMIUM HTML REPORT ---
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TET Prep - Load Test Performance Report</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0a0b10;
      --bg-card: rgba(20, 22, 37, 0.6);
      --border-card: rgba(139, 92, 246, 0.15);
      --primary: #8b5cf6;
      --primary-glow: rgba(139, 92, 246, 0.4);
      --accent: #d946ef;
      --success: #10b981;
      --success-glow: rgba(16, 185, 129, 0.2);
      --warning: #f59e0b;
      --error: #ef4444;
      --error-glow: rgba(239, 68, 68, 0.2);
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 2.5rem 1.5rem;
      min-height: 100vh;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 80% 80%, rgba(217, 70, 239, 0.08) 0%, transparent 40%);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* HEADER */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 1.5rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-glow {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.5rem;
      color: white;
      box-shadow: 0 0 20px var(--primary-glow);
      font-family: 'Outfit', sans-serif;
    }

    .title-area h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.75rem;
      font-weight: 700;
      background: linear-gradient(to right, #ffffff, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .title-area p {
      color: var(--text-muted);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .meta-badge {
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.3);
      padding: 0.5rem 1rem;
      border-radius: 30px;
      font-size: 0.875rem;
      color: #c084fc;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* KPI CARDS GRID */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }

    .kpi-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      backdrop-filter: blur(12px);
      padding: 1.5rem;
      border-radius: 16px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .kpi-card:hover {
      transform: translateY(-5px);
      border-color: rgba(139, 92, 246, 0.4);
      box-shadow: 0 10px 25px -10px var(--primary-glow);
    }

    .kpi-label {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .kpi-value {
      font-family: 'Outfit', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      line-height: 1;
    }

    .kpi-subtext {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
    }

    /* COLOR VARIATIONS FOR KPIS */
    .kpi-card.success { border-color: rgba(16, 185, 129, 0.2); }
    .kpi-card.success:hover { border-color: var(--success); box-shadow: 0 10px 25px -10px var(--success-glow); }
    .kpi-card.success .kpi-value { color: var(--success); }

    .kpi-card.error { border-color: rgba(239, 68, 68, 0.2); }
    .kpi-card.error:hover { border-color: var(--error); box-shadow: 0 10px 25px -10px var(--error-glow); }
    .kpi-card.error .kpi-value { color: var(--error); }

    /* LAYOUT SECTION */
    .layout-sections {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    @media (max-width: 900px) {
      .layout-sections {
        grid-template-columns: 1fr;
      }
    }

    .panel {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 20px;
      padding: 2rem;
      backdrop-filter: blur(12px);
    }

    .panel h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 0.75rem;
    }

    /* TABLE STYLING */
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th {
      font-size: 0.85rem;
      text-transform: uppercase;
      color: var(--text-muted);
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      font-weight: 600;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.9rem;
    }

    tr:last-child td {
      border-bottom: none;
    }

    /* STATUS BADGES */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.6rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .badge.success {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .badge.error {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    /* PROGRESS VISUAL */
    .progress-track {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      height: 6px;
      border-radius: 3px;
      overflow: hidden;
      margin-top: 0.25rem;
    }

    .progress-bar {
      height: 100%;
      border-radius: 3px;
    }

    /* SPECIFIC GROUPS / SLA CRITERIA */
    .sla-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .sla-item {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      padding: 1rem;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sla-name h4 {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .sla-name p {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .sla-status {
      text-align: right;
    }

    .sla-num {
      font-family: 'Outfit', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
    }

    .system-logs {
      background: #0f1016;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 1.25rem;
      font-family: monospace;
      font-size: 0.8rem;
      color: var(--text-muted);
      overflow-x: auto;
      max-height: 250px;
      line-height: 1.5;
    }

    footer {
      text-align: center;
      margin-top: 3rem;
      color: var(--text-muted);
      font-size: 0.8rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand">
        <div class="logo-glow">🤖</div>
        <div class="title-area">
          <h1>TET Prep App - Load Test Report</h1>
          <p>GitHub Actions automated performance benchmarks pipeline</p>
        </div>
      </div>
      <div class="meta-badge">
        <span>●</span> k6 Engine v0.3.1
      </div>
    </header>

    <!-- KPI STATS CARDS -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Peak Users</div>
        <div class="kpi-value" style="color: #c084fc;">${peakVUs}</div>
        <div class="kpi-subtext">Concurrent Virtual Users</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Total Requests</div>
        <div class="kpi-value">${totalRequests}</div>
        <div class="kpi-subtext">Throughput: ${requestRate} req/s</div>
      </div>
      <div class="kpi-card ${parseFloat(failureRate) > 5 ? 'error' : 'success'}">
        <div class="kpi-label">HTTP Fail Rate</div>
        <div class="kpi-value">${failureRate}%</div>
        <div class="kpi-subtext">Fails: ${totalFailed} | Success: ${totalSuccess}</div>
      </div>
      <div class="kpi-card ${parseFloat(p95Latency) > 2000 ? 'error' : 'success'}">
        <div class="kpi-label">p95 Latency</div>
        <div class="kpi-value">${p95Latency} ms</div>
        <div class="kpi-subtext">SLA Threshold: 2000 ms</div>
      </div>
    </div>

    <!-- MAIN DATA LAYOUT -->
    <div class="layout-sections">
      <!-- DETAILED ASSERATIONS TABLE -->
      <div class="panel">
        <h2>🛡️ Automated Assertion Checks (${checksList.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Validation Check Target</th>
              <th>Passes</th>
              <th>Fails</th>
              <th>Success Rate</th>
            </tr>
          </thead>
          <tbody>
            ${checksList.map(check => `
              <tr>
                <td>
                  <strong style="color: var(--text-main); font-weight: 500;">${check.name}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">${check.path}</div>
                </td>
                <td style="color: var(--success); font-weight: 600;">${check.passes}</td>
                <td style="color: ${check.fails > 0 ? 'var(--error)' : 'var(--text-muted)'}; font-weight: 600;">${check.fails}</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="badge ${parseFloat(check.successRate) >= 95 ? 'success' : 'error'}">${check.successRate}%</span>
                    <div class="progress-track" style="width: 60px;">
                      <div class="progress-bar" style="width: ${check.successRate}%; background: ${parseFloat(check.successRate) >= 95 ? 'var(--success)' : 'var(--error)'}"></div>
                    </div>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- SLA & RECOMMENDATIONS SIDEBAR -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div class="panel">
          <h2>⏱️ Latency Percentiles</h2>
          <div class="sla-list">
            <div class="sla-item">
              <div class="sla-name">
                <h4>Average Latency</h4>
                <p>Calculated mean duration</p>
              </div>
              <div class="sla-status">
                <div class="sla-num" style="color: var(--text-main);">${avgLatency} ms</div>
              </div>
            </div>
            <div class="sla-item">
              <div class="sla-name">
                <h4>Median (p50)</h4>
                <p>50% of requests are faster</p>
              </div>
              <div class="sla-status">
                <div class="sla-num" style="color: var(--text-muted);">${medLatency} ms</div>
              </div>
            </div>
            <div class="sla-item">
              <div class="sla-name">
                <h4>SLA Target (p95)</h4>
                <p>95% of requests are faster</p>
              </div>
              <div class="sla-status">
                <div class="sla-num" style="color: ${parseFloat(p95Latency) < 2000 ? 'var(--success)' : 'var(--error)'};">${p95Latency} ms</div>
                <span class="badge ${parseFloat(p95Latency) < 2000 ? 'success' : 'error'}" style="font-size: 0.65rem; padding: 0.15rem 0.4rem;">
                  ${parseFloat(p95Latency) < 2000 ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            </div>
            <div class="sla-item">
              <div class="sla-name">
                <h4>Peak Max Latency</h4>
                <p>Absolute slowest request</p>
              </div>
              <div class="sla-status">
                <div class="sla-num" style="color: var(--error);">${maxLatency} ms</div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <h2>📊 Performance Verdict</h2>
          <div style="margin-top: 0.5rem; line-height: 1.6; font-size: 0.9rem;">
            ${parseFloat(failureRate) < 1 && parseFloat(p95Latency) < 1000 
              ? `<div style="color: var(--success); font-weight: 700; margin-bottom: 0.5rem;">🟢 EXCELLENT PERFORMANCE</div>
                 The API server showed absolute stability. Sub-second 95th percentile response times under concurrent loads. Ready for major traffic surges.`
              : parseFloat(failureRate) < 5 && parseFloat(p95Latency) < 2000
                ? `<div style="color: var(--warning); font-weight: 700; margin-bottom: 0.5rem;">🟡 ACCEPTABLE PERFORMANCE</div>
                   The server responds reliably with error rates well under 5%. p95 latencies are within acceptable limits, though database queries under mock exam generation should be monitored.`
                : `<div style="color: var(--error); font-weight: 700; margin-bottom: 0.5rem;">🔴 PERFORMANCE CRITICAL WARNING</div>
                   The system fails to meet crucial SLAs. The error rate exceeds 5% or p95 responses are extremely slow (>2000ms). Database indexing or serverless CPU throttles might be causing latency bottlenecks.`}
          </div>
        </div>
      </div>
    </div>

    <!-- RAW DATA FOOTER LOGS -->
    <div class="panel" style="margin-top: 1.5rem;">
      <h2>📜 Raw JSON Metrics Preview</h2>
      <div class="system-logs">
${JSON.stringify({
  vus_max: peakVUs,
  iterations_total: totalIterations,
  http_reqs: totalRequests,
  http_req_failed_percent: failureRate,
  http_req_duration_avg_ms: avgLatency,
  http_req_duration_p95_ms: p95Latency,
  checks_passed_count: checksPassed,
  checks_failed_count: checksFailed,
  checks_success_percent: checksSuccessRate
}, null, 2)}
      </div>
    </div>

    <footer>
      TET Prep Platform Automation Services • Performance Report generated on ${new Date().toLocaleString()}
    </footer>
  </div>
</body>
</html>`;

  fs.writeFileSync(htmlReportPath, htmlContent, 'utf8');
  console.log(`${colors.green}${colors.bright}✨ Premium visual HTML report successfully compiled and saved to: ${htmlReportPath} !${colors.reset}\n`);

} catch (err) {
  console.error(`${colors.red}❌ Critical Error compiling load test report: ${err.message}${colors.reset}`);
  process.exit(1);
}
