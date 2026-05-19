import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { UsersService } from '../../core/services/users.service';
import { AppUser } from '../../core/models';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div data-testid="users-admin" class="space-y-5">
      <h1 class="text-[22px] font-extrabold">Users</h1>
      <div class="bg-white rounded-card shadow-soft overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-[13px]">
            <thead class="bg-[#FAFAFA] text-text-secondary text-[11px] uppercase tracking-wider">
              <tr><th class="px-4 py-3 text-left">Name</th><th class="px-4 py-3 text-left">Email</th><th class="px-4 py-3 text-left">Phone</th><th class="px-4 py-3 text-center">Role</th><th class="px-4 py-3 text-center">Status</th><th class="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              @for (u of users(); track u.uid) {
                <tr class="border-t border-border-soft/60">
                  <td class="px-4 py-3 font-semibold">{{ u.fullName || (u.email ? u.email.split('@')[0] : 'Unknown') }}</td>
                  <td class="px-4 py-3 text-text-secondary">{{ u.email }}</td>
                  <td class="px-4 py-3 text-text-secondary">{{ u.phone || '—' }}</td>
                  <td class="px-4 py-3 text-center">
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          [class.bg-primary-light]="u.role === 'admin'" [class.text-primary]="u.role === 'admin'"
                          [class.bg-[#F4F4F4]]="u.role !== 'admin'" [class.text-text-secondary]="u.role !== 'admin'">
                      {{ u.role }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          [class.bg-red-50]="u.isBlocked" [class.text-red-500]="u.isBlocked"
                          [class.bg-primary-light]="!u.isBlocked" [class.text-primary]="!u.isBlocked">
                      {{ u.isBlocked ? 'Blocked' : 'Active' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button (click)="toggle(u)" [attr.data-testid]="'toggle-' + u.uid"
                            class="text-[12px] font-semibold mr-2"
                            [class.text-red-500]="!u.isBlocked" [class.text-primary]="u.isBlocked">
                      {{ u.isBlocked ? 'Unblock' : 'Block' }}
                    </button>
                    <button (click)="promote(u)" class="text-[12px] font-semibold text-primary">
                      {{ u.role === 'admin' ? 'Demote' : 'Make Admin' }}
                    </button>
                  </td>
                </tr>
              } @empty { <tr><td colspan="6" class="px-4 py-10 text-center text-text-secondary">No users.</td></tr> }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class UsersAdminComponent {
  private readonly usersSvc = inject(UsersService);
  readonly users = toSignal(this.usersSvc.list(), { initialValue: [] as AppUser[] });
  async toggle(u: AppUser): Promise<void> { await this.usersSvc.setBlocked(u.uid, !u.isBlocked); }
  async promote(u: AppUser): Promise<void> { await this.usersSvc.setRole(u.uid, u.role === 'admin' ? 'customer' : 'admin'); }
}
