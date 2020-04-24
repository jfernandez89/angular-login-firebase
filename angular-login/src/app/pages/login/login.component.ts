import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { UsuarioModel } from "../../models/usuario.model";
import { AuthService } from "src/app/services/auth.service";

import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  usuario: UsuarioModel = new UsuarioModel();
  recordarme: boolean = false;

  constructor(private _auth: AuthService, private _router: Router) {}

  ngOnInit() {
    if (localStorage.getItem("email")) {
      this.usuario.email = localStorage.getItem("email");
      this.recordarme = true;
    }
  }

  onSubmit(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }

    Swal.showLoading();

    this._auth.login(this.usuario).subscribe(
      (data) => {
        console.log(data);
        Swal.close();

        if (this.recordarme) {
          localStorage.setItem("email", this.usuario.email);
        }

        this._router.navigateByUrl("/home");
      },
      (err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.error.error.message,
        });
      }
    );
  }
}
