import assert from 'node:assert/strict';

console.log('================================================================');
console.log('--- TEST: FSM Legal & Illegal Transition Matrix & Abort Lifecycle ---');
console.log('================================================================\n');

// 1. Ma trận chuyển đổi trạng thái hợp lệ (Slide 33)
const LEGAL_TRANSITIONS = {
  FRIENDS: ['DATING_NO_LOVE'],
  DATING_NO_LOVE: ['OFFICIAL_LOVE', 'GHOSTED_EXIT', 'FRIENDS'],
  OFFICIAL_LOVE: ['FRIENDS', 'GHOSTED_EXIT'],
  GHOSTED_EXIT: ['DATING_NO_LOVE'], // Chỉ được tái sinh qua RESET_TO_DATING
};

function canTransition(from, to) {
  return LEGAL_TRANSITIONS[from]?.includes(to) ?? false;
}

function situationshipReducer(state, action) {
  let target = state;
  switch (action.type) {
    case 'START_DATING':
      target = 'DATING_NO_LOVE';
      break;
    case 'CONFIRM_LOVE':
      target = 'OFFICIAL_LOVE';
      break;
    case 'TRIGGER_GHOSTED':
      target = 'GHOSTED_EXIT';
      break;
    case 'RESET_TO_DATING':
      target = 'DATING_NO_LOVE';
      break;
    case 'FALLBACK_FRIENDS':
      target = 'FRIENDS';
      break;
  }

  if (!canTransition(state, target)) {
    return state; // Guard từ chối chuyển đổi bất hợp lệ
  }
  return target;
}

// --- SUITE 1: Kiểm thử các bước chuyển hợp lệ (Legal Transitions) ---
assert.equal(canTransition('DATING_NO_LOVE', 'GHOSTED_EXIT'), true);
assert.equal(situationshipReducer('DATING_NO_LOVE', { type: 'TRIGGER_GHOSTED' }), 'GHOSTED_EXIT');
console.log('✓ [PASS] Legal Transition: DATING_NO_LOVE -> GHOSTED_EXIT');

assert.equal(canTransition('DATING_NO_LOVE', 'OFFICIAL_LOVE'), true);
assert.equal(situationshipReducer('DATING_NO_LOVE', { type: 'CONFIRM_LOVE' }), 'OFFICIAL_LOVE');
console.log('✓ [PASS] Legal Transition: DATING_NO_LOVE -> OFFICIAL_LOVE');

assert.equal(canTransition('GHOSTED_EXIT', 'DATING_NO_LOVE'), true);
assert.equal(situationshipReducer('GHOSTED_EXIT', { type: 'RESET_TO_DATING' }), 'DATING_NO_LOVE');
console.log('✓ [PASS] Legal Transition: GHOSTED_EXIT -> DATING_NO_LOVE (Reset)');

// --- SUITE 2: Kiểm thử chặn các bước chuyển bất hợp lệ (Illegal Transitions Guard) ---
// Từ GHOSTED_EXIT không thể nhảy trực tiếp sang OFFICIAL_LOVE
assert.equal(canTransition('GHOSTED_EXIT', 'OFFICIAL_LOVE'), false);
assert.equal(situationshipReducer('GHOSTED_EXIT', { type: 'CONFIRM_LOVE' }), 'GHOSTED_EXIT');
console.log('✓ [PASS] Guard Blocked: GHOSTED_EXIT -> OFFICIAL_LOVE (Rejected, state unchanged)');

// Từ FRIENDS không thể tự ý chuyển thẳng sang GHOSTED_EXIT
assert.equal(canTransition('FRIENDS', 'GHOSTED_EXIT'), false);
assert.equal(situationshipReducer('FRIENDS', { type: 'TRIGGER_GHOSTED' }), 'FRIENDS');
console.log('✓ [PASS] Guard Blocked: FRIENDS -> GHOSTED_EXIT (Rejected, state unchanged)');

// --- SUITE 3: Kiểm thử vòng đời hủy tín hiệu AbortController (Slide 33) ---
let controller = new AbortController();
let requestStatus = 'PENDING';

controller.signal.addEventListener('abort', () => {
  requestStatus = 'ABORTED';
});

// Giả lập hủy request khi "Ai Đó" xuất hiện
assert.equal(controller.signal.aborted, false);
controller.abort();
assert.equal(controller.signal.aborted, true);
assert.equal(requestStatus, 'ABORTED');
console.log('✓ [PASS] AbortController: Active ping request aborted cleanly on rival event');

console.log('\nAll 6 FSM Transition & Abort Lifecycle assertions passed successfully!\n');