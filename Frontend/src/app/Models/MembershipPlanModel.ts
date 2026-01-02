import { Member } from "./MemberModel";

export interface MembershipPlanModel{
  MembershipPlanId: number;
  PlanName: string;
  DurationInMonths: number;
  Price: number;
  Description: string;

  Members?: Member[];
}