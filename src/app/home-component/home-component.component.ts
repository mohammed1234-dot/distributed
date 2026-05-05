import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';   // ← Added RouterLink
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink   // ← Important for routerLink to work
  ],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.css'
})
export class HomeComponentComponent {
  showPassword = false;

  loginForm = new FormGroup({
    email: new FormControl('', { 
      validators: [Validators.required, Validators.email], 
      nonNullable: true 
    }),
    password: new FormControl('', { 
      validators: [Validators.required], 
      nonNullable: true 
    }),
    rememberMe: new FormControl(false, { nonNullable: true })
  });

  constructor(
    private router: Router,
    private data: DataService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

onSubmit() {
  if (this.loginForm.invalid) {
    alert('Please enter email and password');
    return;
  }

  const email = this.loginForm.value.email!;
  const password = this.loginForm.value.password!;

  this.data.login(email, password).subscribe({
    next: (res: any) => {
      console.log('Login API Response:', res);

      if (res.success) {
        const userData = res.user || { username: email, email: email };
        this.data.setCurrentUser(userData);
        
        alert('✅ Login successful!');
        this.router.navigate(['/app/todo']);
      } else {
        alert('❌ Wrong email or password');
      }
    },
    error: (err) => {
      console.error(err);
      alert('Server error');
    }
  });
}
}