"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/database";

export async function createTriage(formData: FormData) {
  await prisma.triage.create({
    data: {
      age: Number(formData.get("age")),
      gender: String(formData.get("gender")),
      symptoms: String(formData.get("symptoms")).split(","),
      urgency: String(formData.get("urgency")),
      pathway: String(formData.get("pathway")),
      next: String(formData.get("next")),
      consultationType: String(formData.get("consultationType")),
    },
  });

  //   revalidatePath("/posts");
}
