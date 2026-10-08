export interface AdminResource {
  /** Table name, exactly as it exists in the database. */
  table: string;
  /** What the person running this product calls it. */
  label: string;
  /**
   * Columns shown in the list. Defaults to the columns of the first row, or,
   * while the table is still empty, to the ones the database reports.
   */
  columns?: string[];
  /** Primary key column, when it is not `id`. */
  primaryKey?: string;
}

/** The tables the management dashboard manages. Empty until a product needs one. */
export const adminResources: AdminResource[] = [];

/**
 * Whether the dashboard also manages the accounts that sign in to this product:
 * who signed up, sending a password reset, blocking someone. Turn this on after
 * deploying `supabase/functions/admin-accounts`, which is what reaches the
 * hosted Auth admin API; no migration beyond `0000_admin_roles.sql` is needed.
 */
export const adminAccounts = false;
