import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  exports: [
    MatIconModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class MaterialModule {}