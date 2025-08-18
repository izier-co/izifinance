"use client";
import { CommonRow } from "@/components/sorting-datatable-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fetchJSONAPI } from "@/lib/lib";
import {
  EmailFormSchema,
  PasswordFormSchema,
  emailFormSchema,
  passwordFormSchema,
} from "@/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function UserDropdownMenu({ row }: { row: Row<CommonRow> }) {
  const [emailOpen, setEmailOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  async function _changeEmail(data: EmailFormSchema) {
    await fetchJSONAPI(
      "POST",
      `/api/v1/auth/admin/${row.getValue("id")}`,
      data
    );
  }
  async function _changePassword(data: PasswordFormSchema) {
    await fetchJSONAPI(
      "POST",
      `/api/v1/auth/admin/${row.getValue("id")}`,
      data
    );
  }
  const emailForm = useForm<EmailFormSchema>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const emailMutation = useMutation({
    mutationKey: ["change-email"],
    mutationFn: _changeEmail,
    onSuccess: () => {
      emailForm.reset();
      setEmailOpen(false);
    },
    onError: (error) => {
      emailForm.setError("root", {
        message: error.message,
      });
    },
  });

  function submitEmail(data: EmailFormSchema) {
    emailMutation.mutate(data);
  }

  const passwordForm = useForm<PasswordFormSchema>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const passwordMutation = useMutation({
    mutationKey: ["change-password"],
    mutationFn: _changePassword,
    onSuccess: () => {
      passwordForm.reset();
      setPasswordOpen(false);
    },
    onError: (error) => {
      passwordForm.setError("root", {
        message: error.message,
      });
    },
  });

  function submitPassword(data: PasswordFormSchema) {
    passwordMutation.mutate(data);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setEmailOpen(true);
                }}
              >
                Change Profile Picture
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogDescription>
                  Upload your new profile picture
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button">Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={emailOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                Change Email
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Input new Email</DialogTitle>
                <DialogDescription>
                  Change the email of the user, and the user would be logged out
                </DialogDescription>
              </DialogHeader>
              <Form {...emailForm}>
                <form
                  id="change-description-form"
                  onSubmit={emailForm.handleSubmit(submitEmail)}
                >
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">Email :</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="my-2">
                    <DialogClose asChild>
                      <Button variant="secondary" type="button">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">
                      {emailMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Confirm"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog open={passwordOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setPasswordOpen(true);
                }}
              >
                Change Password
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Input new Password</DialogTitle>
                <DialogDescription>
                  Change the password of the user, and the user would be logged
                  out
                </DialogDescription>
              </DialogHeader>
              <Form {...passwordForm}>
                <form
                  id="change-description-form"
                  onSubmit={passwordForm.handleSubmit(submitPassword)}
                >
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">Password :</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="my-2">
                    <DialogClose asChild>
                      <Button variant="secondary" type="button">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">
                      {passwordMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Confirm"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
