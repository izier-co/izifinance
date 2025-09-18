"use client";
import { CommonRow } from "@/components/sorting-datatable-header";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fetchJSONAPI } from "@/lib/lib";
import { refreshAndRevalidatePage } from "@/lib/server-lib";
import { cn } from "@/lib/utils";
import { EmailFormSchema, PasswordFormSchema, emailFormSchema, passwordFormSchema } from "@/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { AlertCircle, CheckCircle, EyeIcon, EyeOffIcon, Images, Loader2, Mails, MoreHorizontal, RectangleEllipsis } from "lucide-react";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ImageFormValues {
  image: File[];
}

export function UserDropdownMenu({ row }: { row: Row<CommonRow> }) {
  const [showPassword, setShowPassword] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [alert, setAlert] = React.useState<{
    type: "success" | "error" | null;
    title?: string;
    message?: string;
  }>({ type: null });

  async function uploadImage(data: { image: File[] }) {
    const formData = new FormData();
    formData.append("image", data.image[0]);

    const response = await fetch(`/api/v1/auth/admin/${row.getValue("id")}/update-avatar`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  }

  async function _changeEmail(data: EmailFormSchema) {
    const res = await fetchJSONAPI("PUT", `/api/v1/auth/admin/${row.getValue("id")}`, data);
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error);
    }
  }
  async function _changePassword(data: PasswordFormSchema) {
    const res = await fetchJSONAPI("PUT", `/api/v1/auth/admin/${row.getValue("id")}`, data);
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error);
    }
  }

  const imageUploadForm = useForm<ImageFormValues>();

  const emailForm = useForm<EmailFormSchema>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm<PasswordFormSchema>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  function showAlert(type: "success" | "error", title: string, message: string, callback?: () => void) {
    setAlert({ type, title, message });
    setTimeout(() => {
      setAlert({ type: null });
      if (callback) callback();
    }, 3000);
  }

  const emailMutation = useMutation({
    mutationKey: ["change-email"],
    mutationFn: _changeEmail,
    onSuccess: () => {
      setEmailOpen(false);
      showAlert("success", "Success", "Email changed successfully!", () => {
        emailForm.reset();
        refreshAndRevalidatePage("/");
      });
    },
    onError: (error) => {
      showAlert("error", "Error", "Failed to change email");
      emailForm.setError("root", {
        message: error.message,
      });
    },
  });

  const passwordMutation = useMutation({
    mutationKey: ["change-password"],
    mutationFn: _changePassword,
    onSuccess: () => {
      setPasswordOpen(false);
      showAlert("success", "Success", "Password changed successfully!", () => {
        passwordForm.reset();
      });
    },
    onError: (error) => {
      showAlert("error", "Error", "Failed to change password");
      passwordForm.setError("root", {
        message: error.message,
      });
    },
  });

  const imageUploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      setProfileOpen(false);
      showAlert("success", "Success", "Image uploaded successfully!", () => {
        refreshAndRevalidatePage("/dashboard", "layout");
      });
    },
    onError: (err) => {
      showAlert("error", "Error", "Failed to upload image");
      imageUploadForm.setError("image", {
        message: err.message,
      });
    },
  });

  function submitEmail(data: EmailFormSchema) {
    emailMutation.mutate(data);
  }

  function submitPassword(data: PasswordFormSchema) {
    passwordMutation.mutate(data);
  }

  function submitImage(data: { image: File[] }) {
    imageUploadMutation.mutate(data);
  }

  function _emailModalCleanup(open: boolean) {
    if (!open) {
      setEmailOpen(false);
    }
    emailForm.clearErrors();
  }

  function _passwordModalCleanup(open: boolean) {
    if (!open) {
      setPasswordOpen(false);
    }
    passwordForm.clearErrors();
  }

  function _profileModalCleanup(open: boolean) {
    if (!open) {
      setProfileOpen(false);
    }
    imageUploadForm.clearErrors();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <Dialog open={profileOpen} onOpenChange={_profileModalCleanup}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setProfileOpen(true);
                  }}
                >
                  <Images className="text-[var(--sidebar-accent-foreground)]" />
                  Change Profile Picture
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Confirmation</DialogTitle>
                  <DialogDescription>Upload your new profile picture</DialogDescription>
                </DialogHeader>
                <Form {...imageUploadForm}>
                  <form onSubmit={imageUploadForm.handleSubmit(submitImage)}>
                    <Input type="file" {...imageUploadForm.register("image")} accept="image/*" />
                    <DialogFooter className="my-2">
                      <DialogClose asChild>
                        <Button variant="secondary" type="button">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit">{imageUploadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Dialog open={emailOpen} onOpenChange={_emailModalCleanup}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setEmailOpen(true);
                  }}
                >
                  <Mails className="text-[var(--sidebar-accent-foreground)]" />
                  Change Email
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Input new Email</DialogTitle>
                  <DialogDescription>Change the email of the user, and the user would be logged out</DialogDescription>
                </DialogHeader>
                <Form {...emailForm}>
                  <form id="change-description-form" onSubmit={emailForm.handleSubmit(submitEmail)}>
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
                      <Button type="submit">{emailMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Dialog open={passwordOpen} onOpenChange={_passwordModalCleanup}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setPasswordOpen(true);
                  }}
                >
                  <RectangleEllipsis className="text-[var(--sidebar-accent-foreground)]" />
                  Change Password
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Input new Password</DialogTitle>
                  <DialogDescription>Change the password of the user, and the user would be logged out</DialogDescription>
                </DialogHeader>
                <Form {...passwordForm}>
                  <form id="change-description-form" onSubmit={passwordForm.handleSubmit(submitPassword)}>
                    <FormField
                      control={passwordForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">Password :</FormLabel>
                          <div className="flex flex-row gap-1 justify-center item-center">
                            <FormControl>
                              <Input type={showPassword ? "text" : "password"} autoComplete="new-password" {...field} />
                            </FormControl>
                            <Button type="button" variant="outline" size="icon" className="size-9" onClick={() => setShowPassword((prev) => !prev)}>
                              {showPassword ? <EyeIcon className="w-4 h-4" /> : <EyeOffIcon className="w-4 h-4" />}
                            </Button>
                          </div>
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
                      <Button type="submit">{passwordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {alert.type && (
        <Alert
          className={cn(
            "fixed bottom-4 right-4 w-96 z-50",
            alert.type === "success" ? "border-[var(--border)] bg-[var(--accent)] text-[var(--foreground)]" : "border-[var(--destructive)] bg-[var(--destructive)]/10 text-[var(--foreground)]"
          )}
          variant={alert.type === "success" ? "default" : "destructive"}
        >
          {alert.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
