"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateVacancyAction } from "@/app/lib/actions/vacancy-action";
import { Vacancy } from "@/app/lib/api/vacancy";
import { useState } from "react";

const UpdateVacancySchema = z.object({
  RestaurantName: z.string().min(1).optional(),
  location:       z.string().min(1).optional(),
  imageUrl:       z.string().url().or(z.literal("")).optional(),
  salary:         z.number().positive().optional(),  // ✅ remove coerce
  position:       z.string().min(1).optional(),
  jobType:        z.enum(["full-time", "part-time"]).optional(),
  description:    z.string().min(20).optional(),
});

type UpdateVacancyData = z.infer<typeof UpdateVacancySchema>;

interface Props {
  vacancy:    Vacancy;
  onSuccess?: () => void;
  onCancel?:  () => void;
}

export default function UpdateVacancyForm({ vacancy, onSuccess, onCancel }: Props) {
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateVacancyData>({
    resolver: zodResolver(UpdateVacancySchema),
    defaultValues: {
      RestaurantName: vacancy.RestaurantName,
      location:       vacancy.location,
      imageUrl:       vacancy.imageUrl ?? "",
      salary:         vacancy.salary,
      position:       vacancy.position,
      jobType:        vacancy.jobType,
      description:    vacancy.description,
    },
  });

  async function onSubmit(data: UpdateVacancyData) {
    setError("");
    const id  = vacancy._id ?? vacancy.id;
    const res = await updateVacancyAction(id, {
      ...data,
      imageUrl: data.imageUrl || undefined,
    });
    if (res.success) {
      onSuccess?.();
    } else {
      setError(res.message ?? "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Restaurant Name</label>
          <input {...register("RestaurantName")} className="w-full border rounded-md px-3 py-1.5 text-sm" />
          {errors.RestaurantName && <p className="text-xs text-red-500 mt-1">{errors.RestaurantName.message}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Location</label>
          <input {...register("location")} className="w-full border rounded-md px-3 py-1.5 text-sm" />
          {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Position</label>
          <input {...register("position")} className="w-full border rounded-md px-3 py-1.5 text-sm" />
          {errors.position && <p className="text-xs text-red-500 mt-1">{errors.position.message}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Job Type</label>
          <select {...register("jobType")} className="w-full border rounded-md px-3 py-1.5 text-sm">
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Salary (Rs.)</label>
          <input
            {...register("salary", { valueAsNumber: true })} // ✅
            type="number"
            className="w-full border rounded-md px-3 py-1.5 text-sm"
          />
          {errors.salary && <p className="text-xs text-red-500 mt-1">{errors.salary.message}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Image URL</label>
          <input {...register("imageUrl")} className="w-full border rounded-md px-3 py-1.5 text-sm" />
          {errors.imageUrl && <p className="text-xs text-red-500 mt-1">{errors.imageUrl.message}</p>}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1">Description</label>
        <textarea {...register("description")} rows={4} className="w-full border rounded-md px-3 py-1.5 text-sm resize-none" />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="border rounded-md px-4 py-1.5 text-sm hover:bg-muted transition-colors">
            Cancel
          </button>
        )}
        <button type="submit" disabled={isSubmitting} className="bg-foreground text-background rounded-md px-4 py-1.5 text-sm font-medium disabled:opacity-50 transition-opacity">
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}