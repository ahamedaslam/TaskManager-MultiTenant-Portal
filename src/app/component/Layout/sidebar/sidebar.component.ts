import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  collapsed = false;

  toggleSidebar(){
    this.collapsed = !this.collapsed;
  }

}