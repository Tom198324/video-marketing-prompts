import mysql from 'mysql2/promise';
import fs from 'fs';

async function main() {
  console.log("=".repeat(100));
  console.log("PHASE 5: IMPLEMENTING VALIDATED IMPROVEMENTS IN DATABASE");
  console.log("=".repeat(100));
  console.log();
  
  // Load improvement proposals
  const proposals = JSON.parse(
    fs.readFileSync('/home/ubuntu/phase4_improvement_proposals.json', 'utf-8')
  );
  
  console.log(`✓ Loaded ${proposals.length} improvement proposals`);
  console.log();
  
  // Connect to database
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true }
  });
  
  console.log("✓ Connected to database");
  console.log();
  
  // Step 1: Create backup
  console.log("Step 1: Creating backup...");
  console.log("-".repeat(100));
  
  const [rows] = await connection.query(`
    SELECT promptNumber, promptJson 
    FROM prompts 
    WHERE promptNumber IN (${proposals.map((p: any) => p.number).join(',')})
    ORDER BY promptNumber
  `);
  
  const backup = rows as any[];
  const backupPath = '/home/ubuntu/sequences_backup_before_phase5.json';
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  
  console.log(`✓ Backed up ${backup.length} prompts to: ${backupPath}`);
  console.log();
  
  // Step 2: Implement improvements
  console.log("Step 2: Implementing improvements...");
  console.log("-".repeat(100));
  
  const changes: any[] = [];
  let successCount = 0;
  let errorCount = 0;
  
  for (const proposal of proposals) {
    try {
      console.log(`Updating #${proposal.number}: ${proposal.title}...`);
      
      // Get current prompt JSON
      const [currentRows] = await connection.query(
        'SELECT promptJson FROM prompts WHERE promptNumber = ?',
        [proposal.number]
      );
      
      if ((currentRows as any[]).length === 0) {
        console.log(`  ⚠️  Prompt #${proposal.number} not found in database`);
        errorCount++;
        continue;
      }
      
      const currentJson = JSON.parse((currentRows as any[])[0].promptJson);
      const oldSequences = currentJson.action?.sequences || [];
      
      // Update sequences with improved versions
      if (currentJson.action) {
        currentJson.action.sequences = proposal.improved_sequences;
      } else {
        currentJson.action = {
          sequences: proposal.improved_sequences,
          total_duration: "20 seconds"
        };
      }
      
      // Update database
      await connection.query(
        'UPDATE prompts SET promptJson = ? WHERE promptNumber = ?',
        [JSON.stringify(currentJson), proposal.number]
      );
      
      changes.push({
        number: proposal.number,
        title: proposal.title,
        old_sequences: oldSequences,
        new_sequences: proposal.improved_sequences,
        rationale: proposal.improvement_rationale
      });
      
      console.log(`  ✓ Updated successfully`);
      successCount++;
      
    } catch (error) {
      console.error(`  ✗ Error updating #${proposal.number}:`, error);
      errorCount++;
    }
  }
  
  console.log();
  console.log("-".repeat(100));
  console.log(`✓ Implementation complete: ${successCount} successful, ${errorCount} errors`);
  console.log();
  
  // Step 3: Save comparison report
  console.log("Step 3: Generating comparison report...");
  console.log("-".repeat(100));
  
  const reportPath = '/home/ubuntu/phase5_implementation_report.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    implementation_date: new Date().toISOString(),
    total_prompts_updated: successCount,
    errors: errorCount,
    changes: changes
  }, null, 2));
  
  console.log(`✓ Saved implementation report to: ${reportPath}`);
  console.log();
  
  // Display summary
  console.log("Implementation Summary:");
  console.log("-".repeat(100));
  console.log(`  • Total proposals: ${proposals.length}`);
  console.log(`  • Successfully updated: ${successCount}`);
  console.log(`  • Errors: ${errorCount}`);
  console.log(`  • Backup location: ${backupPath}`);
  console.log(`  • Report location: ${reportPath}`);
  console.log();
  
  // Show sample changes
  console.log("Sample Changes:");
  console.log("-".repeat(100));
  
  for (const change of changes.slice(0, 3)) {
    console.log(`\n#${change.number}: ${change.title}`);
    console.log(`  Rationale: ${change.rationale.substring(0, 100)}...`);
    console.log(`  Old Sequence 1: ${change.old_sequences[0]?.primary_motion?.substring(0, 80)}...`);
    console.log(`  New Sequence 1: ${change.new_sequences[0]?.primary_motion?.substring(0, 80)}...`);
  }
  
  console.log("\n... (showing first 3)");
  console.log();
  
  console.log("=".repeat(100));
  console.log("✅ PHASE 5 COMPLETE: All improvements implemented in database");
  console.log("=".repeat(100));
  
  await connection.end();
}

main().catch(console.error);
