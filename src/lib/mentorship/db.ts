/**
 * Mentorship-specific Supabase / in-memory store helper.
 * Reuses existing Supabase URL / KEY when valid.
 * Falls back to an in-memory reactive store when Supabase credentials
 * are placeholders or unavailable, ensuring seamless local dev and tests.
 */
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

declare global {
  // eslint-disable-next-line no-var
  var __mentorship_memory_store: Record<string, any[]> | undefined;
}

function getMemoryStore(): Record<string, any[]> {
  if (!globalThis.__mentorship_memory_store) {
    globalThis.__mentorship_memory_store = {
      mentorship_programs: [],
      mentorship_users: [],
      mentorship_resources: [],
      mentorship_submissions: [],
    };
  }
  return globalThis.__mentorship_memory_store;
}

class MemoryQueryBuilder {
  private table: string;
  private filters: Array<(item: any) => boolean> = [];
  private orderFields: Array<{ col: string; ascending: boolean }> = [];
  private limitNum: number | null = null;
  private isSingle = false;
  private isCountOnly = false;
  private insertPayload: any = null;
  private updatePayload: any = null;
  private isDelete = false;

  constructor(table: string) {
    this.table = table;
  }

  select(_fields?: string, options?: { count?: string; head?: boolean }) {
    if (options?.head) {
      this.isCountOnly = true;
    }
    return this;
  }

  eq(col: string, val: any) {
    this.filters.push((item) => item[col] === val);
    return this;
  }

  like(col: string, pattern: string) {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*');
    const rx = new RegExp(`^${escaped}$`, 'i');
    this.filters.push((item) => typeof item[col] === 'string' && rx.test(item[col]));
    return this;
  }

  overlaps(col: string, arr: any[]) {
    this.filters.push((item) => {
      const itemArr = item[col];
      if (!Array.isArray(itemArr) || !Array.isArray(arr)) return false;
      return arr.some((x) => itemArr.includes(x));
    });
    return this;
  }

  in(col: string, arr: any[]) {
    this.filters.push((item) => Array.isArray(arr) && arr.includes(item[col]));
    return this;
  }

  order(col: string, options?: { ascending?: boolean }) {
    this.orderFields.push({ col, ascending: options?.ascending !== false });
    return this;
  }

  limit(n: number) {
    this.limitNum = n;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  insert(payload: any) {
    this.insertPayload = payload;
    return this;
  }

  update(payload: any) {
    this.updatePayload = payload;
    return this;
  }

  delete() {
    this.isDelete = true;
    return this;
  }

  private execute() {
    const store = getMemoryStore();
    if (!store[this.table]) store[this.table] = [];
    const rows = store[this.table];

    // Handle INSERT
    if (this.insertPayload) {
      const items = Array.isArray(this.insertPayload) ? this.insertPayload : [this.insertPayload];
      const inserted = items.map((p) => {
        const item = {
          id: p.id || crypto.randomUUID(),
          created_at: p.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...p,
        };
        rows.push(item);
        return item;
      });
      return {
        data: this.isSingle ? inserted[0] : inserted,
        error: null,
      };
    }

    // Handle UPDATE
    if (this.updatePayload) {
      const updated: any[] = [];
      for (const row of rows) {
        if (this.filters.every((f) => f(row))) {
          Object.assign(row, this.updatePayload, { updated_at: new Date().toISOString() });
          updated.push(row);
        }
      }
      return {
        data: this.isSingle ? updated[0] || null : updated,
        error: null,
      };
    }

    // Handle DELETE
    if (this.isDelete) {
      const remaining = rows.filter((r) => !this.filters.every((f) => f(r)));
      store[this.table] = remaining;
      return { data: null, error: null };
    }

    // Handle SELECT
    let result = rows.filter((r) => this.filters.every((f) => f(r)));
    const totalCount = result.length;

    if (this.isCountOnly) {
      return { data: null, count: totalCount, error: null };
    }

    for (const { col, ascending } of this.orderFields) {
      result.sort((a, b) => {
        const valA = a[col] ?? '';
        const valB = b[col] ?? '';
        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
      });
    }

    if (this.limitNum !== null) {
      result = result.slice(0, this.limitNum);
    }

    if (this.isSingle) {
      const singleItem = result[0] || null;
      return {
        data: singleItem,
        error: singleItem ? null : { message: 'Not found' },
      };
    }

    return {
      data: result,
      count: totalCount,
      error: null,
    };
  }

  // PromiseLike so `await db.from(...)` works seamlessly
  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    const res = this.execute();
    return Promise.resolve(res).then(onfulfilled, onrejected);
  }
}

let _supabaseClient: any = null;

export function getMentorshipDb(): any {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SECRET_KEY || '';

  // Use in-memory store when Supabase credentials are placeholder or absent
  if (!url || !key || url.includes('placeholder.supabase.co')) {
    return {
      from: (tableName: string) => new MemoryQueryBuilder(tableName),
    };
  }

  if (!_supabaseClient) {
    _supabaseClient = createSupabaseClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return _supabaseClient;
}
