import { Component } from '@angular/core';
import { TabLockService } from '../core/tab-lock.service';

@Component({
  selector: 'app-tab-release-info',
  template: `
    <div class="release-info">
      <h2>Session already active in another tab</h2>
      <p>Do you want to take control of this session?</p>
      <button class="ok" (click)="takeControl()">Yes, use this tab</button>
      <button class="close" (click)="closed()">No, close this tab</button>
    </div>
  `,
  styleUrls: ["./tab-release.component.css"],
})
export class TabReleaseInfoComponent {
  constructor(private tabLockService: TabLockService) {}

  takeControl() {
    this.tabLockService.forceRelease();
  }
  closed(){
    this.tabLockService.closeThisTab();
  }
}
