"use client";
<<<<<<< HEAD
import { MixedText } from "@/components/mixed-text";
import { DetailViewSkeleton } from "@/components/skeletons";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
=======
import { DetailViewSkeleton } from "@/components/skeletons";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
>>>>>>> 3dca31a (Add employees admin page (#3))
import { booleanToString, fetchJSONAPI } from "@/lib/lib";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { use } from "react";
import z from "zod";

const employeeIDSchema = z
  .string()
  .length(9)
  .refine((str) => ["F", "I", "P"].some((letter) => str.startsWith(letter)));
async function getData(id: string) {
  const data = await fetchJSONAPI("GET", `/api/v1/employees/${id}`);
  const json = await data.json();
  if (!data.ok) {
    throw new Error(json.error);
  }
  return json["data"][0];
}

function EmployeeTable({ id }: { id: string }) {
  const dataQuery = useQuery({
    queryKey: ["employee-data-query", id],
    queryFn: () => {
      return getData(id);
    },
  });
  if (dataQuery.isLoading) {
    return <DetailViewSkeleton />;
  }
  if (dataQuery.isError) {
    if (dataQuery.error.message.includes("data is undefined")) {
      notFound();
    }
    console.error(dataQuery.error.message);
    return <>Error : {dataQuery.error.message} </>;
  }
  const data = dataQuery.data;
<<<<<<< HEAD
  if (data.length === 0) {
=======
  if (data.data.length === 0) {
>>>>>>> 3dca31a (Add employees admin page (#3))
    notFound();
  }
  return (
    <Table className="mb-6 max-w-[80%] mx-auto">
      <TableHeader>
        <TableRow>
          <TableHead>Information</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Created At</TableCell>
<<<<<<< HEAD
          <TableCell>
            <MixedText value={data["daCreatedAt"]} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Updated At</TableCell>
          <TableCell>
            <MixedText value={data["daUpdatedAt"]} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Joined At</TableCell>
          <TableCell>
            <MixedText value={data["daJoinDate"]} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Join Year</TableCell>
          <TableCell>
            <MixedText value={data["inYear"]} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Join Month</TableCell>
          <TableCell>
            <MixedText value={data["inMonth"]} />
          </TableCell>
=======
          <TableCell>{data["daCreatedAt"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Updated At</TableCell>
          <TableCell>{data["daUpdatedAt"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Joined At</TableCell>
          <TableCell>{data["daJoinDate"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Join Year</TableCell>
          <TableCell>{data["inYear"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Join Month</TableCell>
          <TableCell>{data["inMonth"]}</TableCell>
>>>>>>> 3dca31a (Add employees admin page (#3))
        </TableRow>
        <TableRow>
          <TableCell>Full Name</TableCell>
          <TableCell>{data["txFullName"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Date of Birth</TableCell>
<<<<<<< HEAD
          <TableCell>
            <MixedText value={data["daDateOfBirth"]} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Home Address</TableCell>
          <TableCell>
            <MixedText value={data["txHomeAddress"]} />
          </TableCell>
=======
          <TableCell>{data["daDateOfBirth"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Home Address</TableCell>
          <TableCell>{data["txHomeAddress"]}</TableCell>
>>>>>>> 3dca31a (Add employees admin page (#3))
        </TableRow>
        <TableRow>
          <TableCell>National ID Number</TableCell>
          <TableCell>{data["txNationalIdNumber"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Religion Code</TableCell>
          <TableCell>{data["txReligionCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Tax Number</TableCell>
          <TableCell>{data["txTaxNumber"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Marriage Status</TableCell>
<<<<<<< HEAD
          <TableCell>
            {booleanToString(data["boMarriageStatus"], "Married", "Unmarried")}
          </TableCell>
=======
          <TableCell>{booleanToString(data["boMarriageStatus"], "Married", "Unmarried")}</TableCell>
>>>>>>> 3dca31a (Add employees admin page (#3))
        </TableRow>
        <TableRow>
          <TableCell>Number of Departments</TableCell>
          <TableCell>{data["inNumOfDeps"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Salary</TableCell>
          <TableCell>IDR {data["flSalary"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Role Code</TableCell>
<<<<<<< HEAD
          <TableCell>
            <MixedText value={data["txRoleCode"]} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Active Status</TableCell>
          <TableCell>
            {booleanToString(data["boActive"], "Active", "Inactive")}
          </TableCell>
=======
          <TableCell>{data["txRoleCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Active Status</TableCell>
          <TableCell>{booleanToString(data["boActive"], "Active", "Inactive")}</TableCell>
>>>>>>> 3dca31a (Add employees admin page (#3))
        </TableRow>
        <TableRow>
          <TableCell>Employment Type</TableCell>
          <TableCell>{data["txEmploymentTypeCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Employee Code</TableCell>
<<<<<<< HEAD
          <TableCell>
            <MixedText value={data["txEmployeeCode"]} />
          </TableCell>
=======
          <TableCell>{data["txEmployeeCode"]}</TableCell>
>>>>>>> 3dca31a (Add employees admin page (#3))
        </TableRow>
        <TableRow>
          <TableCell>Company Name</TableCell>
          <TableCell>{data["txCompanyCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Phone Number</TableCell>
          <TableCell>{data["txPhoneNumber"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Email Address</TableCell>
<<<<<<< HEAD
          <TableCell>
            <MixedText value={data["txEmailAddress"]} />
          </TableCell>
=======
          <TableCell>{data["txEmailAddress"]}</TableCell>
>>>>>>> 3dca31a (Add employees admin page (#3))
        </TableRow>
        <TableRow>
          <TableCell>Bank Type</TableCell>
          <TableCell>{data["txBankTypeCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bank Account Number</TableCell>
          <TableCell>{data["txBankAccountNumber"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Admin Access</TableCell>
          <TableCell>{booleanToString(data["boHasAdminAccess"])}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>User ID</TableCell>
<<<<<<< HEAD
          <TableCell>
            <MixedText value={data["uiUserID"]} />
          </TableCell>
=======
          <TableCell>{data["uiUserID"]}</TableCell>
>>>>>>> 3dca31a (Add employees admin page (#3))
        </TableRow>
      </TableBody>
    </Table>
  );
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const validatedID = employeeIDSchema.safeParse(id);
  if (validatedID.error) {
    throw new Error(validatedID.error.message);
  }
  return <EmployeeTable id={validatedID.data} />;
}
