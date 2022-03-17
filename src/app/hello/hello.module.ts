import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { HelloRoutingModule } from './hello-routing.module';
import { HelloComponent } from './hello.component';

@NgModule({
  declarations: [HelloComponent],
  imports: [
    HelloRoutingModule,
    FormsModule,
    TranslocoModule,
    MatInputModule
  ],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: 'hello' }
  ]
})
export class HelloModule {}
