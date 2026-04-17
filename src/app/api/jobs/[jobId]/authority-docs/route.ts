import { NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const UploadAuthorityDocSchema = z.object({
  doc_type: z.enum([
    "power_of_attorney",
    "executor_letter",
    "trust_certificate",
    "court_order",
    "death_certificate",
    "other",
  ]),
  title: z.string().min(1, "Title is required").max(255),
  file_url: z.string().url("Valid file URL is required"),
  file_name: z.string().min(1).max(255),
  file_size_bytes: z.number().int().positive().optional(),
  notes: z.string().max(1000).optional(),
});

// ── POST /api/jobs/[jobId]/authority-docs — Upload authority doc (US-002)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const { jobId } = await params;
    const body = await request.json();
    const parsed = UploadAuthorityDocSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid document data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Verify job exists
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select()
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return apiError("NOT_FOUND", "Job not found", 404);
    }

    const id = uuidv4();
    const { data: doc, error } = await supabase
      .from("authority_documents")
      .insert({
        id,
        job_id: jobId,
        doc_type: parsed.data.doc_type,
        title: parsed.data.title,
        file_url: parsed.data.file_url,
        file_name: parsed.data.file_name,
        file_size_bytes: parsed.data.file_size_bytes || null,
        notes: parsed.data.notes || null,
        status: "pending_review",
        uploaded_by: userId,
      })
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to upload authority document", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "authority_documents",
      entity_id: doc.id,
      action: "authority_doc_uploaded",
      actor_user_id: userId,
      old_values: null,
      new_values: doc,
    });

    return apiSuccess(doc, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
