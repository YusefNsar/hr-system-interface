import axios, { AxiosError, AxiosResponse } from "axios";
import { EmployeeGroup } from "./auth.js";

export const userTokenKey = "token";

/* Axios Setup */
axios.defaults.baseURL = "/api/";
const axiosDefaultHeaders = axios.defaults.headers.common;
axiosDefaultHeaders["authorization"] = localStorage.getItem(userTokenKey);

export const updateAxiosAuthHeader = (newValue: string | undefined) => {
  axiosDefaultHeaders["authorization"] = newValue;
};

/* Auth Routes */
export const login = async (
  payload: LoginPayload,
): Promise<AxiosResponse | undefined> => {
  return axios.post("auth/signin", payload).catch(handleAxiosError);
};
export const signup = async (
  payload: SignupPayload,
): Promise<AxiosResponse | undefined> => {
  return axios.post("auth/signup", payload).catch(handleAxiosError);
};
export const getProfile = async (): Promise<AxiosResponse | undefined> => {
  if (!axiosDefaultHeaders["authorization"]) return;
  return axios.get("auth/profile").catch(handleAxiosError);
};

/* Employee Routes */
export const getEmployees = async (): Promise<AxiosResponse | undefined> => {
  if (!axiosDefaultHeaders["authorization"]) return;
  return axios.get("employees").catch(handleAxiosError);
};
export const addEmployee = async (
  payload: AddEmployeePayload,
): Promise<AxiosResponse | undefined> => {
  if (!axiosDefaultHeaders["authorization"]) return;
  return axios.post("employees", payload).catch(handleAxiosError);
};
export const editEmployee = async (
  payload: EditEmployeePayload,
): Promise<AxiosResponse | undefined> => {
  if (!axiosDefaultHeaders["authorization"]) return;
  return axios.patch("employees", payload).catch(handleAxiosError);
};

/* Attendance Routes */
export const getAttendances = async (): Promise<AxiosResponse | undefined> => {
  if (!axiosDefaultHeaders["authorization"]) return;
  return axios.get("attendance").catch(handleAxiosError);
};
export const addAttendance = async (
  payload: AddAttendancePayload,
): Promise<AxiosResponse | undefined> => {
  if (!axiosDefaultHeaders["authorization"]) return;
  return axios.post("attendance", payload).catch(handleAxiosError);
};
export const getAttendancesAnalytics = async (): Promise<
  AxiosResponse | undefined
> => {
  if (!axiosDefaultHeaders["authorization"]) return;
  return axios.get("attendance/analytics").catch(handleAxiosError);
};

// helper function to handle axios errors
const handleAxiosError = (err: AxiosError) => {
  if (err.isAxiosError) {
    return err.response;
  }
  throw err;
};

interface LoginPayload {
  email: string;
  password: string;
}
interface SignupPayload extends LoginPayload {
  name: string;
}

interface AddEmployeePayload {
  newEmployee: {
    name: string;
    email: string;
    group: EmployeeGroup;
  };
}
interface EditEmployeePayload {
  _id: string;
  name: string;
  group: EmployeeGroup;
}

interface AddAttendancePayload {
  fromEpochTime: number;
  toEpochTime: number;
  employee: string;
}

export type {
  AddAttendancePayload,
  AddEmployeePayload,
  EditEmployeePayload,
  LoginPayload,
  SignupPayload,
};
