import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { SsrDataService } from '../../core/ssr-data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod'; // Import environment variables

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, RouterLink],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isCoreUser = false;
  private loginSub?: Subscription;
  private coreSub?: Subscription;
  private url = environment.apiUrl; // Use environment variable for API URL

  constructor(
    private ssrData: SsrDataService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loginSub = this.ssrData.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      this.cdr.detectChanges(); // 💡 now safe
    });
    
    this.coreSub = this.ssrData.coreStatus$.subscribe((core) => {
      this.isCoreUser = core;
      this.cdr.detectChanges();
    });

    const token = this.ssrData.getToken();
    if (!token && this.ssrData.hasEverLoggedIn()) {
      this.http.post<{ access_token: string }>(`${this.url}/refresh`, {}, { withCredentials: true })
        .subscribe({
          next: (res) => {
            this.ssrData.setToken(res.access_token);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
    this.coreSub?.unsubscribe();
  }
}
