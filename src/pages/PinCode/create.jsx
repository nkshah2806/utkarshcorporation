import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPincode, getAllState } from "@/services/pinCodeApi";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaFileDownload, FaFileUpload } from "react-icons/fa";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CreatePinCode() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [allState, setAllState] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [failedRows, setFailedRows] = useState([]);
  const [fileError, setFileError] = useState(""); // For file validation message

  const onSubmit = (data) => {
    if (!selectedState || selectedState === "") {
      setError("state", {
        type: "manual",
        message: "State is required",
      });
      return;
    } else {
      setLoading(true);
      const payload = {
        pinCode: data.pinCode,
        stateId: selectedState,
        isActive: isActive,
      };
      createPinCodeMutation.mutate(payload, {
        onSettled: () => setLoading(false),
      });
    }
  };

  const createPinCodeMutation = useApiMutation(createPincode, {
    successMessage: "Pin code created successfully",
    onSuccess: (res) => {
      navigate("/pincode");
    },
    onError: (err) => {
      setError("apiError", {
        type: "manual",
        message: err?.response?.data?.message || "Something went wrong",
      });
    },
  });
  const getAllStateMutation = useApiMutation(getAllState, {
    onSuccess: (data) => {
      setAllState(data);
    },
    onError: (err) => {
      setError("apiError", {
        type: "manual",
        message: err?.response?.data?.message || "Something went wrong",
      });
    },
  });

  const handleStateChange = (value) => {
    setSelectedState(value);
    if (value) {
      clearErrors("state");
    }
  };
  useEffect(() => {
    getAllStateMutation.mutate();
  }, []);

  const handleUpload = async (file) => {
    setFailedRows([]);
    setFileError("");
    if (!file) return;

    // Validate file type
    if (
      !(
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.toLowerCase().endsWith(".xlsx")
      )
    ) {
      setFileError("Only .xlsx files are allowed.");
      toast.error("Invalid file type. Please upload an .xlsx file.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        `pincode/upload-excel`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(response.data.meta.message);
      if (
        response.data.data &&
        Array.isArray(response.data.data.failedRows) &&
        response.data.data.failedRows.length > 0
      ) {
        setFailedRows(response.data.data.failedRows);
      } else {
        setFailedRows([]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Try again.");
      setFailedRows([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="manually">
      <TabsList>
        <TabsTrigger value="manually">Manually</TabsTrigger>
        <TabsTrigger value="bulkUpload">Bulk Upload</TabsTrigger>
      </TabsList>
      <TabsContent value="manually">
        <Card>
          <CardHeader>
            <CardTitle>{id ? "Edit" : "Create"} zip code</CardTitle>
            <CardDescription>
              {id ? "Update" : "Add"} zip code information below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-12 w-full items-center gap-4">
                <div className="col-span-3 flex flex-col space-y-1.5 relative">
                  <Label htmlFor="pinCode">
                    Zip Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pinCode"
                    type="text"
                    placeholder="Enter zip code"
                    className="m-0"
                    maxLength={5}
                    {...register("pinCode", {
                      required: "Zip code is required",
                      pattern: {
                        value: /^[0-9]{5}$/,
                        message: "Zip code must be 5 only digits",
                      },
                      minLength: {
                        value: 5,
                        message: "Zip code must be exactly 5 digits",
                      },
                      maxLength: {
                        value: 5,
                        message: "Zip code must be exactly 5 digits",
                      },
                    })}
                  />
                  {errors.pinCode && (
                    <span className="text-red-500 text-sm absolute bottom-[-20px] left-0">
                      {errors.pinCode.message}
                    </span>
                  )}
                </div>
                <div className="col-span-3 flex flex-col space-y-1.5 relative">
                  <Label htmlFor="state">
                    State <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={handleStateChange}
                    value={selectedState}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {allState.map((state, i) => (
                        <SelectItem key={i} value={state._id}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <span className="text-red-500 text-sm absolute bottom-[-20px] left-0">
                      {errors.state.message}
                    </span>
                  )}
                </div>
              </div>
              <CardFooter className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate("/pincode")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : id ? "Update" : "Create"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="bulkUpload">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Bulk zip code</CardTitle>
                <CardDescription>
                  Upload a file to add multiple zip codes at once.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  asChild
                  variant={"default"}
                  type="button"
                >
                  <a href="/Sample_File.xlsx" download>
                    <FaFileDownload className="size-5" />
                    Download sample file
                  </a>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid w-full relative">
              <Label
                htmlFor="file"
                className="border-2 border-dashed border-gray-400 p-4 rounded-lg cursor-pointer flex flex-col items-center justify-center w-full min-h-52"
              >
                <FaFileUpload className="text-gray-500 text-5xl mb-5" />
                Click to upload file (.xlsx)
              </Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleUpload(e.target.files[0]);
                    e.target.value = "";
                  }
                }}
              />
              {loading && (
                <div className="flex justify-center items-center h-full absolute top-0 left-0 w-full bg-white/70 z-10">
                  <Loader2 className="animate-spin size-10" />
                </div>
              )}
              {fileError && (
                <div className="text-red-500 text-sm mt-2">{fileError}</div>
              )}
            </div>
            {/* Show failed rows if any */}
            {failedRows.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-red-600 mb-2">Failed Rows</h4>
                <table className="min-w-full border text-sm text-center">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Row</th>
                      <th className="border px-2 py-1">Zip Code</th>
                      <th className="border px-2 py-1">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failedRows.map((row, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">{row.row}</td>
                        <td className="border px-2 py-1">{row.pinCode}</td>
                        <td className="border px-2 py-1">{row.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
