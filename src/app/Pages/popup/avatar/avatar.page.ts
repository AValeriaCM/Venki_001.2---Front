import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';  
@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.page.html',
  styleUrls: ['./avatar.page.scss'],
})
export class AvatarPage implements OnInit {

  constructor(private popover:PopoverController) {} 
  ngOnInit() {
  }
  ClosePopover()
  {
    this.popover.dismiss();
  }
} 


