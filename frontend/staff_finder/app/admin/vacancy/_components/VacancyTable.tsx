"use client";

import { Vacancy } from "@/app/lib/api/vacancy";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface Props {
  vacancies: Vacancy[];
  onView?:   (v: Vacancy) => void;
  onEdit:    (v: Vacancy) => void;
  onDelete:  (id: string) => void;
}

export default function VacancyTable({ vacancies, onView, onEdit, onDelete }: Props) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            {["Job Title", "Restaurant", "Location", "Applications", "Status", "Actions"].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "12px 24px", color: "#374151", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vacancies.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "64px 24px", color: "#9ca3af" }}>
                No vacancies found.
              </td>
            </tr>
          ) : (
            vacancies.map((v) => {
              const id = (v._id ?? v.id) as string;
              return (
                <tr key={id} style={{ borderBottom: "1px solid #f3f4f6" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Job Title */}
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ fontWeight: 700, color: "#111827" }}>{v.position}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{v.jobType}</div>
                  </td>

                  {/* Restaurant */}
                  <td style={{ padding: "16px 24px", color: "#1f2937", fontWeight: 500 }}>{v.RestaurantName}</td>

                  {/* Location */}
                  <td style={{ padding: "16px 24px", color: "#1f2937" }}>{v.location}</td>

                  {/* Applications */}
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      minWidth: 32, height: 32, padding: "0 10px", borderRadius: 999,
                      background: "#dbeafe", color: "#1d4ed8", fontSize: 13, fontWeight: 700
                    }}>
                      {v.applications ?? 0}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "4px 12px", borderRadius: 999,
                      background: "#dcfce7", color: "#15803d",
                      border: "1px solid #86efac",
                      fontSize: 12, fontWeight: 700
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a", flexShrink: 0 }} />
                      Active
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <button onClick={() => onView?.(v)} title="View" style={iconBtn("#4b5563", "#f3f4f6")}>
                        <Eye size={16} />
                      </button>
                      <button onClick={() => onEdit(v)} title="Edit" style={iconBtn("#2563eb", "#eff6ff")}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => onDelete(id)} title="Delete" style={iconBtn("#dc2626", "#fef2f2")}>
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

function iconBtn(color: string, hoverBg: string): React.CSSProperties {
  return {
    width: 32, height: 32,
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 8, border: "none", cursor: "pointer",
    background: "transparent", color,
  };
}