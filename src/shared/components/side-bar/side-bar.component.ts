import { Component, HostListener, OnInit } from '@angular/core'
import { SideBarService } from './side-bar.service'

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.sass'],
})
export class SideBarComponent implements OnInit {
  currentWidth: number
  isMouseEnter: boolean

  get isExpanded(): boolean {
    return this.service.isExpanded
  }

  constructor(private readonly service: SideBarService) {
    this.currentWidth = 24
    this.isMouseEnter = false
  }

  ngOnInit() {
    this.initStores()
  }

  @HostListener('mouseenter')
  private onMouseOver(): void {
    this.service.sidebarMouseEnterChange.emit(true)
  }

  @HostListener('mouseleave')
  private onMouseOut(): void {
    this.service.sidebarMouseEnterChange.emit(false)
  }

  private initStores(): void {
    const { expandStatus$, sidebarMouseEnterChange } = this.service

    expandStatus$.subscribe((newStatus) => {
      this.currentWidth = newStatus ? 24 : 0
    })

    sidebarMouseEnterChange.subscribe((newStatus) => {
      this.isMouseEnter = newStatus
    })
  }
}
