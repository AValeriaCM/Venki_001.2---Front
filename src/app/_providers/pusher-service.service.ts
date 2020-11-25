import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class PusherServiceService {

  channel;

  constructor(public http: HttpClient) {
  }

  channelsuscribe(id: any){
    console.log('entre');
    let pusher = new Pusher('873f1f375dc423a66f84', {
      cluster: 'us2',
      encrypted: true,
    });
    this.channel = pusher.subscribe('chat.' + id);
  }

  init(){
    return this.channel;
  }

}
