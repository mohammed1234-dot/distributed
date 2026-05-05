import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  registerForm: FormGroup;

  constructor(
    private dataService: DataService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      secondName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: SignupComponent.passwordsMatch
    });
  }

  static passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return (password && confirmPassword && password !== confirmPassword) 
      ? { passwordMismatch: true } 
      : null;
  }

  onSubmit() {
  if (this.registerForm.invalid) {
    if (this.registerForm.errors?.['passwordMismatch']) {
      alert('❌ Passwords do not match!');
    } else {
      alert('❌ Please fill all fields correctly');
    }
    return;
  }

  const formValue = this.registerForm.value;
  const newUser = {
    firstName: formValue.firstName,
    secondName: formValue.secondName,
    email: formValue.email,
    password: formValue.password
  };

  this.dataService.register(newUser).subscribe({
    next: (res: any) => {
      console.log('Register response:', res);

      if (res.success) {
        alert('✅ Registration successful! You are now logged in.');

        // Auto login - set current user
        this.dataService.setCurrentUser({
          username: newUser.firstName + ' ' + newUser.secondName,
          email: newUser.email,
          // You can add more user data if needed
        });

        // Redirect to Todo page
        this.router.navigate(['/app/todo']);
        
        this.registerForm.reset();
      } else {
        alert(res.message || 'Registration failed');
      }
    },
    error: (err) => {
      console.error('Error:', err);
      alert('Server error occurred');
    }
  });
}
}