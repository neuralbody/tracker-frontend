import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ModalRequest, ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalHostComponent implements AfterViewInit, OnDestroy {
  @ViewChild('vc', { read: ViewContainerRef, static: true }) vcr!: ViewContainerRef;

  open = false;
  backdropClose = true;
  modalSizeClass = '';
  dialogCentered = false;

  private compRef?: ComponentRef<any>;
  private onCloseSubject?: Subject<any>;
  private subscription?: Subscription;

  constructor(private modalService: ModalService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    console.log('ModalHostComponent initialized');

    this.subscription = this.modalService.modalRequests$.subscribe(req => {
      console.log('Modal request received', req);
      if (req) {
        this.attach(req);
      } else {
        this.close();
      }
    });
  }

  private attach(request: ModalRequest) {
    console.log('Modal attach called', request);

    // détruit le précédent modal
    this.vcr.clear();
    this.compRef = this.vcr.createComponent(request.component, {
      injector: this.vcr.injector
    });

    console.log('componentRef created:', this.compRef);
    console.log('instance:', this.compRef.instance);

    // injecte les données si existantes
    if (request.data && this.compRef.instance) {
      Object.assign(this.compRef.instance, request.data);
    }

    // injecte modalRef pour permettre de fermer depuis le composant
    if (this.compRef.instance) {
      (this.compRef.instance as any).modalRef = { close: (v?: any) => this.close(v) };
    }
    
    // écoute les EventEmitter "created" ou "close" si existants
    this.trySubscribeOutput('created', request.onClose);
    this.trySubscribeOutput('close', request.onClose);

    this.onCloseSubject = request.onClose;
    
    // options d’affichage
    this.open = true;
    this.backdropClose = true;
    this.dialogCentered = true;
    this.modalSizeClass = '';

    this.cdr.detectChanges();
  }

  private trySubscribeOutput(name: string, onClose?: Subject<any>) {
    if (!this.compRef || !onClose) return;
    const inst = this.compRef.instance;
    const maybe = inst?.[name];

    if (maybe && typeof maybe.subscribe === 'function') {
      const sub = maybe.subscribe((v: any) => this.close(v));
      this.compRef.onDestroy(() => sub.unsubscribe());
    }
  }

  onBackdropClick() {
    if (this.backdropClose) this.close();
  }

  close(value?: any) {
    this.open = false;

    if (this.onCloseSubject) {
      this.onCloseSubject.next(value);
      this.onCloseSubject.complete();
      this.onCloseSubject = undefined;
    }

    if (this.compRef) {
      this.compRef.destroy();
      this.compRef = undefined;
    }

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.compRef?.destroy();
  }
}
