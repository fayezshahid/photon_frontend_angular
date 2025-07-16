import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoCardComponent } from '../photocard/photocard.component';
import { PhotoService, Photo } from '../../services/photo/photo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, PhotoCardComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
})
export class GalleryComponent {
  photoCards: Photo[] = [];

  imageUrl: string | ArrayBuffer | null = null;

  arrange: string = 'date';
  order: string = 'desc';

  private subscription: Subscription = new Subscription();

  constructor(private photoService: PhotoService) {}

  ngOnInit(): void {
    this.loadActivePhotos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadActivePhotos(): void {
    this.subscription.add(
      this.photoService.getActivePhotos().subscribe(photos => {
        console.log('Active photos loaded:', photos);
        this.photoCards = this.photoService.sortPhotos(photos, this.arrange, this.order);
      })
    );
  }

  upload() {
    const form = document.getElementById('form') as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const image = formData.get('image') as File;

    if (!image) {
      alert('Please select an image to upload');
      return;
    }

    this.photoService
      .addPhoto({ name: name, image: image })
      .subscribe({
        next: () => {
          this.loadActivePhotos(); // reload photos after upload
          this.removeImage();
          form.reset();
        },
        error: (err) => {
          console.error('Upload failed', err);
        },
      });
  }

  arrangeBy(arrange: string, order: string) {
    this.arrange = arrange;
    this.order = order;
    this.photoCards = this.photoService.sortPhotos(this.photoCards, arrange, order);
  }

  showImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      // this.image = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          this.imageUrl = e.target.result;
          // event.target.value = '';
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
    // input.value = '';
  }

  removeImage() {
    // (document.getElementById('image') as HTMLInputElement).value = '';
    this.imageUrl = null;
  }
}
