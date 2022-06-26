import { Component, OnInit } from '@angular/core'
import { faClock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar-notification-center',
  templateUrl: './sidebar-notification-center.component.html',
  styleUrls: ['./sidebar-notification-center.component.sass'],
})
export class SidebarNotificationCenterComponent implements OnInit {

  get notiIcon(): typeof faClock {
    return faClock
  }

  constructor() {}

  ngOnInit() {}
}
