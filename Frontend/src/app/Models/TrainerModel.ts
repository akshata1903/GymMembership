import { Member } from "./MemberModel";
import { SessionModel } from "./SessionModel";
import { UserModel } from "./UserModel";

export interface TrainerModel{
  TrainerID: number;
  Name: string;
  Specialization: string;
  Experience: number;
  Phone: string;
  ShiftTime: string;
  UserId?: number | null;
  IsActive: boolean;

  User?: UserModel;
  Members?: Member[];
  Sessions?: SessionModel[];
}