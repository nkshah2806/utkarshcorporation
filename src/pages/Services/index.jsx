import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import user from "../../assets/user.png";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  EyeIcon,
  IndianRupee,
  PencilRuler,
  PercentIcon,
  Plus,
} from "lucide-react";
import ReusableTable from "@/components/ReusableTable";
import DeleteDialog from "@/components/DeleteDialog";
import { getAllService, toggleServiceStatus } from "@/services/serviceApi";
import { useApiMutation } from "@/hooks/useApiMutation";

export default function Services() {
  const navigate = useNavigate();
  const tableRef = useRef();

  // State for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Helper to truncate description
  const getTruncated = (text, wordLimit = 5) => {
    const words = text?.split(" ") || [];
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Modal component
  const DescriptionModal = ({ open, content, onClose }) =>
    open ? (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 bg-[#000000ab] bg-opacity-30"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-black p-4 rounded shadow-lg max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-2 dark:text-white font-bold">Full Description</div>
          <div className="mb-4 dark:text-white">{content}</div>
          <div className="flex justify-end">
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    ) : null;

  const headers = [
    {
      key: "sNo",
      label: "S. No.",
      filterable: false,
    },
    {
      key: "profileUrl",
      label: "Profile",
      filterable: false,
      render: (row) => (
        <img
          className="w-10 h-10 object-cover bg-gray-200 rounded-xs"
          src={row.profileUrl}
          alt={`${row.firstname} profile`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = user;
          }}
        />
      ),
    },
    {
      key: "title",
      label: "Title",
      filterable: true,
    },
    {
      key: "description",
      label: "Description",
      filterable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          {getTruncated(row.description, 5)}
          {row.description && row.description.split(" ").length > 5 && (
            <button
              className="text-[#e15920] ml-2"
              onClick={() => {
                setModalContent(row.description);
                setModalOpen(true);
              }}
            >
              Read more
            </button>
          )}
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      filterable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          <DollarSign className="size-4" />
          {row.price}
        </div>
      ),
    },
    {
      key: "tax",
      label: "Tax",
      filterable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.tax}
          <PercentIcon className="size-4" />
        </div>
      ),
    },
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
        <div className="flex items-center gap-1">
          <DeleteDialog
            title={`${!row.isActive ? "Active" : "Inactive"} Service?`}
            des={`Are you sure you want to ${!row.isActive ? "Active" : "InActive"
              } ${row.title}?`}
            row={row}
            handleToggleChange={HandleDelete}
          />
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.isActive && (
            <Button variant="outline" onClick={() => handleAction(row, "edit")}>
              <PencilRuler className="size-5" strokeWidth={1.5} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleAction = (data, type) => {
    if (type === "edit") {
      navigate(`edit/${data.id}`);
    }
  };

  const deleteUserMutation = useApiMutation(
    ({ id, data }) => toggleServiceStatus(id, data),
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
        serviceId: data.id,
        isActive: status,
      },
    });
  };

  const handleSelectionChange = (selectedRows) => {
    console.log("Selected users:", selectedRows);
  };

  return (
    <>
      <DescriptionModal
        open={modalOpen}
        content={modalContent}
        onClose={() => setModalOpen(false)}
      />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex gap-1.5 flex-col">
              <CardTitle>List of Services</CardTitle>
              <CardDescription>All services information below.</CardDescription>
            </div>
            <Button variant="default" onClick={() => navigate(`create`)}>
              <Plus className="size-5" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ReusableTable
            routeType={`table-Service`}
            ref={tableRef}
            headers={headers}
            apiPagination
            fetchData={getAllService}
            selectable={false}
            onSelectionChange={handleSelectionChange}
            DateRange={true}
            Search={true}
          />
        </CardContent>
      </Card>
    </>
  );
}
