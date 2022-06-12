import { BehaviorSubject, Observable } from 'rxjs'
import { EventEmitter, Injectable } from '@angular/core'

@Injectable()
export class SideBarService {
  private readonly expandStatus: BehaviorSubject<boolean>

  readonly expandStatus$: Observable<boolean>
  readonly sidebarMouseEnterChange: EventEmitter<boolean>

  set isExpanded(newStatus: boolean) {
    this.expandStatus.next(newStatus)
  }

  get isExpanded(): boolean {
    return this.expandStatus.getValue()
  }

  constructor() {
    this.expandStatus = new BehaviorSubject<boolean>(true)
    this.expandStatus$ = this.expandStatus.asObservable()
    this.sidebarMouseEnterChange = new EventEmitter()
  }
}
