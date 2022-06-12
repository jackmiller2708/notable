import { Component, OnInit } from '@angular/core'
import { SideBarService } from '../../side-bar/side-bar.service'
import { faAnglesRight, faBars } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.sass'],
})
export class ContentHeaderComponent implements OnInit {
  openBtnIcon: typeof faAnglesRight

  get isSideBarExpanded(): boolean {
    return this.sideBarService.isExpanded
  }

  constructor(private readonly sideBarService: SideBarService) {
    this.openBtnIcon = faAnglesRight
  }

  ngOnInit() {
    this.initStores()
  }

  onOpenSideBarBtnMouseEnter(): void {
    this.sideBarService.sidebarMouseEnterChange.emit(true)
  }

  onOpenSideBarBtnMouseLeave(): void {
    this.sideBarService.sidebarMouseEnterChange.emit(false)
  }

  onOpenSideBarBtnClick(): void {
    this.sideBarService.isExpanded = true
  }

  private initStores(): void {
    const { sidebarMouseEnterChange } = this.sideBarService

    sidebarMouseEnterChange.subscribe((newStatus) => {
      this.openBtnIcon = newStatus ? faAnglesRight : faBars
    })
  }
}
