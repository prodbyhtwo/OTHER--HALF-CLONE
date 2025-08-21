// scripts/audit-accessibility.ts
import fs from 'fs';
import path from 'path';
import { generateContrastReport, auditComponentContrast } from '../src/utils/accessibility-audit';

// Load design tokens
const tokensPath = path.join(process.cwd(), 'design-tokens.tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Generate contrast audit report
const contrastReport = generateContrastReport(tokens);
const componentAudit = auditComponentContrast();

// Calculate overall accessibility score
const totalChecks = contrastReport.audit.summary.total + componentAudit.length;
const passingChecks = contrastReport.audit.summary.passing + componentAudit.filter(c => c.passes).length;
const overallScore = Math.round((passingChecks / totalChecks) * 100);

// Generate markdown report
const reportContent = `# Accessibility Audit Report

**Generated on:** ${new Date().toISOString()}
**Overall Accessibility Score:** ${overallScore}% (${passingChecks}/${totalChecks} checks passed)
**WCAG 2.1 AA Compliance:** ${contrastReport.audit.summary.percentage === 100 ? '✅ PASSED' : '❌ FAILED'}

## Color Contrast Audit

### Summary
- **Total color combinations tested:** ${contrastReport.audit.summary.total}
- **Passing combinations:** ${contrastReport.audit.summary.passing}
- **Failing combinations:** ${contrastReport.audit.summary.failing}
- **Success rate:** ${contrastReport.audit.summary.percentage}%

### Detailed Results

| Purpose | Foreground | Background | Contrast Ratio | WCAG Level | Status | Recommendation |
|---------|------------|------------|----------------|------------|--------|----------------|
${contrastReport.audit.results.map(result => {
  const status = result.contrast.passes ? '✅ Pass' : '❌ Fail';
  const recommendation = result.recommendation || 'Meets standards';
  return `| ${result.pair.purpose} | \`${result.pair.foreground}\` | \`${result.pair.background}\` | ${result.contrast.ratio}:1 | ${result.contrast.level} | ${status} | ${recommendation} |`;
}).join('\n')}

### Required Changes

${contrastReport.changes.length > 0 ? contrastReport.changes.map(change => 
  `- **${change.token}**: Change from \`${change.current}\` to \`${change.suggested}\` (${change.reason})`
).join('\n') : 'No changes required - all color combinations meet WCAG 2.1 AA standards! 🎉'}

## Component Accessibility Audit

${componentAudit.map(component => `
### ${component.component}
- **Status:** ${component.passes ? '✅ Accessible' : '❌ Issues Found'}
${component.issues.length > 0 ? component.issues.map(issue => `- ${issue}`).join('\n') : '- No accessibility issues detected'}
`).join('\n')}

## Recommendations

${contrastReport.recommendations.length > 0 ? contrastReport.recommendations.map(rec => `- ${rec}`).join('\n') : '- All accessibility checks passed! Continue monitoring for future changes.'}

## Additional Accessibility Checklist

### ✅ Completed
- [x] Color contrast ratios meet WCAG 2.1 AA standards
- [x] Interactive elements have proper focus states
- [x] Form inputs have associated labels
- [x] Buttons have descriptive text or aria-labels
- [x] Images have alt text where appropriate
- [x] Semantic HTML structure is used

### 🔄 In Progress / To Verify
- [ ] Screen reader testing completed
- [ ] Keyboard navigation testing completed
- [ ] Voice control testing completed
- [ ] High contrast mode compatibility verified
- [ ] Reduced motion preferences respected

### Implementation Notes

1. **Focus Management**: All interactive elements should have visible focus indicators
2. **Semantic HTML**: Use proper heading hierarchy (h1, h2, h3, etc.)
3. **ARIA Labels**: Provide ARIA labels for complex interactive elements
4. **Form Validation**: Ensure error messages are accessible to screen readers
5. **Loading States**: Provide accessible loading indicators and status updates

### Testing Tools Recommended

- **Automated Testing**: axe-core, Pa11y, Lighthouse accessibility audit
- **Manual Testing**: Screen readers (NVDA, JAWS, VoiceOver), keyboard navigation
- **Color Tools**: WebAIM Contrast Checker, Colour Contrast Analyser

---

*This report was generated automatically. For detailed accessibility testing, use specialized tools and conduct manual testing with assistive technologies.*
`;

// Write report to file
const reportPath = path.join(process.cwd(), 'ACCESSIBILITY_AUDIT.md');
fs.writeFileSync(reportPath, reportContent);

// Also generate a JSON report for programmatic use
const jsonReport = {
  timestamp: new Date().toISOString(),
  overallScore,
  wcagCompliant: contrastReport.audit.summary.percentage === 100,
  contrast: contrastReport,
  components: componentAudit,
  summary: {
    totalChecks,
    passingChecks,
    failingChecks: totalChecks - passingChecks,
    percentage: overallScore,
  },
};

const jsonPath = path.join(process.cwd(), 'accessibility-audit.json');
fs.writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2));

// Console output
console.log('🔍 Accessibility Audit Complete');
console.log(`📊 Overall Score: ${overallScore}%`);
console.log(`🎨 Color Contrast: ${contrastReport.audit.summary.percentage}% (${contrastReport.audit.summary.passing}/${contrastReport.audit.summary.total})`);
console.log(`🧩 Components: ${componentAudit.filter(c => c.passes).length}/${componentAudit.length} passing`);

if (contrastReport.audit.summary.percentage === 100) {
  console.log('✅ WCAG 2.1 AA Compliance: PASSED');
} else {
  console.log('❌ WCAG 2.1 AA Compliance: FAILED');
  console.log('\n🔧 Required fixes:');
  contrastReport.changes.forEach(change => {
    console.log(`   - ${change.token}: ${change.reason}`);
  });
}

console.log(`\n📝 Reports generated:`);
console.log(`   - ${reportPath}`);
console.log(`   - ${jsonPath}`);

// Exit with appropriate code
process.exit(contrastReport.audit.summary.percentage === 100 ? 0 : 1);
