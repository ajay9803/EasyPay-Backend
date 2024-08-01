// User interface - defines user model
export interface User {
  id: string;
  username: string;
  email: string;
  dob: string;
  gender: string;
  password: string;
  permissions: string[];
  isVerified: boolean;
}

// User interface by id - defines user model received from database queried by ID
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
