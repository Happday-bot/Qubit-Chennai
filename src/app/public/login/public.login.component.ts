import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SsrDataService } from '../../core/ssr-data.service';
import { SessionService } from '../../core/session.service';
import {environment} from '../../../environments/environment.prod';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [SessionService],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class LoginComponent {
  loginData = {
    college_email: '',
    password: ''
  };

  errorMsg = '';
  showPassword = false;
  private url = environment.apiUrl; // Use environment variable for API URL
  private accessToken: string = ''; // 🔐 In-memory token

  constructor(private router: Router, private http: HttpClient, private ssrData: SsrDataService,private sessionService: SessionService) {}

  isLoginEnabled(): boolean {
    return this.loginData.college_email.includes('@') && this.loginData.password.trim() !== '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    

    this.http.post<{ access_token: string, service: string }>(`${this.url}/login`, this.loginData, {
      withCredentials: true  // 🔐 Send cookie (refresh token)
    }).subscribe({
      next: (response) => {
        const { access_token, service } = response;

        this.ssrData.setToken(access_token);

        this.accessToken = response.access_token; // 🔐 Store access token in memory
        const decoded: any = JSON.parse(atob(access_token.split('.')[1]));
        const userId = decoded.sub;
        this.sessionService.connect(userId);
        
        // Redirect based on service type
        if (service === 'member') {
          setTimeout(() => {
            this.router.navigate(['/student/profile'], { state: { token: this.accessToken } });
          }, 0);
        }else if (service === 'core') {
          this.router.navigate(['/admin/events'], { state: { token: this.accessToken } });
        } else {
          this.router.navigate(['/unauthorized']);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorMsg = error.status === 401
          ? 'Invalid college credentials. Please try again.'
          : 'Server error. Please try later.';
      }
    });
  }
}
