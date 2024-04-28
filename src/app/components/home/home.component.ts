import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet, RouterModule,
    MatToolbarModule,
    MatButtonModule, MatMenuModule,
    MatIconModule
  ],
  providers: [
    LocalStorageService
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const localStorageAccessToken = this.localStorageService.getItem("accessToken");
    
    if (!localStorageAccessToken) {
      this.router.navigate(['/','sign-in']);
    } 
  }

  signOut() {
    this.localStorageService.clear();
    this.router.navigate(['/sign-in']);
  }

}
