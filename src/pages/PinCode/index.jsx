import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReusableTable from "@/components/ReusableTable";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DeleteDialog from "@/components/DeleteDialog";
import { getAllPincode, togglePincodeStatus } from "@/services/pinCodeApi";

export default function PinCode() {
  const navigate = useNavigate();
  const tableRef = useRef();

  const headers = [
    {
      key: "sNo",
      label: "S. No.",
      filterable: false,
    },
    {
      key: "pinCode",
      label: "Zip Code",
      filterable: true,
    },
    { key: "state", label: "State Name", filterable: true },
    {
      key: "createdAt",
      label: "Created At",
      filterable: true,
    },
    {
      key: "isActive",
      label: "isActive",
      filterable: true,
      render: (row) => (
        <DeleteDialog
          title={`${!row.isActive ? "Active" : "Inactive"} Zip Code?`}
          des={`Are you sure you want to ${
            !row.isActive ? "Active" : "InActive"
          } ${row.stateName}?`}
          row={row}
          handleToggleChange={HandleDelete}
        />
      ),
    },
  ];

  // const handleAction = (user) => {
  //   navigate(`edit/${user.id}`);
  // };

  const deleteUserMutation = useApiMutation(
    ({ id, data }) => togglePincodeStatus(id, data),
    {
      successMessage: "Status updated successfully",
      onSuccess: () => {
        if (tableRef.current) {
          tableRef.current.refetchTable();
        }
      },
    }
  );

  const HandleDelete = (data, status) => {
    deleteUserMutation.mutate({
      id: data.id,
      data: {
        pincodeId: data.id,
        isActive: status,
      },
    });
  };

  const handleSelectionChange = (selectedRows) => {
    console.log("Selected users:", selectedRows);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>List of Zip Codes</CardTitle>
            <CardDescription>All zip code information below.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate(`create`)} variant={"default"}>
              <Plus className="size-5" />
              Add Zip Code
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ReusableTable
          routeType={`table-PinCode`}
          ref={tableRef}
          headers={headers}
          apiPagination
          fetchData={getAllPincode}
          selectable={false}
          onSelectionChange={handleSelectionChange}
          DateRange={true}
          Search={true}
        />
      </CardContent>
    </Card>
  );
}
