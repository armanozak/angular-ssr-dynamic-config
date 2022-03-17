import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelloModule } from './hello/hello.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => HelloModule,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
