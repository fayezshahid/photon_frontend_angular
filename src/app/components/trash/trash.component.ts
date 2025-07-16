import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoCardComponent } from '../photocard/photocard.component';
import { PhotoService, Photo } from '../../services/photo/photo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [CommonModule, FormsModule, PhotoCardComponent],
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.css'
})
export class TrashComponent {
  photoCards: Photo[] = [];
  arrange: string = 'date';
  order: string = 'desc';
  
  private subscription: Subscription = new Subscription();

  constructor(private photoService: PhotoService) {}

  ngOnInit(): void {
    this.loadDeletedPhotos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadDeletedPhotos(): void {
    this.subscription.add(
      this.photoService.getDeletedPhotos().subscribe(photos => {
        this.photoCards = this.photoService.sortPhotos(photos, this.arrange, this.order);
      })
    );
  }

  arrangeBy(arrange: string, order: string): void {
    this.arrange = arrange;
    this.order = order;
    this.photoCards = this.photoService.sortPhotos(this.photoCards, arrange, order);
  }

  permanentlyDeletePhoto(photoId: number): void {
    this.photoService.permanentlyDeletePhoto(photoId).subscribe({
      next: (response) => {
        // this.photo.isDeleted = !this.photo.isDeleted;
        // this.imageEditted.emit();
        this.loadDeletedPhotos();
      },
      error: (error) => {
        console.error('Error toggling delete:', error);
      }
    });;
  }

  emptyTrash(): void {
    // This method is called when the modal button is clicked
    // The actual deletion happens in confirmEmptyTrash()
  }

  confirmEmptyTrash(): void {
    this.photoCards.forEach(photo => {
      this.photoService.permanentlyDeletePhoto(photo.id);
    });
  }
}
