import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom, filter, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

/** Prevent signed-in users from seeing login/signup pages again. */
export const noAuthGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const loading$ = toObservable(auth.loading);
  await firstValueFrom(loading$.pipe(filter((l) => !l), take(1)));
  if (!auth.isLoggedIn()) return true;
  return router.createUrlTree([auth.isAdmin() ? '/admin/dashboard' : '/home']);
};
