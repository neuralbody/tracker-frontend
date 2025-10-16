import { Injectable, Type } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface ModalRequest {
  component: Type<any>;
  data?: any;
  onClose?: Subject<any>;
}

@Injectable({ providedIn: 'root' })
export class ModalService {

  private modalRequests = new BehaviorSubject<ModalRequest | null>(null);
  modalRequests$ = this.modalRequests.asObservable();

  /**
   * Ouvre un modal pour le composant passé.
   * @param component composant à afficher
   * @param data données à injecter
   * @returns Observable qui émet quand le modal se ferme
   */
  open(component: Type<any>, data?: any) {
    const onClose = new Subject<any>();
    this.modalRequests.next({ component, data, onClose });
    return onClose.asObservable();
  }

  /**
   * Ferme le modal (le host se chargera de notifier le composant)
   */
  close(result?: any) {
    this.modalRequests.next(null);
  }
}
