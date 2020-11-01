import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MidiServiceService } from './midi-service.service';
import { SheetService } from './sheet.service';
import { LearnComponent } from './learn/learn.component';
import { NoteLearnService } from './note-learn.service';
import "@angular/compiler";
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LearnComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [MidiServiceService, SheetService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
