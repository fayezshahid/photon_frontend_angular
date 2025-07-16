import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PhotoCardComponent } from '../photocard/photocard.component';
import { PhotoService, Photo } from '../../services/photo/photo.service';
import { AlbumService, Album } from '../../services/album/album.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-albumimages',
  standalone: true,
  imports: [CommonModule, FormsModule, PhotoCardComponent],
  templateUrl: './albumimages.component.html',
  styleUrl: './albumimages.component.css'
})
export class AlbumImagesComponent {
  photoCards: Photo[] = [];
  arrange: string = 'date';
  order: string = 'desc';
  albumId!: number;
  
  private subscription: Subscription = new Subscription();

  constructor(private photoService: PhotoService, private albumService: AlbumService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get album ID from route parameter
    this.albumId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAlbumPhotos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadAlbumPhotos(): void {
    // Clear existing photos
    this.photoCards = [];
    
    // Load photos for the specific album
    const photoSub = this.albumService.getImagesInAlbum(this.albumId).subscribe({
      next: (photos: Photo[]) => {
        this.photoCards = photos;
        // Apply current sorting
        this.arrangeBy(this.arrange, this.order);
      },
      error: (error) => {
        console.error('Error loading album photos:', error);
        // Handle error - maybe show a message to user
      }
    });

    this.subscription.add(photoSub);
  }

  removeImagefromAlbum(photoId: number): void {
    this.albumService.removeImageFromAlbum(this.albumId, photoId).subscribe({
        next: (response) => {
          this.loadAlbumPhotos();
        },
        error: (error) => {
          console.error('Error: ', error);
        }
      });
  }

  arrangeBy(arrange: string, order: string): void {
    this.arrange = arrange;
    this.order = order;
    this.photoCards = this.photoService.sortPhotos(this.photoCards, arrange, order);
  }
}
