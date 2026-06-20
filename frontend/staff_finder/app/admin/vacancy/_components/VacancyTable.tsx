"use client";

import { Vacancy } from "@/app/lib/api/vacancy";
import { Eye, Pencil, Trash2, ImageOff } from "lucide-react";

interface Props {
  vacancies: Vacancy[];
  onView?:   (v: Vacancy) => void;
  onEdit:    (v: Vacancy) => void;
  onDelete:  (id: string) => void;
}

const headers = ["Image", "Job Title", "Restaurant", "Location", "Applications", "Status", "Actions"];

export default function VacancyTable({ vacancies, onView, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-6 py-3 font-bold text-xs uppercase tracking-wider"
                style={{ color: "#374151" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vacancies.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center px-6 py-16" style={{ color: "#9ca3af" }}>
                No vacancies found.
              </td>
            </tr>
          ) : (
            vacancies.map((v) => {
              const id = (v._id ?? v.id) as string;
              return (
                <tr
                  key={id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* Image */}
                  <td className="px-6 py-4">
                    {v.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.imageUrl}
                        alt={v.RestaurantName}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#f3f4f6", color: "#9ca3af" }}
                      >
                        <ImageOff size={18} />
                      </div>
                    )}
                  </td>

                  {/* Job Title */}
                  <td className="px-6 py-4">
                    <div className="font-bold" style={{ color: "#111827" }}>{v.position}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{v.jobType}</div>
                  </td>

                  {/* Restaurant */}
                  <td className="px-6 py-4 font-medium" style={{ color: "#1f2937" }}>{v.RestaurantName}</td>

                  {/* Location */}
                  <td className="px-6 py-4" style={{ color: "#1f2937" }}>{v.location}</td>

                  {/* Applications */}
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center justify-center min-w-[32px] h-8 px-2.5 rounded-full text-[13px] font-bold"
                      style={{ backgroundColor: "#dbeafe", color: "#1d4ed8" }}
                    >
                      {v.applications ?? 0}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold"
                      style={{ backgroundColor: "#dcfce7", color: "#15803d", borderColor: "#86efac" }}
                    >
                      <span
                        className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                        style={{ backgroundColor: "#16a34a" }}
                      />
                      Active
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onView?.(v)}
                        title="View"
                        className="w-8 h-8 flex items-center justify-center rounded-lg border-none cursor-pointer bg-transparent hover:bg-gray-100 transition-colors"
                        style={{ color: "#4b5563" }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(v)}
                        title="Edit"
                        className="w-8 h-8 flex items-center justify-center rounded-lg border-none cursor-pointer bg-transparent hover:bg-blue-50 transition-colors"
                        style={{ color: "#2563eb" }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(id)}
                        title="Delete"
                        className="w-8 h-8 flex items-center justify-center rounded-lg border-none cursor-pointer bg-transparent hover:bg-red-50 transition-colors"
                        style={{ color: "#dc2626" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}