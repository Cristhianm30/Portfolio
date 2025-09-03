import { AfterViewInit, Component, ElementRef, inject, OnDestroy } from '@angular/core';
import { Theme } from '../services/theme';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements AfterViewInit, OnDestroy {
  private scrollHandler: (() => void) | null = null;
  private centerLineElement: HTMLDivElement | null = null;
  private theme = inject(Theme);
  currentTheme$ = this.theme.theme$;
  isDark = false;

  ngOnInit() {
    this.currentTheme$.subscribe(theme => {
      this.isDark = this.theme.isDarkMode();
    });
  }

  changeTheme(theme: 'light' | 'dark' | 'auto') {
    this.theme.setTheme(theme);
  }

  ngOnDestroy() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    this.centerLineElement?.remove();
  }
  private readonly activeClasses = [
    'border-gray-800',
    'font-medium',
    'text-gray-800',
    'dark:border-neutral-200',
    'dark:text-neutral-200'
  ];

  private readonly inactiveClasses = [
    'border-transparent',
    'text-gray-500',
    'dark:text-neutral-400'
  ];

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.setupNavigation();
    this.setupIntersectionObserver();
  }

  private setupNavigation() {
    const navLinks = this.elementRef.nativeElement.querySelectorAll('.nav-link');
    
    navLinks.forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        if (sectionId) {
          this.scrollToSection(sectionId);
          this.updateActiveLink(link);
        }
      });
    });
  }

  private scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const header = document.querySelector('header');
    const headerHeight = header?.offsetHeight || 0;
    
    // Calcula la posición para centrar la sección en la pantalla
    const windowHeight = window.innerHeight;
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
    
    // Calcula la posición que centrará la sección en la ventana, considerando el header
    const targetPosition = sectionTop - (windowHeight - sectionHeight) / 2 - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  private setupIntersectionObserver() {
    const sections = ['experience', 'projects', 'education', 'skills']
      .map(id => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    // Crear un div que represente el centro de la pantalla
    const centerLine = document.createElement('div');
    centerLine.style.position = 'fixed';
    centerLine.style.top = '50%';
    centerLine.style.left = '0';
    centerLine.style.right = '0';
    centerLine.style.height = '1px';
    centerLine.style.pointerEvents = 'none';
    document.body.appendChild(centerLine);

    // Función para encontrar la sección más cercana al centro
    const findClosestSection = (): HTMLElement | null => {
      let closest: HTMLElement | null = null;
      let minDistance = Infinity;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closest = section;
        }
      });

      return closest;
    };

    // Manejar el scroll con throttle para mejor rendimiento
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const closestSection = findClosestSection();
          if (closestSection) {
            const correspondingLink = this.elementRef.nativeElement
              .querySelector(`[data-section="${closestSection.id}"]`);
            if (correspondingLink) {
              this.updateActiveLink(correspondingLink);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Agregar listener de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  private updateActiveLink(activeLink: HTMLElement) {
    const navLinks = this.elementRef.nativeElement.querySelectorAll('.nav-link');
    
    navLinks.forEach((link: HTMLElement) => {
      // Remove active classes
      this.activeClasses.forEach(className => link.classList.remove(className));
      // Add inactive classes
      this.inactiveClasses.forEach(className => link.classList.add(className));
    });

    // Remove inactive classes from active link
    this.inactiveClasses.forEach(className => activeLink.classList.remove(className));
    // Add active classes to active link
    this.activeClasses.forEach(className => activeLink.classList.add(className));
  }
}