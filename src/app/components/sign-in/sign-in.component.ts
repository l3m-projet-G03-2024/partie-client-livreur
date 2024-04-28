import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [],
  providers: [
    AuthService,
    LocalStorageService
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {

  constructor(
    private readonly authService: AuthService,
    private readonly localStorageService: LocalStorageService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const localStorageAccessToken = this.localStorageService.getItem("accessToken");
    
    if (localStorageAccessToken) {
      this.router.navigate(['/']);
    } 
  }

  async signIn(email: string, password: string): Promise<void> {
    const accessToken = await this.authService.signIn(email, password);
    
    this.localStorageService.setItem("accessToken", accessToken);
    this.router.navigate(['/','home']);
  }
}
