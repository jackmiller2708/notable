import { SidebarSwitcherComponent } from './components/side-bar/sidebar-switcher/sidebar-switcher.component'
import { SidebarPrivateComponent } from './components/side-bar/sidebar-private/sidebar-private.component'
import { NotableContentComponent } from './components/notable-content/notable-content.component'
import { ContentHeaderComponent } from './components/notable-content/content-header/content-header.component'
import { SidebarToolsComponent } from './components/side-bar/sidebar-tools/sidebar-tools.component'
import { PrivateToolsComponent } from './components/side-bar/sidebar-private/private-tools/private-tools.component'
import { PrivateListComponent } from './components/side-bar/sidebar-private/private-list/private-list.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { SideBarComponent } from './components/side-bar/side-bar.component'
import { SideBarService } from './components/side-bar/side-bar.service'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

@NgModule({
  imports: [CommonModule, FontAwesomeModule],
  declarations: [
    SideBarComponent,
    SidebarSwitcherComponent,
    SidebarPrivateComponent,
    SidebarToolsComponent,
    PrivateListComponent,
    PrivateToolsComponent,
    NotableContentComponent,
    ContentHeaderComponent,
  ],
  exports: [SideBarComponent, NotableContentComponent],
  providers: [SideBarService],
})
export class SharedModule {}
