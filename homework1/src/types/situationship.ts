/**
 * FSM 4 trạng thái quan hệ loại bỏ triệt để Boolean Soup (Slide 33)
 */
export type RelationshipPhase =
  | 'FRIENDS'
  | 'DATING_NO_LOVE'
  | 'OFFICIAL_LOVE'
  | 'GHOSTED_EXIT';

export type FsmAction =
  | { type: 'START_DATING' }
  | { type: 'CONFIRM_LOVE' }
  | { type: 'TRIGGER_GHOSTED' }
  | { type: 'RESET_TO_DATING' }
  | { type: 'FALLBACK_FRIENDS' };

export interface EffortSignal {
  readonly id: string;
  readonly actor: 'EM' | 'AI_DO';
  readonly description: string;
  readonly timestamp: number;
}

/**
 * Ma trận chuyển trạng thái hợp lệ (Transition Matrix)
 */
export const LEGAL_TRANSITIONS: Record<RelationshipPhase, readonly RelationshipPhase[]> = {
  FRIENDS: ['DATING_NO_LOVE'],
  DATING_NO_LOVE: ['OFFICIAL_LOVE', 'GHOSTED_EXIT', 'FRIENDS'],
  OFFICIAL_LOVE: ['FRIENDS', 'GHOSTED_EXIT'],
  GHOSTED_EXIT: ['DATING_NO_LOVE'],
};