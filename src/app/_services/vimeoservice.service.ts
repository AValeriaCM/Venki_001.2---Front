import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VimeoserviceService {

  constructor(private http: HttpClient) { }

  getVideos(user) {
    return this.http.get('https://vimeo.com/api/v2/' + user + '/videos.json');

    // https://api.vimeo.com/users/{user_id}/videos
}

getEmbedLink(url) {
  return this.http.get('https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/76979871');

}

getAlbums(user) {
    return this.http.get('https://vimeo.com/api/v2/' + user + '/albums.json');
}
}
