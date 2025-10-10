import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SsrDataService } from '../core/ssr-data.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private ssrData: SsrDataService, private router: Router) {}

  canActivate(): boolean {
    if (this.ssrData.isCore()) {
      return true;
    }

    // Optional: you can redirect to a 403 or login page
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
