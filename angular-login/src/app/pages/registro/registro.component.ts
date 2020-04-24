import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

import { UsuarioModel } from "../../models/usuario.model";
import { AuthService } from "src/app/services/auth.service";

import Swal from "sweetalert2";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent implements OnInit {
  usuario: UsuarioModel;
  recordarme: boolean = false;

  constructor(private _auth: AuthService, private _router: Router) {}

  ngOnInit() {
    this.usuario = new UsuarioModel();
  }

  // Pasamos el formulario como parametro desde la template html
  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      // Muestra una ventana emergente para notificar al usuario que espere
      Swal.showLoading();

      this._auth.nuevoUsuario(this.usuario).subscribe(
        (resposnse) => {
          console.log(resposnse);
          Swal.close();

          if (this.recordarme) {
            localStorage.setItem("email", this.usuario.email);
          }

          this._router.navigateByUrl("/home");
        },
        (errors) => {
          console.log(errors.error.error.message);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: errors.error.error.message,
          });
        }
      );
    }
  }
}
