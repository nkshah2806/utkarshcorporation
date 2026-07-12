// BulkUploadServiceAvailability.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { updateService } from "@/services/serviceApi";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { deleteAvailability } from "@/services/serviceApi"; // Adjust path

const ITEMS_PER_PAGE = 10;

export default function BulkUploadServiceAvailability() {
  const { id: serviceId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorRows, setErrorRows] = useState([]);
  const [creating, setCreating] = useState(false);
  const [existingAvailability, setExistingAvailability] = useState([]);
  const [parsedSearchTerm, setParsedSearchTerm] = useState("");
  const [existingSearchTerm, setExistingSearchTerm] = useState("");

  const [parsedCurrentPage, setParsedCurrentPage] = useState(1);
  const [existingCurrentPage, setExistingCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteDialogOpen = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId || !serviceId) return;

    try {
      await deleteAvailability(serviceId, deleteId);
      setExistingAvailability(prev => prev.filter(a => a._id !== deleteId));
      toast.success("Availability deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete availability.");
    } finally {
      setOpenDialog(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;
      try {
        const res = await axiosInstance.get(`/service/getServicesById/${serviceId}`);
        setExistingAvailability(res.data.data.availability || []);
      } catch (err) {
        console.error("Failed to fetch service", err);
        toast.error("Failed to load existing data.");
      }
    };
    fetchService();
  }, [serviceId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (uploadFile) => {
    if (!uploadFile || !serviceId) {
      toast.error("Please select a valid file.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("serviceId", serviceId);

      const res = await axiosInstance.post(
        "/service/availability/bulk-upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const resultRows = Array.isArray(res.data.data?.resultRows) ? res.data.data.resultRows : [];
      setParsedData(resultRows);
      setErrorRows(resultRows.filter((row) => row.error));
      toast.success(res.data.meta?.message || "File uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload or parse file.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!serviceId) return;
    setCreating(true);

    try {
      const validRows = parsedData.filter((row) => !row.error);
      const newRows = validRows.filter((row) => {
        return !existingAvailability.some((existing) =>
          existing.city === row.city &&
          existing.state === row.state &&
          existing.zipcode === row.zipcode &&
          existing.location === row.location
        );
      });

      if (newRows.length === 0) {
        toast.info("No new availability to add.");
        return;
      }

      const availability = newRows.map((row) => ({
        quantity: row.quantity,
        location: row.location,
        city: row.city,
        state: row.state,
        zipcode: row.zipcode,
      }));

      await updateService(serviceId, { availability });
      toast.success("New availability rows added successfully");
      navigate("/services");
    } catch (err) {
      console.error("Create error:", err);
      toast.error("Failed to add new availability.");
    } finally {
      setCreating(false);
    }
  };

  const filteredParsedData = parsedData.filter((row) =>
    `${row.state} ${row.zipcode} ${row.city} ${row.location} ${row.quantity}`
      .toLowerCase()
      .includes(parsedSearchTerm.toLowerCase())
  );
  const parsedTotalPages = Math.max(1, Math.ceil(filteredParsedData.length / ITEMS_PER_PAGE));
  const paginatedParsedData = filteredParsedData.slice(
    (parsedCurrentPage - 1) * ITEMS_PER_PAGE,
    parsedCurrentPage * ITEMS_PER_PAGE
  );

  const filteredExistingData = existingAvailability.filter((row) =>
    `${row.state} ${row.zipcode} ${row.city} ${row.location} ${row.quantity}`
      .toLowerCase()
      .includes(existingSearchTerm.toLowerCase())
  );
  const existingTotalPages = Math.max(1, Math.ceil(filteredExistingData.length / ITEMS_PER_PAGE));
  const paginatedExistingData = filteredExistingData.slice(
    (existingCurrentPage - 1) * ITEMS_PER_PAGE,
    existingCurrentPage * ITEMS_PER_PAGE
  );

  function NumberedPagination({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-wrap gap-1 items-center">
        {pageNumbers.map((page) => (
          <Button
            key={page}
            size="sm"
            variant={page === currentPage ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className={page === currentPage ? "bg-primary text-white" : ""}
          >
            {page}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Availability?</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this availability entry? This action cannot be undone.</p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Bulk Upload Availability - Upload zipcode for this service area</CardTitle>
          <Button variant="outline" asChild>
            <a href="/Service_Sample_File.xlsx" download className="flex items-center gap-2">
              ⬇️ Download Sample File
            </a>
          </Button>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="relative w-full">
            <label
              htmlFor="file-upload"
              className="border-2 border-dashed border-muted-foreground p-6 rounded-md cursor-pointer flex flex-col items-center justify-center w-full min-h-52 bg-muted/50 hover:bg-muted/70 transition"
            >
              <span className="text-muted-foreground text-5xl mb-4">📄</span>
              <p className="text-muted-foreground text-sm font-medium">
                Click to upload .xlsx or .xls file
              </p>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileChange}
            />
            {loading && (
              <div className="absolute inset-0 bg-background/80 z-20 flex items-center justify-center backdrop-blur-sm">
                <div className="text-muted-foreground text-lg font-medium animate-pulse">
                  Uploading file...
                </div>
              </div>
            )}
          </div>

          {parsedData.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-lg font-semibold">
                  Uploaded Results ({filteredParsedData.length})
                </h2>
                <Input
                  placeholder="Search uploaded..."
                  value={parsedSearchTerm}
                  onChange={(e) => {
                    setParsedSearchTerm(e.target.value);
                    setParsedCurrentPage(1);
                  }}
                  className="w-full md:w-60"
                />
              </div>

              <Separator />

              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Zipcode</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedParsedData.length > 0 ? (
                      paginatedParsedData.map((row, index) => (
                        <TableRow
                          key={index}
                          className={row.error ? "bg-red-100 text-red-800" : ""}
                        >
                          <TableCell>{row.rowNumber || index + 1}</TableCell>
                          <TableCell>{row.state}</TableCell>
                          <TableCell>{row.zipcode}</TableCell>
                          <TableCell>{row.city}</TableCell>
                          <TableCell>{row.location}</TableCell>
                          <TableCell>{row.quantity}</TableCell>
                          <TableCell>{row.error || "-"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          No data found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredParsedData.length > 0 && (
                <div className="flex justify-between items-center text-sm mt-2">
                  <span>Page {parsedCurrentPage} of {parsedTotalPages}</span>
                  <NumberedPagination
                    currentPage={parsedCurrentPage}
                    totalPages={parsedTotalPages}
                    onPageChange={setParsedCurrentPage}
                  />
                </div>
              )}
            </div>
          )}

          {existingAvailability.length > 0 && (
            <div className="p-4 border rounded-md bg-muted/50 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="font-medium text-lg">
                  Existing Availability ({filteredExistingData.length}) - Existing States and Quantities
                </h3>
                <Input
                  placeholder="Search existing..."
                  value={existingSearchTerm}
                  onChange={(e) => {
                    setExistingSearchTerm(e.target.value);
                    setExistingCurrentPage(1);
                  }}
                  className="w-full md:w-60"
                />
              </div>

              <Separator />

              <div className="overflow-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Sr No</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Zipcode</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedExistingData.length > 0 ? (
                      paginatedExistingData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{(existingCurrentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                          <TableCell>{row.location}</TableCell>
                          <TableCell>{row.city}</TableCell>
                          <TableCell>{row.state}</TableCell>
                          <TableCell>{row.zipcode}</TableCell>
                          <TableCell>{row.quantity}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteDialogOpen(row._id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center text-muted-foreground">
                          No data found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredExistingData.length > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span>Page {existingCurrentPage} of {existingTotalPages}</span>
                  <NumberedPagination
                    currentPage={existingCurrentPage}
                    totalPages={existingTotalPages}
                    onPageChange={setExistingCurrentPage}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate("/services")}>Cancel</Button>
          {parsedData.length > 0 && errorRows.length === 0 && (
            <Button onClick={handleCreate} disabled={creating}>Add Data</Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
