import assert from 'node:assert/strict';

console.log('--- TEST: Situationship FSM & Asymmetric Effort Logic (Slide 33 & 34) ---');

function analyzeRelationship(phase, myTries, rivalTries) {
  // Công thức: Em cố 100 lần (0.1x) < Ai đó một phần (50.0x)
  const myImpact = myTries * 0.1;
  const rivalImpact = rivalTries * 50.0;
  const isRedFlag = phase === 'DATING_NO_LOVE' && myImpact < rivalImpact;

  return {
    phase,
    myImpact,
    rivalImpact,
    isRedFlag,
  };
}

// 1. Kiểm tra Red Flag: 100 lần cố gắng của Em (10 điểm) < 1 lần của Ai đó (50 điểm)
const test1 = analyzeRelationship('DATING_NO_LOVE', 100, 1);
assert.equal(test1.myImpact, 10);
assert.equal(test1.rivalImpact, 50);
assert.equal(test1.isRedFlag, true);
console.log('✓ Test 1: Asymmetric effort accurately detects Red Flag (10 < 50).');

// 2. Kiểm tra khi nỗ lực của Em vượt trội (600 lần = 60 điểm > 50 điểm)
const test2 = analyzeRelationship('DATING_NO_LOVE', 600, 1);
assert.equal(test2.myImpact, 60);
assert.equal(test2.rivalImpact, 50);
assert.equal(test2.isRedFlag, false);
console.log('✓ Test 2: Overwhelming effort temporarily clears Red Flag.');

// 3. Thoát mập mờ sang GHOSTED_EXIT -> Thu gom rác, giải phóng bộ nhớ
const test3 = analyzeRelationship('GHOSTED_EXIT', 100, 1);
assert.equal(test3.phase, 'GHOSTED_EXIT');
assert.equal(test3.isRedFlag, false);
console.log('✓ Test 3: Transitions cleanly to GHOSTED_EXIT state.');

console.log('\nAll Situationship FSM tests passed successfully!');