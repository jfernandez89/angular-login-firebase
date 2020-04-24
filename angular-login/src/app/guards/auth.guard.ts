import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  // Inyectamos el servicio para proteger el acceso a la ruta, si no estamos logeado
  constructor(private _auth: AuthService, private _router: Router) {}

  canActivate(): boolean {
    if (this._auth.isLoggedIn()) {
      return true;
    } else {
      this._router.navigateByUrl("/login");
      return false;
    }
  }
}
