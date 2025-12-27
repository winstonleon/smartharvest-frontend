import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from '../../services/login.service';
import { Router, RouterLink } from '@angular/router';
import { JwtRequest } from '../../models/jwtRequest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UsersService
  ) {}
  username: string = '';
  password: string = '';
  mensaje: string = '';
  ngOnInit(): void {
    if (this.loginService.verificar()) {
      const currentUsername = this.loginService.getCurrentUsername();
      if (currentUsername) {
        this.router.navigate(['home']);
      }
    }
  }
  login() {
    let request = new JwtRequest();
    request.username = this.username;
    request.password = this.password;
  
    this.loginService.login(request).subscribe(
      (data: any) => {
        this.loginService.loginSuccess(data.jwttoken); // Guarda el token y notifica
  
        const username = this.loginService.getCurrentUsername();
        if (username) {
          this.userService.getIdByUsername(username).subscribe(
            (id: number) => {
              sessionStorage.setItem('userId', id.toString());
              this.loginService.updateUserId(id); // nuevo método en LoginService
              console.log('UserId cargado correctamente:', id);
              this.router.navigate(['home']).then(() => {
                window.scrollTo(0, 0);
              });
            },
            (error) => {
              console.error('Error al obtener el ID desde username', error);
            }
          );
        }
      },
      (error) => {
        this.mensaje = 'Credenciales incorrectas!!!';
        this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
      }
    );
  }  
}
