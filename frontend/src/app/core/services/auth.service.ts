import { Injectable, computed, inject, signal } from '@angular/core';
import { Auth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  sendPasswordResetEmail, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc, updateDoc, serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AppUser } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly db = inject(Firestore);
  private readonly router = inject(Router);

  private readonly _user = signal<User | null>(null);
  private readonly _profile = signal<AppUser | null>(null);
  private readonly _loading = signal<boolean>(true);

  readonly user = this._user.asReadonly();
  readonly profile = this._profile.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._profile()?.role === 'admin');

  private confirmationResult: ConfirmationResult | null = null;

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this._user.set(user);
      if (user) this.loadProfile(user.uid);
      else { this._profile.set(null); this._loading.set(false); }
    });
  }

  private loadProfile(uid: string): void {
    const ref = doc(this.db, `users/${uid}`);
    docData(ref).subscribe({
      next: (data) => { this._profile.set((data as AppUser) ?? null); this._loading.set(false); },
      error: () => { this._loading.set(false); },
    });
  }

  profile$(): Observable<AppUser | null> {
    return new Observable<User | null>((sub) => {
      const unsub = onAuthStateChanged(this.auth, (u) => sub.next(u));
      return () => unsub();
    }).pipe(
      switchMap((u) => u ? docData(doc(this.db, `users/${u.uid}`)) as Observable<AppUser> : of(null))
    );
  }

  async signUp(fullName: string, email: string, password: string, phone = ''): Promise<void> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const userDoc: AppUser = {
      uid: cred.user.uid,
      fullName,
      email,
      phone,
      role: 'customer',
      isPhoneVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await setDoc(doc(this.db, `users/${cred.user.uid}`), {
      ...userDoc,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async signOutUser(): Promise<void> {
    await signOut(this.auth);
    await this.router.navigate(['/login']);
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  /** Phone OTP: send code. Pass an element id that holds the invisible reCAPTCHA. */
  async sendOtp(phoneE164: string, recaptchaContainerId: string): Promise<void> {
    const verifier = new RecaptchaVerifier(this.auth, recaptchaContainerId, { size: 'invisible' });
    this.confirmationResult = await signInWithPhoneNumber(this.auth, phoneE164, verifier);
  }

  /** Phone OTP: verify code. Creates user doc if first-time. */
  async verifyOtp(code: string, fullName = ''): Promise<void> {
    if (!this.confirmationResult) throw new Error('OTP not requested');
    const cred = await this.confirmationResult.confirm(code);
    const ref = doc(this.db, `users/${cred.user.uid}`);
    await setDoc(ref, {
      uid: cred.user.uid,
      fullName: fullName || cred.user.displayName || '',
      email: cred.user.email ?? '',
      phone: cred.user.phoneNumber ?? '',
      role: 'customer',
      isPhoneVerified: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  async updateProfile(uid: string, patch: Partial<AppUser>): Promise<void> {
    await updateDoc(doc(this.db, `users/${uid}`), { ...patch, updatedAt: serverTimestamp() });
  }
}
