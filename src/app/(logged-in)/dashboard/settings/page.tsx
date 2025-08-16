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

export default function Page() {
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
              <Button className="ml-auto">Upload</Button>
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
            <p className="text-sm text-destructive">
              Danger Zone : This change would log you out
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-auto">Change Email</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Input new Email</DialogTitle>
                <DialogDescription>
                  This action can&apos;t be undone, you would be logged off
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
      </div>
    </>
  );
}
