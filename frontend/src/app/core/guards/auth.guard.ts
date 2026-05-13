import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom, filter, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const loading$ = toObservable(auth.loading);
  await firstValueFrom(loading$.pipe(filter((l) => !l), take(1)));
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/login']);
};
