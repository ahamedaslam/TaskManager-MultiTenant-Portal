import { Component } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  /**
   * Toggles a dark-mode class on the document body.
   * You can expand this to use a service or localStorage as needed.
   */
  toggleDark(): void {
    const body = document.body;
    if (body.classList.contains('dark-theme')) {
      body.classList.remove('dark-theme');
    } else {
      body.classList.add('dark-theme');
    }
  }
}
