import { Component, inject, PLATFORM_ID} from '@angular/core';
import { TabLockService } from './core/tab-lock.service';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet,RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'qubit';
  constructor() {
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
      inject(TabLockService); // ✅ Only initialize in browser
    }
  }
}
