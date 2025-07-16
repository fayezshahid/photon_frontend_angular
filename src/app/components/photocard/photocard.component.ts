import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PhotoService, Photo } from '../../services/photo/photo.service';
import { AlbumService, Album } from '../../services/album/album.service';
import { IMAGE_UPLOAD_URL } from '../../constants/endpoints';

interface Friend {
  id: number;
  email: string;
}

// interface Album {
//   id: number;
//   name: string;
// }

@Component({
  selector: 'app-photocard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './photocard.component.html',
  styleUrl: './photocard.component.css',
})

export class PhotoCardComponent {
  @Input() photo!: Photo;
  @Output() imageEditted = new EventEmitter<void>();
  @Output() permanentlyDeletePhoto = new EventEmitter<void>();
  @Output() removeImagefromAlbum = new EventEmitter<void>();

  baseImageUrl: string = IMAGE_UPLOAD_URL;
  imageUrl: string | ArrayBuffer | null = null;

  // Sample data for friends and albums
  friends: Friend[] = [
    { id: 1, email: 'friend1@example.com' },
    { id: 2, email: 'friend2@example.com' },
    { id: 3, email: 'friend3@example.com' }
  ];

  albums!: Album[];

  // Search and filter properties
  shareSearchValue: string = '';
  albumSearchValue: string = '';
  filteredShareFriends: Friend[] = [];
  filteredAlbums: Album[] = [];

  constructor(private photoService: PhotoService, private albumService: AlbumService, private router: Router) {}

  ngOnInit() {
    this.imageUrl = this.baseImageUrl + this.photo.image;
    // console.log('Photo URL:', this.imageUrl);
    this.filteredShareFriends = [...this.friends];
    this.albumService.getAlbums().subscribe({
      next: (data: Album[]) => {
        this.albums = data;
        this.filteredAlbums = [...this.albums];
      },
      error: (err) => {
        console.error('Failed to fetch albums', err);
      }
    });
  }

  isInAlbumRoute(): boolean {
    return this.router.url.includes('/album');
  }

  editImage() {
    // console.log(this.imageUrl);
    const form = document.getElementById('form' + this.photo.id) as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const image = formData.get('image') as File;

    this.photo.name = name;
    // console.log(image);
    if (image) {
      this.photo.image = image.name;
      this.photo.size = image.size;
    }

    this.imageEditted.emit();
  }

  showImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          this.imageUrl = e.target.result;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeImage() {
    this.imageUrl = null;
  }

  toggleDelete() {
    this.photoService.toggleDelete(this.photo.id).subscribe({
      next: (response) => {
        // this.photo.isDeleted = !this.photo.isDeleted;
        this.imageEditted.emit();
      },
      error: (error) => {
        console.error('Error toggling delete:', error);
      }
    });;
  }

  toggleArchive() {
    // this.photoService.toggleArchive(this.photo.id);
    // this.imageEditted.emit(); // <== Trigger reload
    this.photoService.toggleArchive(this.photo.id).subscribe({
      next: (response) => {
        // this.photo.isArchived = !this.photo.isArchived;
        // console.log('Archive toggled:', this.photo.isArchived);
        this.imageEditted.emit();
      },
      error: (error) => {
        console.error('Error toggling archive:', error);
      }
    });
  }

  toggleFavourites() {
    // this.photoService.toggleFavourite(this.photo.id);
    // this.imageEditted.emit(); // <== Trigger reload
    // const previousState = this.photo.isFavourite;
    this.photoService.toggleFavourite(this.photo.id).subscribe({
      next: (response) => {
        // console.log('API Response:', response);
        // this.photo.isFavourite = !previousState;
        // console.log('Favourite toggled:', this.photo.isFavourite, typeof this.photo.isFavourite);
        // setTimeout(() => {
        //   this.imageEditted.emit();
        // }, 1000);
        this.imageEditted.emit();
      },
      error: (error) => {
        console.error('Error toggling favourite:', error);
      }
    });
  }

  removeFromAlbum() {
    this.photoService.removePhotoFromAlbum(this.photo.id);
    this.imageEditted.emit(); // <== Trigger reload
  }

  addToAlbum() {
    // this.photoService.addToAlbum(this.photo.id);
    // this.imageEditted.emit(); // <== Trigger reload
  } 

  // Search functions
  searchFriends(event: any): void {
    const value = event.target.value.toLowerCase();
    this.filteredShareFriends = this.friends.filter(friend => 
      friend.email.toLowerCase().includes(value)
    );
  }

  searchAlbums(event: any): void {
    const value = event.target.value.toLowerCase();
    this.filteredAlbums = this.albums.filter(album => 
      album.name.toLowerCase().includes(value)
    );
  }

  // Share functionality
  shareWithFriend(friendId: number): void {
    const friend = this.friends.find(f => f.id === friendId);
    if (friend) {
      console.log(`Sharing photo "${this.photo.name}" with ${friend.email}`);
      // Add your share logic here
      // You might want to emit an event or call a service
      this.showMessage(`Photo shared with ${friend.email}`, 'success');
    }
  }

  // Album functionality
  toggleAlbum(albumId: number): void {
    console.log('Toggling album:', albumId);
    if(!this.photo.albumIds?.includes(albumId)) {
      this.albumService.addImageToAlbum(albumId, this.photo.id).subscribe({
        next: (response) => {
          this.imageEditted.emit(); // Trigger reload
        },
        error: (error) => {
          console.error('Error: ', error);
        }
      });
    }
    else {
      this.albumService.removeImageFromAlbum(albumId, this.photo.id).subscribe({
        next: (response) => {
          this.imageEditted.emit(); // Trigger reload
        },
        error: (error) => {
          console.error('Error: ', error);
        }
      });
    }
  }

  isInAlbum(): boolean {
    return this.photo.albumIds !== null;
  }

  // Helper method for showing message
  private showMessage(message: string, type: string): void {
    console.log(`${type.toUpperCase()}: ${message}`);
    // You can replace this with actual toast notification
  }

}
