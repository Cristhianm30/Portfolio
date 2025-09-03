import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  private html = document.documentElement;
  private themeSubject = new BehaviorSubject<string>(this.getStoredTheme());
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.initTheme();
    this.watchSystemTheme();
  }

  private getStoredTheme(): string {
    return localStorage.getItem('hs_theme') || 'auto';
  }

  private watchSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.getStoredTheme() === 'auto') {
        this.updateTheme('auto');
      }
    });
  }

  private initTheme(): void {
    this.updateTheme(this.getStoredTheme());
  }

  private updateTheme(theme: string): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = theme === 'dark' || (theme === 'auto' && prefersDark);

    this.html.classList.toggle('dark', shouldBeDark);
    this.themeSubject.next(theme);
  }

  setTheme(theme: 'light' | 'dark' | 'auto'): void {
    localStorage.setItem('hs_theme', theme);
    this.updateTheme(theme);
  }

  getCurrentTheme(): string {
    return this.getStoredTheme();
  }

  isDarkMode(): boolean {
    return this.html.classList.contains('dark');
  }
}
