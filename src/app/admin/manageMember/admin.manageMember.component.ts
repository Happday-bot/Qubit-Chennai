import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminTopbarComponent } from '../admin_navigation/admin.admin_navigation.component';
import { SsrDataService } from '../../core/ssr-data.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod'; // Import environment variables

interface Member {
  id: number;
  name: string;
  email: string;
  contact: string;
  joinedOn:string;
  tools:string;
  intrests:string;
  institution:string;
}

interface MembershipApplication {
  id: number;
  name: string;
  email: string;
  has_knowledge:string;
  contact: string;
  tools:string;
  intrest:string;
  motivation:string;
  advocate:string;
  appliedOn: string;
  institution:string;
}

@Component({
  selector: 'app-member-management',
  standalone: true,
  imports: [CommonModule, FormsModule,AdminTopbarComponent],
  templateUrl: './manageMember.component.html',
  styleUrls: ['./manageMember.component.css']
})
export class MemberManagementComponent implements OnInit {
  private adminPassword = 'admin123';
  showPending: boolean = false;
  accessToken = '';
  private url = environment.apiUrl; // Use environment variable for API URL

  members: Member[] = [];
  applications: MembershipApplication[] = [];

  constructor(private http: HttpClient, private ssrData:SsrDataService, private router:Router) {}

  ngOnInit(): void {
    this.loadData();
    const token = this.ssrData.getToken();
    if (!token) {
    this.http.post<{ access_token: string }>(`${this.url}/refresh`, {}, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.accessToken = res.access_token;
          this.ssrData.setToken(this.accessToken)
        },
        error: (err) => {
          this.router.navigate(['/login']);
        }
      });
    return;
    }
  }

loadData(): void {
  this.http.get<Member[]>(`${this.url}/members`)
    .subscribe({
      next: data => {
        this.members = data;
      },
      error: err => console.error('❌ Error loading members:', err)
    });

  this.http.get<MembershipApplication[]>(`${this.url}/applications`)
    .subscribe({
      next: data => {
        this.applications = data;
      },
      error: err => console.error('❌ Error loading applications:', err)
    });
}

  private verifyPassword(): boolean {
    const entered = prompt('Enter admin password to proceed:');
    if (entered === this.adminPassword) return true;
    alert('❌ Incorrect password.');
    return false;
  }

  removeMember(id: number): void {
    if (!this.verifyPassword()) return;
    if (confirm('Are you sure to remove this member?')) {
      this.http.delete(`http://127.0.0.1:8000/members/${id}`).subscribe(() => {
        this.members = this.members.filter(m => m.id !== id);
        alert('✅ Member removed.');
      });
    }
  }

  approveApplication(id: number): void {
    if (!this.verifyPassword()) return;
    const app = this.applications.find(a => a.id === id);
    if (!app) return;

    const payload = {
      id: app.id,
      name: app.name,
      email: app.email,
      contact: app.contact,
      joinedOn: new Date().toISOString().split('T')[0],
      tools: app.tools,
      intrests: app.intrest,
      institution: app.institution
    };

    this.http.post('http://127.0.0.1:8000/approve', payload).subscribe(() => {
      this.members.push(payload);
      this.applications = this.applications.filter(a => a.id !== id);
      alert('✅ Application approved.');
    });
  }

  rejectApplication(id: number): void {
    if (!this.verifyPassword()) return;
    if (confirm('Reject this application?')) {
      this.http.delete(`http://127.0.0.1:8000/applications/${id}`).subscribe(() => {
        this.applications = this.applications.filter(a => a.id !== id);
        alert('🚫 Application rejected.');
      });
    }
  }
}

