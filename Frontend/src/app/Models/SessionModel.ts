import { Member } from "./MemberModel";
import { TrainerModel } from "./TrainerModel";

export interface SessionModel{
     sessionId: number;
  sessionType?: string | null;
  sessionDate: Date;
  startTime: string;   
  endTime: string;     
  status?: string | null;
  trainerId: number;
  memberId?: number | null;

  trainer?: TrainerModel;
  member?: Member;
//   attendances?: Attendance[];
}