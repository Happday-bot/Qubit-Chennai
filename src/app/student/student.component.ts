import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SsrDataService } from '../core/ssr-data.service';
import { environment } from '../../environments/environment.prod'; // Import environment variables

@Component({
  selector: 'app-profile',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ProfileComponent implements OnInit {
  isEditing = false;
  successMsg = '';
  accessToken: string = '';
  private url = environment.apiUrl; // Use environment variable for API URL

  profile = {
    name: '',
    email: '',
    phone: '',
    institution: '',
    position: ''
  };


  constructor(private router: Router, private http: HttpClient, private ssrData:SsrDataService) {}

  ngOnInit(): void {

    
    const token = this.ssrData.getToken();
    if (!token) {
    this.http.post<{ access_token: string }>(`${this.url}/refresh`, {}, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.accessToken = res.access_token;
          this.ssrData.setToken(this.accessToken)
          this.loadProfile(); // proceed as usual
        },
        error: (err) => {
          this.router.navigate(['/login']);
        }
      });
    return;
    }

    this.accessToken = token;
    this.loadProfile();
  }

  loadProfile(retried: boolean = false) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    const userId = this.getUserIdFromJWT(this.accessToken);
    this.http.get<any>('http://localhost:8000/student/' + userId, { headers }).subscribe({
      next: (data) => {
        this.profile = {
          name: data.full_name,
          email: data.college_email,
          phone: data.phone,
          institution: data.institution,
          position: data.position
        };
      },
      error: (err) => {
        if (err.status === 403 && !retried) {
          this.refreshToken(() => this.loadProfile(true));
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.successMsg = '';
  }

  onSave(retried: boolean = false) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    const userId = this.getUserIdFromJWT(this.accessToken);
    

    this.http.put(`http://localhost:8000/student/${userId}`, {
      full_name: this.profile.name,
      college_email: this.profile.email,
      phone: this.profile.phone,
      institution: this.profile.institution,
      position: this.profile.position
    }, { headers }).subscribe({
      next: () => {
        this.successMsg = '✅ Profile saved successfully!';
        this.isEditing = false;
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        if (err.status === 403 && !retried) {
          this.refreshToken(() => this.onSave(true));
        } else {
          
        }
      }
    });
  }

  logout() {
  this.http.post('http://localhost:8000/logout', {}, { withCredentials: true }).subscribe({
    next: () => {
      this.ssrData.clearToken(); // ⛔ clear in-memory & localStorage
      this.router.navigate(['/login']);
    }
  });
}


  private getUserIdFromJWT(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const sub = payload?.sub;
      if (!sub || typeof sub !== 'string') throw new Error('Invalid sub');
      return sub;
    } catch (err) {
      this.router.navigate(['/login']);
      return '';
    }
  }

  private refreshToken(onSuccess: () => void) {
    this.http.post<{ access_token: string }>('http://localhost:8000/refresh', {}, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.accessToken = res.access_token;
          this.ssrData.setToken(this.accessToken)
          onSuccess();
        },
        error: (err) => {
          this.router.navigate(['/login']);
        }
      });
  }
}
