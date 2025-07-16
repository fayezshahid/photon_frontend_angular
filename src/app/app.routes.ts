import { Routes } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery.component';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { ArchivedComponent } from './components/archived/archived.component';
import { TrashComponent } from './components/trash/trash.component';
import { ExploreComponent } from './components/explore/explore.component';
import { AlbumComponent } from './components/album/album.component';
import { AlbumImagesComponent } from './components/albumimages/albumimages.component';
import { SharingComponent } from './components/sharing/sharing.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';


export const routes: Routes = [
  { path: '', redirectTo: '/photos', pathMatch: 'full' },
  { path: 'photos', component: GalleryComponent, canActivate: [authGuard] },
  { path: 'explore', component: ExploreComponent, canActivate: [authGuard] },
  { path: 'sharing', component: SharingComponent, canActivate: [authGuard] },
  { path: 'archived', component: ArchivedComponent, canActivate: [authGuard] },
  { path: 'favourites', component: FavouritesComponent, canActivate: [authGuard] },
  { path: 'albums', component: AlbumComponent, canActivate: [authGuard] },
  { path: 'album/:id', component: AlbumImagesComponent, canActivate: [authGuard] },
  { path: 'trash', component: TrashComponent, canActivate: [authGuard] }, 
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] }, 
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] }, 
  { path: '**', redirectTo: '/photos' } // wildcard route for 404
];