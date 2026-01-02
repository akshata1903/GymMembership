import { Member } from "./MemberModel";
import { MembershipPlanModel } from "./MembershipPlanModel";

export interface PaymentModel {
  paymentID: number;
  MemberId: number;
  PlanId: number;
  Amount: number;
  PaymentDate: Date;
  PaymentMethod: string;
  IsActive: boolean;
  TotalPaid?: number;
  RemainingAmount?: number;
  PaymentStatus?: 'Paid' | 'Pending';
  member?: Member;
  plan?: MembershipPlanModel;

  MembershipPlanId?: number;
}