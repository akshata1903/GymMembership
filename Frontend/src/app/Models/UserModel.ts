import { Member } from "./MemberModel";
import { TrainerModel } from "./TrainerModel";

export interface UserModel{
    userId: number;
  email: string;
  passwordHash: string;
  role: string;
  userName: string;

  member?: Member;
  trainer?: TrainerModel;
}