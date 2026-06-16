import { publicAxios, withToken } from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import { cookies } from "next/headers";

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ?? "";
}

export interface Vacancy {
  _id:           string;
  id:            string;
  RestaurantName: string;
  location:      string;
  imageUrl?:     string;
  salary:        number;
  position:      string;
  jobType:       "full-time" | "part-time";
  description:   string;
  applications:  number;
  createdAt:     string;
  updatedAt:     string;
}

export interface CreateVacancyPayload {
  RestaurantName: string;
  location:       string;
  imageUrl?:      string;
  salary:         number;
  position:       string;
  jobType:        "full-time" | "part-time";
  description:    string;
  applications?:  number;
}

export interface UpdateVacancyPayload {
  RestaurantName?: string;
  location?:       string;
  imageUrl?:       string;
  salary?:         number;
  position?:       string;
  jobType?:        "full-time" | "part-time";
  description?:    string;
}

export interface PaginatedVacancyResponse {
  Vacancy:    Vacancy[];
  pagination: {
    page:       number;
    size:       number;
    totalItems: number;
    totalPages: number;
  };
}

// GET /vacancy
export const getAllVacancies = async (
  page?: number,
  size?: number,
  search?: string
): Promise<PaginatedVacancyResponse> => {
  const params = new URLSearchParams();
  if (page)   params.append("page", String(page));
  if (size)   params.append("size", String(size));
  if (search) params.append("search", search);
  const response = await publicAxios.get(`${ENDPOINTS.VACANCY.GET_ALL}?${params}`);
  return response.data;
};

// GET /vacancy/:id
export const getVacancyById = async (id: string): Promise<Vacancy> => {
  const response = await publicAxios.get(ENDPOINTS.VACANCY.GET_BY_ID(id));
  return response.data;
};

// POST /vacancy
export const createVacancy = async (payload: CreateVacancyPayload): Promise<Vacancy> => {
  const token    = await getToken();
  const response = await withToken(token).post(ENDPOINTS.VACANCY.CREATE, payload);
  return response.data;
};

// PUT /vacancy/:id
export const updateVacancy = async (
  id: string,
  payload: UpdateVacancyPayload
): Promise<Vacancy> => {
  const token    = await getToken();
  const response = await withToken(token).put(ENDPOINTS.VACANCY.UPDATE(id), payload);
  return response.data;
};

// DELETE /vacancy/:id
export const deleteVacancy = async (id: string): Promise<any> => {
  const token    = await getToken();
  const response = await withToken(token).delete(ENDPOINTS.VACANCY.DELETE(id));
  return response.data;
};