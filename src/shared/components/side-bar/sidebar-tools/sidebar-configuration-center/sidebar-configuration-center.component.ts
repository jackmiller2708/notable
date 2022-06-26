import { Component, OnInit } from '@angular/core'
import { faGear } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-sidebar-configuration-center',
  templateUrl: './sidebar-configuration-center.component.html',
  styleUrls: ['./sidebar-configuration-center.component.sass'],
})
export class SidebarConfigurationCenterComponent implements OnInit {
  get configIcon(): typeof faGear {
    return faGear
  }

  constructor() {}

  ngOnInit() {}
}
