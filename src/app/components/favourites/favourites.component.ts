import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoCardComponent } from '../photocard/photocard.component';
import { PhotoService, Photo } from '../../services/photo/photo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, FormsModule, PhotoCardComponent],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css',
})
export class FavouritesComponent implements OnInit, OnDestroy {
  photoCards: Photo[] = [];
  arrange: string = 'date';
  order: string = 'desc';
  
  private subscription: Subscription = new Subscription();

  constructor(private photoService: PhotoService) {}

  ngOnInit(): void {
    this.loadFavouritePhotos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadFavouritePhotos(): void {
    this.subscription.add(
      this.photoService.getFavouritePhotos().subscribe(photos => {
        this.photoCards = this.photoService.sortPhotos(photos, this.arrange, this.order);
      })
    );
  }

  arrangeBy(arrange: string, order: string): void {
    this.arrange = arrange;
    this.order = order;
    this.photoCards = this.photoService.sortPhotos(this.photoCards, arrange, order);
  }
}