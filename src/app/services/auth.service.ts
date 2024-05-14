import { Injectable } from "@angular/core";
import { Auth, signInWithEmailAndPassword, signInWithPopup, UserCredential } from "@angular/fire/auth";

import { EmployeService } from "./employe.service";


@Injectable()
export class AuthService {
    constructor(
        private readonly auth: Auth,
    ) {}

    async signIn(email: string, password: string): Promise<string> {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        
        return await userCredential.user.getIdToken();
    }


}