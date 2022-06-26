import { Component, OnInit } from '@angular/core'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-sidebar-quick-search',
  templateUrl: './sidebar-quick-search.component.html',
  styleUrls: ['./sidebar-quick-search.component.sass'],
})
export class SidebarQuickSearchComponent implements OnInit {
  get searchIcon(): typeof faMagnifyingGlass {
    return faMagnifyingGlass
  }

  constructor() {}

  ngOnInit() {}
}
