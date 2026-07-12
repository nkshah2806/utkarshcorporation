import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApiMutation } from "@/hooks/useApiMutation";
import {
  getPrivacyPolicyById,
  updatePrivacyPolicy,
} from "@/services/privacyPolicyApi";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export default function CreatePrivacyPolicy() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const onSubmit = (data) => {
    setLoading(true);
    const payload = {
      description: data.description,
    };
    if (id) {
      updatePrivacyPolicyMutation.mutate(payload);
    }
  };

  const updatePrivacyPolicyMutation = useApiMutation(
    updatePrivacyPolicy,
    {
      successMessage: "Privacy Policy updated successfully",
      onSuccess: () => {
        setLoading(false);
        navigate("/privacy-policy");
      },
      onError: (err) => {
        setLoading(false);
        setError("apiError", {
          type: "manual",
          message: err?.response?.data?.meta?.message || err?.response?.data?.message || "Something went wrong",
        });
      },
    }
  );

  const getPrivacyPolicyDetails = async () => {
    try {
      if (id) {
        const data = await getPrivacyPolicyById(id);
        setValue("description", data?.description);
      }
    } catch (error) {
      toast.error("Failed to fetch privacy policy details.");
    }
  };

  useEffect(() => {
    getPrivacyPolicyDetails();
  }, [id]);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit" : "Create"} Privacy Policy</CardTitle>
          <CardDescription>
            {id ? "Update" : "Add"} Privacy Policy information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 w-full items-center gap-4">
              <div className="col-span-12 flex flex-col space-y-1.5">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  className="min-h-60"
                  id="description"
                  placeholder="Enter description"
                  {...register("description", {
                    required: "Description is required",
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
                onClick={() => navigate("/privacy-policy")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {id ? "Update" : "Create"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
