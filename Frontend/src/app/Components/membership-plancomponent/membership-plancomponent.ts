import { Component, OnInit, signal } from '@angular/core';
import { MembershipPlanModel } from '../../Models/MembershipPlanModel';
import { MembershipPlanService } from '../../Services/membership-plan-service';
import { UserService } from '../../Services/user-service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-membership-plancomponent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './membership-plancomponent.html',
  styleUrl: './membership-plancomponent.css',
})
export class MembershipPlancomponent implements OnInit {

  plans = signal<MembershipPlanModel[]>([]);
  showAddForm = signal(false);
  editingPlan = signal<MembershipPlanModel | null>(null);

  newPlan: MembershipPlanModel = {} as MembershipPlanModel;
  role: string | null = null;

  searchText: string = '';

  constructor(
    private planService: MembershipPlanService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.role = this.userService.getRole();
    this.loadPlans();
  }

  loadPlans(): void {
    this.planService.getAllMembershipPlans().subscribe({
      next: res => this.plans.set(res?.Data || []),
      error: err => console.error('LOAD PLAN ERROR', err)
    });
  }

  // ✅ SINGLE SEARCH FIELD FILTER
  applyFilter(): void {
    const value = this.searchText.trim();

    if (!value) {
      this.loadPlans();
      return;
    }

    const numericValue = Number(value);

    const filter = {
      MembershipPlanID: null,
      PlanName: isNaN(numericValue) ? value : null,
      DurationInMonths: !isNaN(numericValue) ? numericValue : null,
      Price: !isNaN(numericValue) ? numericValue : null
    };

    this.planService.filterPlans(filter).subscribe({
      next: res => this.plans.set(res?.Data || []),
      error: err => console.error('FILTER PLAN ERROR', err)
    });
  }

  clearFilter(): void {
    this.searchText = '';
    this.loadPlans();
  }

  toggleAddForm(): void {
    this.showAddForm.update(v => !v);
    this.newPlan = {} as MembershipPlanModel;
    this.editingPlan.set(null);
  }

  closeForm(): void {
    this.showAddForm.set(false);
    this.editingPlan.set(null);
  }

  addPlan(form: NgForm): void {
    if (!form.valid) return;

    this.planService.addOrUpdatePlan(0, this.newPlan).subscribe({
      next: () => {
        alert('Plan added successfully');
        this.loadPlans();
        this.closeForm();
      }
    });
  }

  editPlan(plan: MembershipPlanModel): void {
    this.editingPlan.set({ ...plan });
  }

  updatePlan(form: NgForm): void {
    const plan = this.editingPlan();
    if (!form.valid || !plan) return;

    this.planService.addOrUpdatePlan(plan.MembershipPlanId!, plan).subscribe({
      next: () => {
        alert('Plan updated successfully');
        this.loadPlans();
        this.closeForm();
      }
    });
  }

  deletePlan(id: number): void {
    if (this.role !== 'Admin') {
      alert('Only Admin can delete plans');
      return;
    }

    if (!confirm('Are you sure?')) return;

    this.planService.deletePlan(id).subscribe({
      next: () => this.loadPlans()
    });
  }
}
