import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen w-full" style="background:#EAF7EC;">
      <div class="app-shell">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class App {}
