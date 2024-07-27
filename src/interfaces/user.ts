// user - interface
export interface User {
  id: string;
  username: string;
  email: string;
  dob: string;
  gender: string;
  password: string;
  permissions: string[];
}

export interface IUserById {
  id: string;
  username: string;
  email: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  password: string;
  balance: number;
  roleId: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string | null;
  permissions: string[];
}
