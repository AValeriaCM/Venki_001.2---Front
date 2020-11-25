import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { LoginService } from 'src/app/_services/login.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';

@Component({
  selector: 'app-info-inicio',
  templateUrl: './info-inicio.page.html',
  styleUrls: ['./info-inicio.page.scss'],
})
export class InfoInicioPage implements OnInit {

  @ViewChild('slider', {read: ElementRef}) slider: ElementRef;

  oculto = false;

  constructor(
    private navParams: NavParams,
    private modalCRTL: ModalController,
    private auth: AuthService,
    private log: LoginService,
    private pObjecto: PassObjectService,
    public alertController: AlertController,
    private router: Router,
    private renderer: Renderer2
    ) { }

  ngOnInit() {
    
  }

  verMas(){
    const parent: HTMLElement = document.getElementById('p1');
    this.renderer.setStyle(parent, 'display', 'none');

    const parent2: HTMLElement = document.getElementById('p2');
    this.renderer.setStyle(parent2, 'display', 'block');

    this.oculto = true;
  }

  vermenos(){
    const parent: HTMLElement = document.getElementById('p1');
    this.renderer.setStyle(parent, 'display', 'block');

    const parent2: HTMLElement = document.getElementById('p2');
    this.renderer.setStyle(parent2, 'display', 'none');

    this.oculto = false;
  }


  close(){
    this.modalCRTL.dismiss();
  }


}
