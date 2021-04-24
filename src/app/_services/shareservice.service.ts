import { UsuariosF } from './../_model/_Usuario';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';


const INFO_TEMP = 'diagnostico';
const ORDERSTRG = 'ordercourses';
const CURSOCONTROL = 'controlinfoCursoTemp';
const CURSOCONTROLNAME = 'CursoName';

@Injectable({
  providedIn: 'root'
})
export class ShareserviceService {

  url2 = `api/user`;
  urlCuros = `api/courses`;
  basePath = `${environment.HOST}`;

  var = new Subject<string>();
  varorder = new Subject<string>();
  varExam = new Subject<string>();
  varPostUpdate  = new Subject<string>();
  varDesafio  = new Subject<string>();
  varObjetivos = new Subject<string>();
  varTotalPreguntas = new Subject<string>();
  varProfile = new Subject<any>();

  private cart = [];

  constructor(
    private http: HttpClient,
    private storage: Storage) { }


  gerDataService(TK: string){

    return this.http.get<any>(this.basePath + this.url2, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + TK)
  });
  }

  getCursos(token: any) {
    return this.http.get<any>(this.basePath + this.urlCuros, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
  });
  }

  getCategorias(token: any) {
    return this.http.get<any>(this.basePath + 'api/categories', {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
  });
  }

  getCursosUsuario(idUser: any, token: any) {
    return this.http.get<any>(this.basePath + `api/users/${idUser}/courses` , {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  getCursosCategorias(idCat: any, idUser: any, token: any) {
    return this.http.get<any>(this.basePath + `api/categories/${idCat}/courses?user_id=${idUser}` , {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  deleteCursoUsuario(idUser: any, idCurso: any){
    return this.http.delete(this.basePath + `api/users/${idUser}/courses/${idCurso}`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  getCursoEspecifico(id: number, token: any){
    return this.http.get<any>(this.basePath + this.urlCuros + `/${id}`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
  });
  }

  agregarCurso(idUser: any, curso: any, token: any) {
    const body = new HttpParams()
      .set('course_id', curso);
    return this.http.post(this.basePath  + `api/users/${idUser}/courses`, body, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  actualizarProgreso(idUser:number,idCurso:number, progreso:any, token: any){
    const body = new HttpParams()
      .set('progress', progreso);
    return this.http.put(this.basePath  + `api/users/${idUser}/courses/${idCurso}`, body, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }


  getCart() {
    return this.cart;
  }

  addProduct(product) {
    this.cart.push(product);
  }

  enviarComentarioIPutuacion(idCurso: any, idUser: any, comment: any, score: any, token: any){
      const body = new HttpParams()
      .set('course_id', idCurso)
      .set('user_id', idUser)
      .set('comment', comment)
      .set('score', score)
      .set('active', '0');
    return this.http.post(this.basePath  + `api/scores`, body, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  getComentariosCurso(idCurso: any, token:any) {
    return this.http.get<any>(this.basePath + `api/courses/${idCurso}/scores`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
  });
  }

  actualizarPhoto(idUser: any, fotoUrl: any) {
    const formData = new FormData()
    formData.append('avatar', fotoUrl);
    formData.append('_method', 'PUT');
    return this.http.post(this.basePath + `api/users/${idUser}`, formData, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  actualizarAvatar(idUser: any, imgUrl: UsuariosF, token:any) {
    const body = new HttpParams()
    .set('avatar',imgUrl.avatar );
    return this.http.put(this.basePath + `api/users/${idUser}`, body, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  getNetDiagnostico(idDiagnostico: any, idPage: any, token: any) {
    return this.http.get<any[]>(this.basePath + `api/surveys/${idDiagnostico}/questions?page=${idPage}&per_page=15`, {
      headers: new HttpHeaders()
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token)
    });
  }

  guardarDiagnostico(diagnostico: any){
    this.storage.set(INFO_TEMP, diagnostico);
  }

  retornarDiagnostico(){
    return this.storage.get(INFO_TEMP);
  }

  removerDiagnostico(){
    this.storage.remove(INFO_TEMP);
  }

  guardarDiagnosticoCurrenpage(page: any){
    this.storage.set('cpage', page);
  }

  retornarDiagnosticoCurrentpage() {
    return this.storage.get('cpage');
  }

  removerDiagnosticoCurrenpage(){
    this.storage.remove('cpage');
  }

  guardarDiagnosticoLastpage(page: any){
    this.storage.set('lpage', page);
  }

  retornarDiagnosticoLastpage(){
    return this.storage.get('lpage');
  }

  removerDiagnosticoLastpage(){
    this.storage.remove('lpage');
  }

  hayDiagnistico(){
    const diag = this.storage.get(INFO_TEMP);
    return diag.then(info => {
      return info;
    });
  }

  hayorder() {
    const token = this.storage.get(ORDERSTRG);
    return token.then( val => {
      return val;
    });
  }

  iniciorder(){
    this.storage.set(ORDERSTRG, 1);
  }

  guardarLeccionActiva(dataCurso: any){
    this.storage.set(CURSOCONTROL, dataCurso);
  }

  guardarCursoActiva(dataCurso: any){
    this.storage.set(CURSOCONTROLNAME, dataCurso);
  }

  getleccionActiva(){
    return this.storage.get(CURSOCONTROL);
  }

  getcursoActivo(){
    return this.storage.get(CURSOCONTROLNAME);
  }

  verorder(){
    const token = this.storage.get(ORDERSTRG);
    return token;
  }

  updateorder(order: any){
    let inc = 1;
    inc =  order + inc;
    this.storage.set(ORDERSTRG, inc);
    this.varorder.next('update order');
  }

  guardarpost(form: any, token: any) {
    return this.http.post(this.basePath + `api/posts`, form, {
      headers: new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
    });
  }

  actualizarpost(userid: any, countlike: any, token:any) {
    const body = new HttpParams()
        .set('count_like', countlike);
    return this.http.put(this.basePath + `api/posts` + `/${userid}`, body, {
      headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('X-Requested-With', 'XMLHttpRequest')
          .set('Authorization', 'Bearer ' + token)
    });
  }

  getrecomendation(idUser: any){
    return this.http.get<any>(this.basePath + `api/users/${idUser}/recomendations`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
  });
  }

  getTimeline(idUser: any, token: any) {
    return this.http.get<any>(this.basePath + `api/users/${idUser}/timelines`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  getpost(token: any) {
    return this.http.get<any>(this.basePath + `api/posts`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  getpostNextPage(page: any, token: any) {
    return this.http.get<any>(this.basePath + `api/posts?page=${page}`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  getActividadUsuario(idUser: any, token: any){
    return this.http.get<any>(this.basePath + `api/users/${idUser}/posts` , {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  getNextActividadUsuario(idUser: any, token: any, page: any) {
    return this.http.get<any>(this.basePath + `api/users/${idUser}/posts?page=${page}` , {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  editpremium(premNum: any, id: number) {

    const body = new HttpParams()
      .set('premium', premNum);

    return this.http.put(this.basePath + `api/users` + `/${id}`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }


  editSurveyed(surveyedNum: any, id: number, token: any) {

    const body = new HttpParams()
      .set('surveyed', surveyedNum);

    return this.http.put(this.basePath + `api/users` + `/${id}`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token)
    });
  }


  editvolverestadoBasico(surveyedNum: any, id: number) {

    const body = new HttpParams()
      .set('surveyed', surveyedNum)
      .set('premium', surveyedNum);

    return this.http.put(this.basePath + `api/users` + `/${id}`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }


  obtenerObhetivos(id: any, token: any) {
    return this.http.get(this.basePath + `api/users/${id}/achievements`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token)
    });
  }


  agregarObjetivos(form: any, token: any) {
    return this.http.post(this.basePath + `api/achievements`, form, {
      headers: new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
    });
  }

  actualizarObjetivos( objetivos:any, idUser:any) {
    const body = new HttpParams()
    .set('achievement', objetivos)
    .set('user_id', idUser);
    return this.http.put(this.basePath + `api/achievements`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  getaactividadesDiaria(token: any) {
    return this.http.get<any>(this.basePath + `api/dailyactivities?today=1` , {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  forgetPassword(email: any) {
    const body = new HttpParams()
      .set('email', email);
    return this.http.post(this.basePath  + `api/password/email`, body, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('X-Requested-With', 'XMLHttpRequest'),
    });
  }

  resetPassword(user: any, password: any, confirmPassword: any) {
    const body = new HttpParams()
      .set('user_id', user)
      .set('password', password)
      .set('confirmed_password', confirmPassword);
    return this.http.post(this.basePath  + `api/password/reset`, body, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('X-Requested-With', 'XMLHttpRequest'),
    });
  }

  savefeeling(idUser: any, feeling: any, token: any) {
    const body = new HttpParams()
      .set('user_id', idUser)
      .set('name', feeling);
    return this.http.post(this.basePath  + `api/feelings`, body, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  getFeeling(idUser: any, token: any) {
    return this.http.get<any>(this.basePath + `api/users/` + idUser + '/feelings', {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  getFeelingNextPage(idUser: any, page: any, token: any) {
    return this.http.get<any>(this.basePath + `api/users/${idUser}/feelings?page=${page}`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  savePostCompetence(form: any, token: any) {
    return this.http.post(this.basePath + `api/competences`, form, {
      headers: new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
    });
  }

  getPostCompetence(token: any, userId: any) {
    return this.http.get<any>(this.basePath + `api/users/` + userId + '/competences', {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  getPostCompetenceNextPage(page: any, token: any, userId: any) {
    return this.http.get<any>(this.basePath + `api/users/${userId}/competences?page=${page}`, {
      headers: new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }
}
