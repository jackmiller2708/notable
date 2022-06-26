import { Component } from '@angular/core';
import { SideBarService } from '../side-bar/side-bar.service';

@Component({
  selector: 'app-notable-content',
  templateUrl: './notable-content.component.html',
  styleUrls: ['./notable-content.component.sass'],
})
export class NotableContentComponent {
  get isSidebarExpanded(): boolean {
    return this.sidebarService.isExpanded
  }

  constructor(private readonly sidebarService: SideBarService) {}
}
