export interface IKyc {
  id: string;
  userId: string;
  citizenshipNumber: string;
  citizenshipIssueDate: string;
  citizenshipPhotoUrl: string;
  userPhotoUrl: string;
}

export interface IReqKyc {
  userId: string;
  citizenshipNumber: string;
  citizenshipIssueDate: string;
  imageFiles: { [key: string]: Express.Multer.File[] };
}
