import { Button } from "@/components/ui/button";

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
          <Button className="ml-auto">Upload</Button>
        </div>
        <hr className="my-2" />
        <div className="flex">
          <div>
            <h2>Change Email</h2>
            <p className="text-sm text-destructive">
              Warning : This change would log you out
            </p>
          </div>
          <Button className="ml-auto">Change Email</Button>
        </div>
        <hr className="my-2" />
        <div className="flex">
          <div>
            <h2>Change Password</h2>
            <p className="text-sm text-destructive">
              Warning : This change would log you out
            </p>
          </div>
          <Button className="ml-auto">Change Password</Button>
        </div>
      </div>
    </>
  );
}
