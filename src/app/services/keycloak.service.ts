import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class KeycloakOperationService {
  constructor(private readonly keycloak: KeycloakService) {}

  isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }
  logout(): void {
    this.keycloak.logout();
  }
  getUserProfile(): any {
    return this.keycloak.loadUserProfile();
  }

  async getToken(): Promise<string> {
    return await this.keycloak.getToken();

  }
  getUserRole(): any {
    return this.keycloak.getUserRoles();
  }
  isHasRole(role: string): boolean {
    return this.keycloak.isUserInRole(role);
  }
}
