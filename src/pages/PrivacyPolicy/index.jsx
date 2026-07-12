import ReusableTable from "@/components/ReusableTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllPrivacyPolicy } from "@/services/privacyPolicyApi";
import { PencilRuler } from "lucide-react";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const tableRef = useRef();
  const headers = [
    {
      key: "sNo",
      label: "S. No.",
      filterable: false,
    },
    {
      key: "description",
      label: "Description",
      filterable: true,
    },
    {
      key: "updatedAt",
      label: "Updated At",
      filterable: true,
    },
    {
      key: "createdAt",
      label: "Created At",
      filterable: true,
    },
    {
      key: "isActive",
      label: "Status",
      filterable: false,
      render: (row) => (
        <Badge variant={row.isActive ? "outline" : "secondary"}>
          {row.isActive ? "Active" : "InActive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <>
          <Button variant="outline" onClick={() => handleAction(row, "edit")}>
            <PencilRuler className="size-5" strokeWidth={1.5} />
          </Button>
        </>
      ),
    },
  ];
  const handleAction = (data) => {
    navigate(`edit/${data.id}`);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>List of Privacy Policys</CardTitle>
          <CardDescription>All privacy policy information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <ReusableTable
            routeType={`table-PrivacyPolicy`}
            ref={tableRef}
            headers={headers}
            apiPagination
            fetchData={getAllPrivacyPolicy}
            selectable={false}
            DateRange={true}
            Search={true}
          />
        </CardContent>
      </Card>
    </>
  );
}
