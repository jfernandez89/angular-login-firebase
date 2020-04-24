import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UsuarioModel } from "../models/usuario.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = "https://identitytoolkit.googleapis.com/v1/accounts:";
  private apiKey = "AIzaSyByc9tCwxxNh_J73dt7BTFr1Y9KTrV_tP0";
  private userToken: string;

  constructor(private _http: HttpClient) {
    this.getToken();
  }

  login(usuario: UsuarioModel) {
    const authData = {
      // Hace la desectructuracion del objeto asignando cada propiedad a un valor (email: usuario.email, pass...)
      ...usuario,
      returnSecureToken: true,
    };

    console.log(`${this.url}signUp?key=${this.apiKey}`);

    return this._http
      .post(`${this.url}signInWithPassword?key=${this.apiKey}`, authData)
      .pipe(
        map((data) => {
          // Guardamos solamente la propiedad idToken recibida en la respuesta y la seteeamos en el LS
          this.setToken(data["idToken"]);
          // Devolvemos toda la informacion recibida
          return data;
        })
      );
  }

  logout() {
    localStorage.removeItem("token");
  }

  nuevoUsuario(usuario: UsuarioModel) {
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true,
    };

    console.log(`${this.url}signUp?key=${this.apiKey}`);

    return this._http
      .post(`${this.url}signUp?key=${this.apiKey}`, authData)
      .pipe(
        map((data) => {
          // Guardamos solamente la propiedad idToken recibida en la respuesta y la seteeamos en el LS
          this.setToken(data["idToken"]);
          // Devolvemos toda la informacion recibida
          return data;
        })
      );
  }

  private setToken(idToken: string) {
    let today = new Date();
    today.setSeconds(3600);
    localStorage.setItem("expires", today.getTime().toString());

    this.userToken = idToken;
    localStorage.setItem("token", idToken);
  }

  public getToken(): string {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    } else {
      this.userToken = "";
    }

    return this.userToken;
  }

  isLoggedIn(): boolean {
    // Valida si tenemos algun token activo (significa que tenemos conexion de algun usuario)
    if (this.userToken.length < 2) {
      return false;
    }

    const expires = Number(localStorage.getItem("expires"));
    const expiresDate = new Date();
    expiresDate.setTime(expires);

    if (expiresDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
