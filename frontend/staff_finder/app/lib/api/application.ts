import { withToken, publicAxios } from "./axios";
import { ENDPOINTS } from "./endpoints";
import { cookies } from "next/headers";

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value ?? "";
}

export interface Application {
  _id:         string;
  id:          string;
  userId:      any;
  vacancyId:   any;
  fullName:    string;
  email:       string;
  phoneNumber: string;
  coverLetter: string;
  cvUrl:       string;
  status:      "pending" | "accepted" | "rejected";
  createdAt:   string;
  updatedAt:   string;
}

export interface ApplyPayload {
  fullName:    string;
  email:       string;
  phoneNumber: string;
  coverLetter: string;
  cvUrl:       string;
}

// GET /applications — admin
export const getAllApplications = async (): Promise<Application[]> => {
  const token    = await getToken();
  const response = await withToken(token).get(ENDPOINTS.APPLICATIONS.GET_ALL);
  return response.data?.data ?? [];
};

// GET /applications/me — user
export const getMyApplications = async (): Promise<Application[]> => {
  const token    = await getToken();
  const response = await withToken(token).get(ENDPOINTS.APPLICATIONS.GET_MY);
  return response.data?.data ?? [];
};

// GET /applications/:id
export const getApplicationById = async (id: string): Promise<Application> => {
  const token    = await getToken();
  const response = await withToken(token).get(ENDPOINTS.APPLICATIONS.GET_BY_ID(id));
  return response.data?.data;
};

// POST /applications/:vacancyId — user applies
export const applyForVacancy = async (
  vacancyId: string,
  payload: ApplyPayload
): Promise<Application> => {
  const token    = await getToken();
  const response = await withToken(token).post(ENDPOINTS.APPLICATIONS.APPLY(vacancyId), payload);
  return response.data?.data;
};

// GET /applications/vacancy/:vacancyId — admin
export const getApplicationsByVacancy = async (vacancyId: string): Promise<Application[]> => {
  const token    = await getToken();
  const response = await withToken(token).get(ENDPOINTS.APPLICATIONS.GET_BY_VACANCY(vacancyId));
  return response.data?.data ?? [];
};

// PATCH /applications/:id/status — admin
export const updateApplicationStatus = async (
  id: string,
  status: "pending" | "accepted" | "rejected"
): Promise<Application> => {
  const token    = await getToken();
  const response = await withToken(token).patch(
    ENDPOINTS.APPLICATIONS.UPDATE_STATUS(id),
    { status }
  );
  return response.data?.data;
};

// DELETE /applications/:id — admin
export const deleteApplication = async (id: string): Promise<void> => {
  const token = await getToken();
  await withToken(token).delete(ENDPOINTS.APPLICATIONS.DELETE(id));
};