import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', Validators.required]
  });
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.form.invalid) return;
    const { username, password, confirm } = this.form.value;
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    this.loading = true;
    this.auth.register(username, password).subscribe({
      next: () => {
        this.loading = false;
        alert('Registered successfully — you can login now');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        alert('Registration failed: ' + (err?.error?.message || err.statusText || 'Unknown'));
      }
    });
  }
}
