import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TabLockService {
  private readonly tabId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`;
  private readonly isBrowser: boolean;
  private channel: BroadcastChannel | null = null;

  constructor(private router: Router) {
    const platformId = inject(PLATFORM_ID);
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('tab-control');
      this.listenForTabEvents();

      // Wait to allow others to register, then listen
      setTimeout(() => {
        this.channel?.postMessage({ type: 'HELLO', tabId: this.tabId });
      }, 300);
    }
  }

  private listenForTabEvents(): void {
    if (!this.channel) return;

    this.channel.onmessage = (e) => {
      const { type, tabId } = e.data;

      if (!tabId || tabId === this.tabId) return;

      if (type === 'HELLO') {
        // Someone new has opened a tab → this tab is already open
        this.channel?.postMessage({ type: 'TAB_ALREADY_ACTIVE', tabId: this.tabId });
      }

      if (type === 'TAB_ALREADY_ACTIVE') {
        // This tab just opened and hears another is already active
        this.router.navigate(['/tab-release-info']);
      }

      if (type === 'FORCE_RELEASE' && tabId !== this.tabId) {
        this.cleanExit();
      }
    };
  }

  public forceRelease(): void {
    this.channel?.postMessage({ type: 'FORCE_RELEASE', tabId: this.tabId });
    this.router.navigate(['/home']);
  }

   public closeThisTab(): void {
    this.cleanExit();
  }

  private cleanExit(): void {
    try {
      window.close();
      setTimeout(() => {
        if (!window.closed) {
          this.router.navigate(['/tab-blocked']);
        }
      }, 300);
      window.location.href = 'about:blank';
    } catch {
      this.router.navigate(['/tab-blocked']);
    }
  }

  getTabId(): string {
    return this.tabId;
  }
}
