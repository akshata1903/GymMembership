import { MembershipPlanModel } from "./MembershipPlanModel";
import { PaymentModel } from "./PaymentModel";
import { SessionModel } from "./SessionModel";
import { TrainerModel } from "./TrainerModel";
import { UserModel } from "./UserModel";

export interface Member{
  MemberID: number;
  Name: string;
  IsActive: boolean;
  Gender: string;
  Age: number;
  DateOfBirth?: Date | null;
  ContactNumber: string;
  Email: string;
  Address: string;
  JoinDate?: Date | null;
  MembershipEndDate?: Date | null;

  Height?: number | null;
  Weight?: number | null;
  BMI?: number | null;
  MedicalConditions?: string | null;
  FitnessGoals?: string | null;

  MembershipStatus?: string | null;
  MembershipPlanId: number;
  TrainerId?: number | null;
  UserId?: number | null;

  User?: UserModel;
  MembershipPlan?: MembershipPlanModel;
  Trainer?: TrainerModel;
//   attendanceRecords?: Attendance[];
  Payments?: PaymentModel[];
  Sessions?: SessionModel[];


    


}


//  "Name": "Rahul Verma",
//       "Gender": "Male",
//       "Age": 25,
//       "DateOfBirth": "2000-08-10T00:00:00",
//       "ContactNumber": "9877801212",
//       "Email": "rahulverma@gmail.com",
//       "Address": "Thane",
//       "Height": 5.7,
//       "Weight": 72,
//       "BMI": 24,
//       "MedicalConditions": "None",
//       "FitnessGoals": "Muscle gain",
//       "JoinDate": "2025-12-09T06:09:56.179",
//       "MembershipEndDate": "2026-06-09T06:09:56.179",
//       "MembershipStatus": "Active",
//       "MembershipPlanId": 1,
//       "TrainerId": 3,
//       "CreatedAt": "2025-12-09T09:52:16.954907",
//       "CreatedBy": "System",
//       "UpdatedAt": "2025-12-09T09:52:16.9549073",
//       "UpdatedBy": "Rahul Verma",
//       "IsActive": true
