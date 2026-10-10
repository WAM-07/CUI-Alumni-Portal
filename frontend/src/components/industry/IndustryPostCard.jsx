import React from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { MapPin, DollarSign, Calendar, Users, Edit, Trash2 } from "lucide-react";

export function IndustryPostCard({ job, onEdit, onDelete, onViewApplicants }) {
  const formattedDate = new Date(job.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="p-5 flex flex-col justify-between space-y-4 hover:border-[#CBD5E1] transition-all">
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] tracking-tight hover:text-[#1E3A8A]">
              {job.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#64748B]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                {job.location}
              </span>
              {job.salary_range && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#94A3B8]" />
                  {job.salary_range}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                {formattedDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={job.job_type === "Internship" ? "gold" : "primary"}>
              {job.job_type}
            </Badge>
            <Badge variant={job.status}>{job.status}</Badge>
          </div>
        </div>

        <p className="text-xs text-[#475569] leading-relaxed line-clamp-3">
          {job.description}
        </p>

        {job.requirements && job.requirements.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.requirements.slice(0, 4).map((req, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-[#F1F5F9] text-[#475569] rounded text-[11px] font-medium"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 4 && (
              <span className="text-[11px] text-[#94A3B8] self-center">
                +{job.requirements.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewApplicants(job)}
          className="flex items-center gap-1.5"
        >
          <Users className="w-3.5 h-3.5 text-[#1E3A8A]" />
          <span>Review Applicants</span>
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(job)}
            title="Edit Listing"
            className="p-1.5 text-[#475569] hover:text-[#0F172A]"
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(job.id)}
            title="Delete Listing"
            className="p-1.5 text-[#DC2626] hover:bg-[#FEF2F2]"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default IndustryPostCard;
