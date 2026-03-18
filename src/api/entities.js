// ============================================
// MIGRATED: Base44 entities → Supabase
// ============================================

import { base44 } from './supabaseClient';

export const Query = base44.entities.Query;

// auth sdk:
export const User = base44.auth;
