import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";

export type AdminColumn<T> = {
  key: string;
  label: string;
  cell?: (row: T) => React.ReactNode;
};

export function AdminTable<T extends { id: string }>({
  columns,
  rows,
  emptyLabel = "Nothing here yet.",
  actions,
}: {
  columns: AdminColumn<T>[];
  rows: T[];
  emptyLabel?: string;
  actions?: {
    edit?: (row: T) => string;
    view?: (row: T) => string;
    delete?: (row: T) => string | undefined;
    onDelete?: (id: string) => Promise<void>;
  };
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-10 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
            {actions ? <TableHead className="text-right">Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="transition-colors hover:bg-muted/40">
              {columns.map((col) => (
                <TableCell key={col.key} className="whitespace-nowrap">
                  {col.cell ? col.cell(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                </TableCell>
              ))}
              {actions ? (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {actions.view ? (
                      <Link
                        href={actions.view(row)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        View
                      </Link>
                    ) : null}
                    {actions.edit ? (
                      <Link
                        href={actions.edit(row)}
                        className="rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-accent hover:text-foreground"
                      >
                        Edit
                      </Link>
                    ) : null}
                    {actions.delete ? (
                      <DeleteButton
                        id={row.id}
                        action={actions.onDelete ?? (async () => undefined)}
                        confirmText={`Delete "${actions.delete(row) ?? "this item"}"? This cannot be undone.`}
                      />
                    ) : null}
                  </div>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
