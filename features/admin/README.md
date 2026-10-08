# Management dashboard

A ready-made dashboard for whoever runs this product: list, create, edit and
delete the rows of the tables you give it. Wire it up in three steps.

1. Enable the managed backend with `enable_managed_backend` and wait for
   readiness with `spk_supabase_tools`. Copy `features/admin/0000_admin_roles.sql`
   to `supabase/migrations/0000_admin_roles.sql` (create the directory if needed;
   reuse an existing migration without overwriting it), then call `apply_migration`
   through `spk_supabase_call` with `{"path":"supabase/migrations/0000_admin_roles.sql"}`.
   Do this before applying business migrations that call `is_admin()`; preserve
   the applied file, including comments and whitespace. Add one policy per table
   the dashboard manages (the
   pattern is at the bottom of that file). Discover and call `bootstrap_owner_admin`
   with empty arguments through `spk_supabase_call`: it creates or reuses the
   project owner's account using their verified Builder email and grants the
   first administrator role. Do not ask for an email, password, or a separate
   registration. The owner can sign in with an email code at `/admin`.
2. Fill in `adminResources` in `config.ts` with those tables.
3. Create `app/admin/page.tsx`:

   ```tsx
   import { AdminPage } from "@/features/admin/pages";

   export default AdminPage;
   ```

Keep the optional SQL here until the dashboard is requested. Every SQL file in
`supabase/migrations/` is applied during publication and requires a ready backend.

Access is decided by the database, not by this page: `app_roles` says who is an
admin, and each table's own policy says what admins may do with it. The page
only hides what the policies would refuse anyway.

## Accounts

To also manage the people who sign in — who signed up, sending a password
reset, blocking someone — deploy `supabase/functions/admin-accounts` with
`deploy_edge_function` and set `adminAccounts = true` in `config.ts`.

Listing and blocking go through the hosted Auth admin API, which needs a
privileged key, so they run inside that function: it verifies the caller's token
and checks `app_roles` before it acts, and the key never leaves the server.
Resetting a password needs no privilege at all — the dashboard sends the same
recovery email the sign-in page sends, so only the account holder can complete
it and no administrator ever sees or sets someone else's password.

Add account features the same way. Never reach for a `service_role` key in the
browser or in project source.
