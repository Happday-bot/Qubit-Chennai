import { Component } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navigation/public.navigation.component';
import { environment } from '../../../environments/environment.prod'; // Import environment variables

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  feedback = {
    name: '',
    email: '',
    message: '',
  };

  successMessage = '';
  errorMessage = '';
  private url = environment.apiUrl; // Use environment variable for API URL

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post<{ message: string }>(`${this.url}/feedback`, this.feedback)
      .subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.errorMessage = '';
          this.feedback = { name: '', email: '', message: '' }; // Reset form
        },
        error: () => {
          this.errorMessage = '❌ Failed to submit feedback. Please try again.';
          this.successMessage = '';
        }
      });
  }
}
