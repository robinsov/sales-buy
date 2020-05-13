import { Component, OnInit, NgZone } from "@angular/core";
import { Vendedor } from "../models/vendedor.model";
import { LoginService } from "src/app/services/login.service";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";


declare const gapi: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  recordarme: boolean = true;
  img: string = '';
  auth2: any;

  token: string;

  constructor(private _login: LoginService, private router: Router, private route: ActivatedRoute,
    private ngZone: NgZone,) {
    }

  ngOnInit(): void {
    this.googleInit();

    if(this._login.estaLogueado()){
      this.router.navigate(['/anuncios', 'nav']);
    }

    if (localStorage.getItem('img')) {
      this.img = localStorage.getItem('img')
      this._login.img.emit(this.img);
    }

    if (this.recordarme) {
      this.email = localStorage.getItem("email");
    }
  }

  googleInit() {
    gapi.load("auth2", () => {
      this.auth2 = gapi.auth2.init({
        client_id:
          "344747766238-806kfi2jd9gegle3jn4ks4gdcjehekq1.apps.googleusercontent.com",
        cookiepolicy: "single_host_origin",
        scope: "profile email",
      });
      this.attachSignin(document.getElementById("btnGoogle"));
    });
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      let profile = googleUser.getBasicProfile();

      let token = googleUser.getAuthResponse().id_token;

      console.log(token);
      this._login.registroGoogle(token).subscribe(
        (resp: any) => {
          
          localStorage.setItem("token", resp.token);
          localStorage.setItem("vendedor", resp.vendedorDB.nombre);
          localStorage.setItem("id", resp.vendedorDB._id);
          localStorage.setItem("email", resp.vendedorDB.email);
          
          if (resp.vendedorDB.img) {
            localStorage.setItem("img", resp.vendedorDB.img);
            this.img = resp.vendedorDB.img;
            this._login.img.emit(this.img);
          }
          
          
          this.ngZone.run(()=>{
            this.router.navigate(["/perfil", resp.vendedorDB._id],{relativeTo:this.route}).then();
          });
        }
        );
      });
    }
    
    login(form: NgForm) {
      if (form.invalid) {
        return;
      }
      
      let vendedor: Vendedor = {
        email: this.email,
        password: this.password,
      };
      
      this._login.login(vendedor).subscribe(
        async (resp: any) => {
          localStorage.setItem("token", resp.token);
          localStorage.setItem("vendedor", resp.vendedor.nombre);
          localStorage.setItem("id", resp.vendedor._id);
          localStorage.setItem("email", resp.vendedor.email);

        if (resp.vendedor.img) {
          localStorage.setItem("img", resp.vendedor.img);
          this.img = resp.vendedor.img;
          this._login.img.emit(this.img);
        }

        this.router.navigate(["/perfil", resp.vendedor._id]);
      },
      (err) => {
        Swal.fire(
          "Intente de nuevo o primero registrese",
          `${err.error.err.message}`,
          "warning"
        );
      }
    );
  }
}
