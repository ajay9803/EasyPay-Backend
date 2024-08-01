import { Request as ExpressRequest } from "express";
import { User } from "./user";

// Request interface - extends user to allow manipulation of original request
export interface Request extends ExpressRequest {
  user?: Omit<User, "password" | "dob" | "gender">;
}
