"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { booleanToString, fetchJSONAPI } from "@/lib/lib";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

async function getData(id: string) {
  const data = await fetchJSONAPI("GET", `/api/v1/employees/${id}`);
  const json = await data.json();
  console.log(json["data"][0]);
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
    return <>Loading</>;
  }
  if (dataQuery.isError) {
    console.error(dataQuery.error.message);
    return <>Error : {dataQuery.error.message} </>;
  }
  const data = dataQuery.data;
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
        </TableRow>
        <TableRow>
          <TableCell>Full Name</TableCell>
          <TableCell>{data["txFullName"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Date of Birth</TableCell>
          <TableCell>{data["daDateOfBirth"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Home Address</TableCell>
          <TableCell>{data["txHomeAddress"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>National ID Number</TableCell>
          <TableCell>{data["txNationalIdNumber"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Religion Code</TableCell>
          <TableCell>{data["inReligionCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Tax Number</TableCell>
          <TableCell>{data["txTaxNumber"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Marriage Status</TableCell>
          <TableCell>
            {booleanToString(data["boMarriageStatus"], "Married", "Unmarried")}
          </TableCell>
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
          <TableCell>{data["inRoleCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Active Status</TableCell>
          <TableCell>
            {booleanToString(data["boActive"], "Active", "Inactive")}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Employment Type</TableCell>
          <TableCell>{data["inEmploymentTypeCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Employee Code</TableCell>
          <TableCell>{data["txEmployeeCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Company Name</TableCell>
          <TableCell>{data["inCompanyCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Phone Number</TableCell>
          <TableCell>{data["txPhoneNumber"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Email Address</TableCell>
          <TableCell>{data["txEmailAddress"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bank Type</TableCell>
          <TableCell>{data["inBankTypeCode"]}</TableCell>
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
          <TableCell>{data["uiUserID"]}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <EmployeeTable id={id} />;
}
