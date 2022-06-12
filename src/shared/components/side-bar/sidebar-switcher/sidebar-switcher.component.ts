import { Component, Input, OnInit } from '@angular/core'
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import { SideBarService } from '../side-bar.service'

@Component({
  selector: 'app-sidebar-switcher',
  templateUrl: './sidebar-switcher.component.html',
  styleUrls: ['./sidebar-switcher.component.sass'],
})
export class SidebarSwitcherComponent implements OnInit {
  @Input() isMouseEnterSidebar: boolean

  get isExpaned(): boolean {
    return this.sideBarService.isExpanded
  }

  get closeBtnIcon(): typeof faAnglesLeft {
    return faAnglesLeft;
  }

  constructor(private readonly sideBarService: SideBarService) {
    this.isMouseEnterSidebar = false
  }

  ngOnInit() {
    this.initStores()
  }

  onCloseSideBarBtnClick(): void {
    this.sideBarService.isExpanded = false
  }

  private initStores(): void {
    const { expandStatus$ } = this.sideBarService

    expandStatus$.subscribe((newStatus) => {})
  }
}
