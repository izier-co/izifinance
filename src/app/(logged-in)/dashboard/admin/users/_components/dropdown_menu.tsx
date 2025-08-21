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
import { refreshAndRevalidatePage } from "@/lib/server-lib";
import {
  EmailFormSchema,
  PasswordFormSchema,
  emailFormSchema,
  passwordFormSchema,
} from "@/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { EyeIcon, EyeOffIcon, Loader2, MoreHorizontal } from "lucide-react";
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

  async function uploadImage(data: { image: File[] }) {
    const formData = new FormData();
    formData.append("image", data.image[0]);

    const response = await fetch(
      `/api/v1/auth/admin/${row.getValue("id")}/update-avatar`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  }

  async function _changeEmail(data: EmailFormSchema) {
    const res = await fetchJSONAPI(
      "PUT",
      `/api/v1/auth/admin/${row.getValue("id")}`,
      data
    );
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error);
    }
  }
  async function _changePassword(data: PasswordFormSchema) {
    const res = await fetchJSONAPI(
      "PUT",
      `/api/v1/auth/admin/${row.getValue("id")}`,
      data
    );
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

  const emailMutation = useMutation({
    mutationKey: ["change-email"],
    mutationFn: _changeEmail,
    onSuccess: () => {
      emailForm.reset();
      refreshAndRevalidatePage("/");
      setEmailOpen(false);
    },
    onError: (error) => {
      emailForm.setError("root", {
        message: error.message,
      });
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

  const imageUploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      refreshAndRevalidatePage("/dashboard", "layout");
      setProfileOpen(false);
    },
    onError: (err) => {
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
              <Form {...imageUploadForm}>
                <form onSubmit={imageUploadForm.handleSubmit(submitImage)}>
                  <Input
                    type="file"
                    {...imageUploadForm.register("image")}
                    accept="image/*"
                  />
                  <DialogFooter className="my-2">
                    <DialogClose asChild>
                      <Button variant="secondary" type="button">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">
                      {imageUploadMutation.isPending ? (
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
          <Dialog open={emailOpen} onOpenChange={_emailModalCleanup}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setEmailOpen(true);
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
          <Dialog open={passwordOpen} onOpenChange={_passwordModalCleanup}>
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
                        <div className="flex flex-row gap-1 justify-center item-center">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <EyeIcon className="w-4 h-4" />
                            ) : (
                              <EyeOffIcon className="w-4 h-4" />
                            )}
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
