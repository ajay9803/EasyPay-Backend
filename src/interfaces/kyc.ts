// kyc inteface - defines kyc model to be stored in the database
export interface IKyc {
  id: string;
  userId: string;
  citizenshipNumber: string;
  citizenshipIssueDate: string;
  citizenshipPhotoUrl: string;
  userPhotoUrl: string;
  status: string;
}

// kyc-form interface - defines request body to apply for kyc
export interface IReqKyc {
  userId: string;
  citizenshipNumber: string;
  citizenshipIssueDate: string;
  imageFiles: { [key: string]: Express.Multer.File[] };
  status: string;
}

// kyc-application interface - defines kyc application model
export interface IKycApplication {
  id: string;
  userId: string;
  citizenshipNumber: string;
  citizenshipIssueDate: string;
  citizenshipPhotoUrl: string;
  userPhotoUrl: string;
  createdAt: string;
  status: string;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}
