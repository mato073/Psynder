import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, ViewChild,
   ViewContainerRef, ReflectiveInjector, OnInit, Type, ChangeDetectorRef } from '@angular/core';
import { GeoLocationService } from '../../services/geo-location.service';
import { AddressInputModalComponent } from '../address-input-modal/address-input-modal.component';

@Component({
  selector: 'app-address-menu-slot',
  templateUrl: './address-menu-slot.component.html',
  styleUrls: ['./address-menu-slot.component.scss']
})
export class AddressMenuSlotComponent implements OnInit {

  @ViewChild('addressInputPlaceholder', {read: ViewContainerRef}) private _placeHolder;

  constructor(
    public gls: GeoLocationService,
    private cfr: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  inputNewAddress() {
    let modal = this.createComponent(this._placeHolder, AddressInputModalComponent);
    
    // set inputs..
    // cmp.instance.name = 'peter';
    
    // set outputs..
    modal.instance.closeModal.subscribe(event => {
      this._placeHolder.clear();
      this.cdr.detectChanges();
    });
    
    // all inputs/outputs set? add it to the DOM ..
    this._placeHolder.insert(modal.hostView);
  }

  // TODO: put this in service
  public createComponent<T>(vCref: ViewContainerRef, type: Type<T>): ComponentRef<T> {
    
    let factory = this.cfr.resolveComponentFactory(type);
    
    // vCref is needed cause of that injector..
    let injector = ReflectiveInjector.fromResolvedProviders([], vCref.parentInjector);
    
    // create component without adding it directly to the DOM
    let comp = factory.create(injector);
    
    return comp;
  }
}
