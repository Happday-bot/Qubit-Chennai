import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod'; // Import environment variables

@Component({
  selector: 'app-qubit-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class QuantumRegistrationComponent {
  currentStep = 0;

  personalForm: FormGroup;
  workForm: FormGroup;
  quantumForm: FormGroup;
  private url = environment.apiUrl; // Use environment variable for API URL

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.personalForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password:['',[Validators.required]],
      phone: ['', Validators.required],
      gender: ['', Validators.required]
    });

    this.workForm = this.fb.group({
      position: ['', Validators.required],
      institution: ['', Validators.required]
    });

    this.quantumForm = this.fb.group({
      hasKnowledge: ['', Validators.required],
      toolsKnown: ['', Validators.required],
      interests: ['', Validators.required],
      motivation: ['', Validators.required],
      advocate:['',[]]
    });
  }

  get isAllFormsValid(): boolean {
    return this.personalForm.valid && this.workForm.valid && this.quantumForm.valid;
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  goToWorkForm(): void {
    if (this.personalForm.valid) {
      this.currentStep = 1;
    } else {
      this.personalForm.markAllAsTouched();
    }
  }

  goToQuantumForm(): void {
    if (this.workForm.valid) {
      this.currentStep = 2;
    } else {
      this.workForm.markAllAsTouched();
    }
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  submitFinalForm(): void {
    if (this.isAllFormsValid) {
      const finalData = {
        ...this.personalForm.value,
        ...this.workForm.value,
        ...this.quantumForm.value
      };
      this.http.post(`${this.url}/quantum/register`, finalData).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('❌ Registration failed:', err);
      }
    });

    } else {
      this.personalForm.markAllAsTouched();
      this.workForm.markAllAsTouched();
      this.quantumForm.markAllAsTouched();
    }
  }
}

