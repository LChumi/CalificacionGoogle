import { Injectable } from '@angular/core';
import { AuthConfig, OAuthErrorEvent, OAuthEvent, OAuthService, OAuthSuccessEvent } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { UserInfo } from '../interfaces/user-info';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {

  userProfileSubject = new Subject<UserInfo>()

  constructor(private readonly oautService: OAuthService) {
    this.initLogin();

    this.oautService.events.subscribe((event: OAuthEvent) => {
      if (event instanceof OAuthErrorEvent && event.type === 'token_refresh_error') {
        // Manejar el error de renovación de token aquí
        console.error('Error al renovar el token de acceso:', event);
        // Por ejemplo, puedes redirigir al usuario a la página de inicio de sesión para que inicie sesión nuevamente.
      }
    });

    this.oautService.events.subscribe((event: OAuthEvent) => {
      if (event instanceof OAuthSuccessEvent && event.type === 'token_refreshed') {
        // Token de acceso renovado con éxito, realizar acciones adicionales si es necesario
        console.log('Token de acceso renovado con éxito');
        // Por ejemplo, puedes actualizar la información del usuario.
      }
    });


  }

  initLogin() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: '940671183632-lmq0ppgcuh2bh2m07bsh9j9nr419lb3c.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/cumple/home',
      scope: 'openid profile email',
      useSilentRefresh:true,
      silentRefreshTimeout: 2000,
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
    localStorage.clear()
    sessionStorage.clear()
  }

  getProfile() {
    return this.oautService.getIdentityClaims();
  }

  isLoggedIn(){
    return this.oautService.hasValidAccessToken()
  }

  getUserProfile(){
    this.oautService.loadUserProfile().then((userProfile) => {
      this.userProfileSubject.next(userProfile as UserInfo)
    })
  }

  extraerUsuario(){
    const data= this.oautService.getIdentityClaims();
    const UserInfo: UserInfo= {
      info:{
        sub: data['sub'],
        email: data['email'],
        name: data['name'],
        picture: data['picture']
      }
    }
    return UserInfo;
  }


}
