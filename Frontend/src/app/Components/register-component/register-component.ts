import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../Services/user-service';
import { TrainerService } from '../../Services/trainer-service';
import { MembershipPlanService } from '../../Services/membership-plan-service';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  showTrainerFields = false;
  showMemberFields = false;

  trainers: any[] = [];
  plans: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private trainerService: TrainerService,
    private planService: MembershipPlanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadDropdowns();

    this.registerForm.get('TrainerDetails')?.disable();
    this.registerForm.get('MemberDetails')?.disable();

    this.setupBMICalculation(); // ✅ AUTO BMI
  }

  // ---------------- FORM ----------------
  createForm() {
    this.registerForm = this.fb.group({
      UserName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      PasswordHash: ['', Validators.required],
      Role: ['', Validators.required],

      TrainerDetails: this.fb.group({
        Name: [''],
        Specialization: [''],
        Experience: [null],
        Phone: [''],
        ShiftTime: ['']
      }),

      MemberDetails: this.fb.group({
        Name: [''],
        Gender: [''],
        Age: [null],
        DateOfBirth: [null],
        ContactNumber: [''],
        Email: [''],
        Address: [''],
        Height: [null],
        Weight: [null],
        BMI: [{ value: null, disabled: true }], // ✅ auto
        MedicalConditions: [''],
        FitnessGoals: [''],
        JoinDate: [null],
        MembershipEndDate: [null],
        MembershipStatus: ['Active'],
        MembershipPlanId: [null],
        TrainerId: [null]
      })
    });
  }

  setupBMICalculation() {
    const memberGroup = this.registerForm.get('MemberDetails') as FormGroup;

    memberGroup.get('Height')?.valueChanges.subscribe(() => {
      this.calculateBMI();
    });

    memberGroup.get('Weight')?.valueChanges.subscribe(() => {
      this.calculateBMI();
    });
  }

  calculateBMI() {
    const memberGroup = this.registerForm.get('MemberDetails') as FormGroup;

    const heightFeet = memberGroup.get('Height')?.value;
    const weightKg = memberGroup.get('Weight')?.value;

    if (!heightFeet || !weightKg) {
      memberGroup.get('BMI')?.setValue(null);
      return;
    }

    const heightMeters = heightFeet * 0.3048;
    const bmi = weightKg / (heightMeters * heightMeters);

    memberGroup.get('BMI')?.setValue(+bmi.toFixed(2), { emitEvent: false });
  }

  // ---------------- ROLE CHANGE ----------------
  onRoleChange() {
    const role = this.registerForm.get('Role')?.value;

    this.showTrainerFields = false;
    this.showMemberFields = false;

    this.registerForm.get('TrainerDetails')?.disable();
    this.registerForm.get('MemberDetails')?.disable();

    if (role === 'Trainer') {
      this.showTrainerFields = true;
      this.registerForm.get('TrainerDetails')?.enable();
    }

    if (role === 'Member') {
      this.showMemberFields = true;
      this.registerForm.get('MemberDetails')?.enable();
    }
  }

  // ---------------- LOAD DROPDOWNS ----------------
  loadDropdowns() {
    this.trainerService.getAllTrainers().subscribe({
      next: res => this.trainers = res?.Data || [],
      error: err => console.error('Trainer load error', err)
    });

    this.planService.getAllMembershipPlans().subscribe({
      next: res => this.plans = res?.Data || [],
      error: err => console.error('Plan load error', err)
    });
  }

  // ---------------- SUBMIT ----------------
  register() {
    if (this.registerForm.invalid) return;

    const payload = this.registerForm.getRawValue();

    if (payload.Role === 'Trainer') payload.MemberDetails = null;
    if (payload.Role === 'Member') payload.TrainerDetails = null;

    this.userService.register(payload).subscribe({
      next: () => {
        alert('User registered successfully');
        this.router.navigate(['/login']);
      },
      error: () => alert('Registration failed')
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
