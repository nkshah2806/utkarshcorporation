import React, { useRef, useState } from "react";
import ReusableTable from "@/components/ReusableTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllSupport, updateStatus } from "@/services/supportApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function Support() {
  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
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
  const RemarkandMessageModal = ({ open, content, onClose }) =>
    open ? (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 bg-[#000000ab] bg-opacity-30"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-black p-4 rounded shadow-lg max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-2 dark:text-white font-bold">Full Data</div>
          <div className="mb-4 dark:text-white">{content}</div>
          <div className="flex justify-end">
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    ) : null;

  const tableRef = useRef();

  const handleOpenModal = (row) => {
    setSelectedTicket(row);
    setNewStatus("");
    setRemark("");
    setOpenModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error("Please select a status.");
      return;
    }
    if (!remark.trim()) {
      toast.error("Please Enter a Remark.");
      return;
    }
    try {
      setLoading(true);
      await updateStatus(selectedTicket._id, newStatus, remark);
      toast.success(`Ticket status updated to "${newStatus}"`);
      setOpenModal(false);
      setRemark("");
      setNewStatus("");
      setSelectedTicket(null);
      if (tableRef.current) tableRef.current.refetchTable?.();
    } catch (err) {
      toast.error(err.message || "Failed to update booking status");
    } finally {
      setLoading(false);
    }
  };

  const headers = [
    {
      key: "sNo",
      label: "S. No.",
      filterable: false,
    },
    {
      key: "userName",
      label: "User Name",
      filterable: true,
    },
    { key: "email", label: "Email", filterable: true },
    { key: "phoneNumber", label: "Phone Number", filterable: true },
    {
      key: "status",
      label: "Status",
      filterable: true,
      render: (row) => {
        const status = row.status?.toLowerCase();
        let className = "bg-muted text-muted-foreground";

        if (status === "open") className = "bg-green-100 text-green-800";
        else if (status === "in progress") className = "bg-yellow-100 text-yellow-800";
        else if (status === "closed") className = "bg-red-100 text-red-800";

        return (
          <span
            className={`inline-block w-[110px] text-center px-2 py-1 text-xs font-medium rounded-full capitalize ${className}`}
          >
            {row.status || "Unknown"}
          </span>
        );
      }
    },
    {
      key: "remark", label: "Remark", filterable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          {getTruncated(row.remark, 5)}
          {row.remark && row.remark.split(" ").length > 5 && (
            <button
              className="text-[#e15920] ml-2"
              onClick={() => {
                setModalContent(row.remark);
                setModalOpen(true);
              }}
            >
              Read more
            </button>
          )}
        </div>
      ),

    },
    { key: "category", label: "Category", filterable: true },
    {
      key: "message", label: "Message", filterable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          {getTruncated(row.message, 5)}
          {row.message && row.message.split(" ").length > 5 && (
            <button
              className="text-[#e15920] ml-2"
              onClick={() => {
                setModalContent(row.message);
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
      key: "createdAt",
      label: "Created At",
      filterable: true,
    },
    {
      key: "Actions",
      label: "Actions",
      filterable: true,
      render: (row) => (
        <div className="flex gap-3">
          {
            (row.status === "Open" || row.status === "In Progress") &&
            (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleOpenModal(row)}
              >
                Update Status
              </Button>
            )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <RemarkandMessageModal
        open={modalOpen}
        content={modalContent}
        onClose={() => setModalOpen(false)}
      />

      <Card>
        <CardHeader>
          <CardTitle>List of Supports</CardTitle>
          <CardDescription>All support information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <ReusableTable
            routeType={`table-Support`}
            ref={tableRef}
            headers={headers}
            apiPagination
            fetchData={getAllSupport}
            selectable={false}
            DateRange={true}
            Search={true}
          />
        </CardContent>
      </Card>

      {/* Update Status Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Ticket Status</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Change the status and add your remark to help resolve the ticket.
          </DialogDescription>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {selectedTicket?.status === "Open" && (
                    <>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </>
                  )}
                  {selectedTicket?.status === "In Progress" && (
                    <SelectItem value="Closed">Closed</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Add Remark</Label>
              <Textarea
                id="remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter Remark..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Close
            </Button>
            <Button onClick={handleUpdateStatus} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
