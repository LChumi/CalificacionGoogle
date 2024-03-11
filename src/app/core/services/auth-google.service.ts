import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {

  constructor(private oautService: OAuthService) {
    this.initLogin();
  }

  initLogin() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: '940671183632-lmq0ppgcuh2bh2m07bsh9j9nr419lb3c.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/cumple/home',
      scope: 'openid profile email'
    }

    this.oautService.configure(config);
    this.oautService.setupAutomaticSilentRefresh();
    this.oautService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oautService.initLoginFlow();
  }

  logout() {
    this.oautService.logOut();
  }

  getProfile() {
    return this.oautService.getIdentityClaims();
  }
}
