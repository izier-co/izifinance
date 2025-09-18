import { Button } from "@/components/ui/button";
import { fetchJSONAPI } from "@/lib/lib";
import { refreshAndRevalidatePage } from "@/lib/server-lib";
import { useEmployeeIDQuery } from "@/queries/queries";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { MoreHorizontal, Loader2, Trash, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Row, Table } from "@tanstack/react-table";
import { CommonRow } from "@/components/sorting-datatable-header";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function CategoryDropdownMenu({ row, table }: { row: Row<CommonRow>; table: Table<CommonRow> }) {
  const [errorMessage, setErrorMessage] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);

  const deleteQuery = useMutation({
    mutationKey: ["delete-category-mutation"],
    mutationFn: _deleteCategory,
    onSuccess: () => {
      setShowSuccess(true);
      setShowError(null);
      setTimeout(() => {
        setShowSuccess(false);
        refreshAndRevalidatePage("/categories");
        table.options.meta?.triggerRefetch();
      }, 3000);
    },
    onError: (error) => {
      setShowError(error.message || "Failed to add employee");
      setShowSuccess(false);
      setErrorMessage(error.message);
    },
  });

  const checkAdminQuery = useEmployeeIDQuery();

  const isAdmin: boolean = checkAdminQuery.isSuccess && checkAdminQuery.data.adminStatus;

  function deleteCategory() {
    deleteQuery.mutate();
  }
  async function _deleteCategory() {
    const res = await fetchJSONAPI("DELETE", `/api/v1/categories/${row.getValue("txCategoryID")}`);
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error);
    }
  }

  // don't show the menu if not admin
  if (!isAdmin) return;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                // prevents weird closing bug when opening
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <Trash className="text-[var(--sidebar-accent-foreground)]" />
                Delete
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogDescription>Are you sure that you wanted to delete this?</DialogDescription>
              </DialogHeader>
              {errorMessage && <p className="text-sm font-medium text-destructive mb-2">{errorMessage}</p>}
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button" onClick={deleteCategory}>
                  {deleteQuery.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
      {showSuccess && (
        <Alert className="fixed bottom-4 right-4 w-96 z-50 border-[var(--border)] bg-[var(--accent)] text-[var(--foreground)]">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Category deleted successfully!</AlertDescription>
        </Alert>
      )}

      {showError && (
        <Alert className="fixed bottom-4 right-4 w-96 z-50 border-[var(--destructive)] bg-[var(--destructive)]/10 text-[var(--foreground)]" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to delete category. Please try again.</AlertDescription>
        </Alert>
      )}
    </>
  );
}
