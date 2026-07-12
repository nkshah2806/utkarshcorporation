import { ImageUploader } from "@/components/image-uploader";
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
import { Textarea } from "@/components/ui/textarea";
import { useApiMutation } from "@/hooks/useApiMutation";
import axiosInstance from "@/lib/axios";
import {
  createService,
  deleteServiceImage,
  updateService,
} from "@/services/serviceApi";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
export default function CreateService() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      priceType: "fixed",
    }
  });

  const [defaultImage, setDefaultImage] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const priceTypeValue = watch("priceType");
  const isMoverValue = watch("isMover");

  const onSubmit = (data) => {
    const payload = {
      title: data.title,
      price: data.price.toString(),
      tax: data.tax.toString(),
      description: data.description,
      priceType: data.priceType,
      isActive: isActive,
      isMover: !!isMoverValue,
    };

    if (id) {
      updateServiceMutation.mutate({ id: id, data: payload });
    } else {
      createServiceMutation.mutate(payload);
    }
  };
  const createServiceMutation = useApiMutation(createService, {
    successMessage: "Service created successfully",
    onSuccess: async (res) => {
      if (res?._id) {
        handleUploadProfileToServer(res?._id);
        navigate(`/services/bulk-upload/${res._id}`);
      }
    },
    onError: (err) => {
      setError("apiError", {
        type: "manual",
        message: err?.response?.data?.meta?.message || err?.response?.data?.message || "Something went wrong",
      });
    },
  });
  const updateServiceMutation = useApiMutation(
    ({ id, data }) => updateService(id, data),
    {
      successMessage: "Service updated successfully",
      onSuccess: () => {
        if (id) {
          handleUploadProfileToServer(id);
          navigate(`/services/bulk-upload/${id}`);
        }
      },
      onError: (err) => {
        setError("apiError", {
          type: "manual",
          message: err?.response?.data?.meta?.message || err?.response?.data?.message || "Something went wrong",
        });
      },
    }
  );
  const deleteServiceImageMutation = useApiMutation(
    ({ id, imageUrl }) => deleteServiceImage(id, imageUrl),
    {
      // successMessage: "Service image deleted successfully",
      onSuccess: (res) => {
        const defaultImages = res.image || [];
        setDefaultImage(defaultImages);
      },
      onError: (err) => {
        setError("apiError", {
          type: "manual",
          message: err?.response?.data?.message || "Something went wrong",
        });
      },
    }
  );
  const getServiceDetails = async () => {
    try {
      if (id) {
        const response = await axiosInstance.get(
          `service/getServicesById/${id}`
        );
        const user = response?.data?.data;
        setValue("title", user?.title);
        setValue("description", user?.description);
        setValue("priceType", user?.priceType);
        setValue("price", user?.price);
        setValue("tax", user?.tax);
        setIsActive(user?.isActive);
        setDefaultImage(user?.image);
        setValue("isMover", user?.isMover);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch user details.");
    }
  };

  useEffect(() => {
    getServiceDetails();
  }, [id]);

  const handleUploadProfileToServer = async (serviceId) => {
    if (!selectedImage || selectedImage.length === 0) return;
    try {
      const formData = new FormData();
      formData.append("serviceId", serviceId);
      for (let i = 0; i < selectedImage.length; i++) {
        formData.append("imageURLs", selectedImage[i]);
      }
      const response = await axiosInstance.post(
        `service/uploadImages`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(response.data.meta.message);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Try again.");
    }
  };

  const handleDeleteDefaultImage = async (imgUrl) => {
    deleteServiceImageMutation.mutate({
      id: id,
      imageUrl: imgUrl,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit" : "Create"} Service</CardTitle>
          <CardDescription>
            {id ? "Update" : "Add"} Service information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <ImageUploader
              label="Upload Service Images"
              // defaultImage={imageURLs.length > 0 ? imageURLs : defaultImage}
              defaultImage={defaultImage}
              onImageChange={setSelectedImage}
              deleteDefaultImage={(imgUrl) => handleDeleteDefaultImage(imgUrl)}
              apiUrl="service/uploadImages"
              multiple={true}
              handleUploadProfile={() => { }}
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 w-full items-center gap-4">
              <div className="col-span-3 mb-auto flex flex-col space-y-1.5">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter title"
                  {...register("title", {
                    required: "Title is required",
                    maxLength: {
                      value: 25,
                      message: "Title can not exceed 25 characters",
                    },
                    pattern: {
                      value: /^.{1,25}$/,
                      message: "Title must be between 1 and 25 characters",
                    },
                    onChange: () => clearErrors('apiError')
                  })}
                />
                {errors.title && (
                  <span className="text-red-500 text-sm">
                    {errors.title.message}
                  </span>
                )}
              </div>
              <div className="col-span-3 mb-auto flex flex-col space-y-1.5">
                <Label htmlFor="priceType">
                  Price Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setValue("priceType", value);
                    clearErrors('apiError')

                  }}
                  value={priceTypeValue}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select price type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priceType && (
                  <span className="text-red-500 text-sm">
                    {errors.priceType.message}
                  </span>
                )}
              </div>
              <div className="col-span-3 mb-auto flex flex-col space-y-1.5">
                <Label htmlFor="price">
                  Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  placeholder="Enter price"
                  {...register("price", {
                    required: "Price is required",
                    min: {
                      value: 0.01,
                      message: "Price must be at least 0.01",
                    },
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: "Only numbers and up to 2 decimal places allowed",
                    },
                    onChange: () => clearErrors('apiError')
                  })}
                />
                {errors.price && (
                  <span className="text-red-500 text-sm">
                    {errors.price.message}
                  </span>
                )}
              </div>
              <div className="col-span-3 mb-auto flex flex-col space-y-1.5">
                <Label htmlFor="tax">
                  Tax <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tax"
                  placeholder="Enter tax"
                  {...register("tax", {
                    required: "Tax is required",
                    min: {
                      value: 0.01,
                      message: "Tax must be at least 0.01",
                    },
                    max: {
                      value: 100,
                      message: "Tax must be maximum 100",
                    },
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: "Only numbers and up to 2 decimal places allowed",
                    },
                    onChange: () => clearErrors('apiError')
                  })}
                />
                {errors.tax && (
                  <span className="text-red-500 text-sm">
                    {errors.tax.message}
                  </span>
                )}
              </div>
              <div className="col-span-3 gap-3 flex space-y-1.5 items-center">
                <Label htmlFor="isMover">Is Mover</Label>
                <Controller
                  name="isMover"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="col-span-12 flex flex-col space-y-1.5">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  className="min-h-60"
                  id="description"
                  placeholder="Enter description"
                  {...register("description", {
                    required: "Description is required",
                    maxLength: {
                      value: 500,
                      message: "Description can not exceed 500 characters",
                    },
                    onChange: () => clearErrors('apiError')
                  })}
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">
                    {errors.description.message}
                  </span>
                )}
              </div>
            </div>
            {errors.apiError && (
              <p className="text-red-500 text-sm">
                {errors.apiError.message}
              </p>
            )}
            <CardFooter className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/services")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createServiceMutation.isPending ||
                  updateServiceMutation.isPending
                }
              >
                {id
                  ? updateServiceMutation.isPending
                    ? "Next..."
                    : "Next"
                  : createServiceMutation.isPending
                    ? "Next..."
                    : "Next"}
              </Button>

            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
