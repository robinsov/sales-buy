import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Vendedor } from '../models/vendedor.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  nombre: string;
  email: string
  password: string;
  constructor(private _loginService: LoginService,
              private router: Router) { }

  ngOnInit(): void {
  }

  registrar(form : NgForm){
    if(form.invalid){ return ;}

    let vendedor: Vendedor = {
      nombre: this.nombre,
      email: this.email,
      password: this.password
    }

    this._loginService.registrar(vendedor).subscribe((resp:any) => {
      Swal.fire(`${resp.vendedorBD.nombre}`, 'Registrado con exito', "success");
      console.log(resp.vendedorBD);
      this.router.navigate(['/login']);
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${err.error.err.errors.email.message}`,
      })
    })
  }
}
