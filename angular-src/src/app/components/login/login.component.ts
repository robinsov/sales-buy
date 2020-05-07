import { Component, OnInit } from '@angular/core';
import { Vendedor } from '../models/vendedor.model';
import { LoginService } from 'src/app/services/login.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  recordarme: boolean;

  token: string;

  constructor(private _login: LoginService,
              private router: Router) { }

  ngOnInit(): void {
     if(this.recordarme){
        this.email = localStorage.getItem('email');
     }
  }

  login(form: NgForm){
    if(form.invalid){return;}

    let vendedor: Vendedor = {
      email: this.email,
      password: this.password
    }

    this._login.login(vendedor).subscribe((resp:any) => {
      console.log(resp);
      localStorage.setItem('token', resp.token);
      localStorage.setItem('vendedor', resp.vendedor.nombre);
      localStorage.setItem('id', resp.vendedor._id )
      localStorage.setItem('email', resp.vendedor.email);
      let img = resp.vendedor.img;
      this._login.img.emit(img);

      if(this.recordarme){
        this.email = localStorage.getItem('email');
      }
      
      this.router.navigate(['/perfil', resp.vendedor._id ]);
    }, err => {
      Swal.fire('Intente de nuevo o primero registrese', `${err.error.err.message}`, 'warning')
    })

  }


}
