import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { filter, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _auth!: Usuario ;

  get auth(): Usuario {
    return {...this._auth};
  }

  constructor(private http: HttpClient) { }

  verificaAutenticacion(): Observable<boolean> {

      if ( !localStorage.getItem('token')) {
        console.log('no hay un token');
        return of(false);
    }
      return this.http.get<Usuario>(`${this.baseUrl}/usuarios/1`)
      .pipe(
        map ( auth => {
          this._auth = auth;
          return auth.id ? true : false;
        })
      );
  }

  login(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/usuarios/1`).pipe(
      filter( auth => auth.id !== undefined),
      tap( auth => this._auth = auth ),
      tap( ({id}) => localStorage.setItem( 'token', id.toString() ))
    );
  }

}
