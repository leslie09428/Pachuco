"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, ErrorState, LoadingState } from "@/components/app/states";
import { useAuth } from "@/lib/auth-context";
import { requireSupabase, supabaseRestRoot } from "@/lib/supabase";
import { AdminAccounts } from "./accounts";
import { adminAccounts, adminResources } from "./config";
import { LoginPage } from "@/features/auth/pages";

type Row = Record<string, unknown>;

const SYSTEM_COLUMNS = ["created_at", "updated_at"];
const PAGE_SIZE = 100;

function cellText(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/**
 * A table with no rows has no sample to learn its columns from, which used to
 * leave Add permanently disabled: the dashboard could never enter the first
 * record. PostgREST describes every table at the REST root, so ask it.
 */
async function tableSchema(table: string): Promise<Record<string, string>> {
  const root = supabaseRestRoot();
  if (!root) return {};
  const response = await fetch(root.url, {
    headers: { apikey: root.key, Authorization: `Bearer ${root.key}` },
  });
  if (!response.ok) return {};
  const document = (await response.json()) as {
    definitions?: Record<string, { properties?: Record<string, { type?: string }> }>;
  };
  const properties = document.definitions?.[table]?.properties ?? {};
  return Object.fromEntries(
    Object.entries(properties).map(([column, spec]) => [column, spec.type ?? "string"]),
  );
}

/** Keep a column's existing type: a text input must not turn 42 into "42". */
function coerce(value: string, sample: unknown, type?: string): unknown {
  if (value === "") return null;
  if (typeof sample === "number" || (sample === undefined && (type === "integer" || type === "number"))) {
    return Number(value);
  }
  if (typeof sample === "boolean" || (sample === undefined && type === "boolean")) {
    return value === "true";
  }
  if ((sample !== null && typeof sample === "object") || (sample === undefined && type === "object")) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

export function AdminPage() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [resourceIndex, setResourceIndex] = useState(0);
  const [showAccounts, setShowAccounts] = useState(adminResources.length === 0);
  const [draft, setDraft] = useState<{ key: unknown; values: Record<string, string> } | null>(null);
  const resource = showAccounts ? undefined : adminResources[resourceIndex];
  const primaryKey = resource?.primaryKey ?? "id";

  const role = useQuery({
    queryKey: ["admin-role", auth.user?.id],
    enabled: auth.status === "authenticated" && Boolean(auth.user),
    queryFn: async () => {
      const { data, error } = await requireSupabase()
        .from("app_roles")
        .select("role")
        .eq("user_id", auth.user!.id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data?.role ?? null;
    },
  });

  const rows = useQuery({
    queryKey: ["admin-rows", resource?.table],
    enabled: Boolean(resource) && Boolean(role.data),
    queryFn: async () => {
      const client = requireSupabase();
      const select = () => client.from(resource!.table).select("*").limit(PAGE_SIZE);
      // Newest first when the table records a creation time; plenty of tables do not.
      let { data, error } = await select().order("created_at", { ascending: false });
      if (error) ({ data, error } = await select());
      if (error) throw new Error(error.message);
      return (data ?? []) as Row[];
    },
  });

  const sample = rows.data?.[0];

  // Only an empty table needs the schema: one row already names every column.
  const schema = useQuery({
    queryKey: ["admin-schema", resource?.table],
    enabled: Boolean(resource) && rows.isSuccess && rows.data?.length === 0,
    queryFn: () => tableSchema(resource!.table),
  });
  const schemaColumns = useMemo(() => Object.keys(schema.data ?? {}), [schema.data]);

  const listColumns = useMemo(() => {
    if (resource?.columns?.length) return resource.columns;
    if (sample) return Object.keys(sample);
    return schemaColumns;
  }, [resource, sample, schemaColumns]);
  // The form offers every column, not just the ones the list chooses to show.
  const formColumns = useMemo(
    () => (sample ? Object.keys(sample) : schemaColumns.length ? schemaColumns : listColumns).filter(
      (column) => column !== primaryKey && !SYSTEM_COLUMNS.includes(column),
    ),
    [listColumns, primaryKey, sample, schemaColumns],
  );

  const save = useMutation({
    mutationFn: async (input: { key: unknown; values: Record<string, string> }) => {
      const payload = Object.fromEntries(
        formColumns.map((column) => [
          column,
          coerce(input.values[column] ?? "", sample?.[column], schema.data?.[column]),
        ]),
      );
      const table = requireSupabase().from(resource!.table);
      const { error } = input.key === null
        ? await table.insert(payload)
        : await table.update(payload).eq(primaryKey, input.key as string);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      setDraft(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-rows", resource?.table] });
      toast.success("Saved");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (key: unknown) => {
      const { error } = await requireSupabase()
        .from(resource!.table)
        .delete()
        .eq(primaryKey, key as string);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-rows", resource?.table] });
      toast.success("Deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const frame = (children: React.ReactNode) => (
    <main className="mx-auto grid min-h-screen max-w-6xl content-start gap-6 px-4 py-10">{children}</main>
  );

  if (auth.status === "loading" || (auth.status === "authenticated" && role.isPending)) {
    return frame(<LoadingState title="Loading the dashboard…" />);
  }
  if (auth.status === "unavailable") {
    return frame(
      <ErrorState
        title="The dashboard is not available"
        description="This application does not have data services enabled."
      />,
    );
  }
  if (auth.status === "anonymous") {
    return <LoginPage allowEmailOtp defaultEmailOtp redirectTo="/admin" />;
  }
  // A failed lookup leaves the role unset, which is not the same as not having
  // one. Saying so before the access check keeps a network blip from reading as
  // a refusal the administrator cannot argue with.
  if (role.error) {
    return frame(
      <ErrorState
        title="Could not check your access"
        description="Your role could not be read just now. Check your connection and try again."
        actionLabel="Try again"
        onAction={() => void role.refetch()}
      />,
    );
  }
  if (!role.data) {
    return frame(
      <ErrorState
        title="You do not have access to this dashboard"
        description="Ask an administrator to grant you access."
      />,
    );
  }
  if (adminResources.length === 0 && !adminAccounts) {
    return frame(
      <EmptyState
        title="Nothing to manage yet"
        description="No tables have been added to the dashboard."
      />,
    );
  }

  const navigation = (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold">Management</h1>
      <div className="flex flex-wrap gap-2">
        {adminResources.map((item, index) => (
          <Button
            key={item.table}
            variant={!showAccounts && index === resourceIndex ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setResourceIndex(index);
              setShowAccounts(false);
            }}
          >
            {item.label}
          </Button>
        ))}
        {adminAccounts && (
          <Button
            variant={showAccounts ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAccounts(true)}
          >
            Accounts
          </Button>
        )}
      </div>
    </header>
  );

  if (!resource) return frame(<>{navigation}<AdminAccounts /></>);

  return frame(
    <>
      {navigation}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <CardTitle>{resource.label}</CardTitle>
          <Button
            size="sm"
            disabled={formColumns.length === 0}
            onClick={() =>
              setDraft({ key: null, values: Object.fromEntries(formColumns.map((column) => [column, ""])) })
            }
          >
            Add
          </Button>
        </CardHeader>
        <CardContent>
          {rows.isPending ? (
            <LoadingState title="Loading…" />
          ) : rows.error ? (
            <ErrorState
              title="Could not load this table"
              description={(rows.error as Error).message}
              actionLabel="Try again"
              onAction={() => void rows.refetch()}
            />
          ) : rows.data.length === 0 ? (
            <EmptyState title="No records yet" description={`Nothing in ${resource.label} so far.`} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {listColumns.map((column) => <TableHead key={column}>{column}</TableHead>)}
                    <TableHead className="w-[1%]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.data.map((row, index) => (
                    <TableRow key={String(row[primaryKey] ?? index)}>
                      {listColumns.map((column) => (
                        <TableCell key={column} className="max-w-[22rem] truncate">
                          {cellText(row[column])}
                        </TableCell>
                      ))}
                      <TableCell className="whitespace-nowrap text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDraft({
                              key: row[primaryKey] ?? null,
                              values: Object.fromEntries(
                                formColumns.map((column) => [
                                  column,
                                  row[column] === null || row[column] === undefined
                                    ? ""
                                    : typeof row[column] === "object"
                                      ? JSON.stringify(row[column])
                                      : String(row[column]),
                                ]),
                              ),
                            })
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={remove.isPending}
                          onClick={() => {
                            if (!window.confirm("Delete this record?")) return;
                            remove.mutate(row[primaryKey]);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(draft)} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{draft?.key === null ? `New ${resource.label}` : `Edit ${resource.label}`}</DialogTitle>
          </DialogHeader>
          <div className="grid max-h-[60vh] gap-4 overflow-y-auto py-2">
            {formColumns.map((column) => (
              <div key={column} className="grid gap-2">
                <Label htmlFor={`admin-${column}`}>{column}</Label>
                <Input
                  id={`admin-${column}`}
                  value={draft?.values[column] ?? ""}
                  onChange={(event) =>
                    setDraft((current) =>
                      current && { ...current, values: { ...current.values, [column]: event.target.value } },
                    )
                  }
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
            <Button disabled={save.isPending} onClick={() => draft && save.mutate(draft)}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>,
  );
}
