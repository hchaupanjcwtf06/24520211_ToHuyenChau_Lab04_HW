import { LEGAL_TRANSITIONS, type RelationshipPhase, type FsmAction } from '../types/situationship';

export function canTransition(from: RelationshipPhase, to: RelationshipPhase): boolean {
  return LEGAL_TRANSITIONS[from].includes(to);
}

export function situationshipReducer(state: RelationshipPhase, action: FsmAction): RelationshipPhase {
  let target: RelationshipPhase = state;

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
    console.warn(`[FSM Guard] Illegal transition rejected: ${state} -> ${target}`);
    return state;
  }

  return target;
}