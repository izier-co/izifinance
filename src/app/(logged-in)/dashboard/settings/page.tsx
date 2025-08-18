"use client";
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
  emailFormSchema,
  EmailFormSchema,
  passwordFormSchema,
  PasswordFormSchema,
} from "@/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Page() {
  const router = useRouter();
  async function _changeEmail(data: EmailFormSchema) {
    await fetchJSONAPI("POST", "/api/v1/auth/update-credentials", data);
    await fetchJSONAPI("POST", "/api/v1/auth/logout");
    router.replace("/");
  }
  async function _changePassword(data: PasswordFormSchema) {
    await fetchJSONAPI("POST", "/api/v1/auth/update-credentials", data);
    await fetchJSONAPI("POST", "/api/v1/auth/logout");
    router.replace("/");
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
      emailForm.reset();
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
    <>
      <div className="w-auto">
        <h1 className="mb-2">Settings Page</h1>
        <hr className="my-2" />
        <div className="flex">
          <div>
            <h2>Profile Picture</h2>
            <p className="text-sm">Update Profile Picture</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-auto my-auto">Upload</Button>
            </DialogTrigger>
            <DialogContent>
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
        </div>
        <hr className="my-2" />
        <div className="flex">
          <div>
            <h2>Change Email</h2>
            <p className="text-sm">You will be given a confirmation email</p>
            <p className="text-sm text-destructive">
              Danger Zone : This change would log you out
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-auto my-auto">Change Email</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Input new Email</DialogTitle>
                <DialogDescription>
                  This action can&apos;t be undone, you would be logged off
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
        </div>
        <hr className="my-2" />
        <div className="flex">
          <div>
            <h2>Change Password</h2>
            <p className="text-sm text-destructive">
              Danger Zone : This change would log you out
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-auto">Change Password</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Input new Password</DialogTitle>
                <DialogDescription>
                  This action can&apos;t be undone, you would be logged off
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
        </div>
      </div>
    </>
  );
}
