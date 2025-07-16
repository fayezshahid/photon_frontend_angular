import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlbumCardComponent } from '../albumcard/albumcard.component';
import { AlbumService, Album } from '../../services/album/album.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule, FormsModule, AlbumCardComponent],
  templateUrl: './album.component.html',
  styleUrl: './album.component.css',
})
export class AlbumComponent implements OnInit, OnDestroy {
  albums: Album[] = [];
  albumName: string = '';
  showBackButton: boolean = false;

  arrange: string = 'date';
  order: string = 'desc';

  private subscription: Subscription = new Subscription();

  constructor(private albumService: AlbumService) {}

  ngOnInit(): void {
    this.loadAlbums();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadAlbums(): void {
    this.subscription.add(
      this.albumService.getAlbums().subscribe(albums => {
        console.log('Albums loaded:', albums);
        this.albums = this.albumService.sortAlbums(albums, this.arrange, this.order);
      })
    );
  }

  createAlbum(): void {
    if (this.albumName.trim()) {
      // const newAlbum: Omit<Album, 'id'> = {
      //   name: this.albumName.trim(),
      //   createdAt: new Date().toISOString(),
      //   size: 0
      // };

      this.albumService.addAlbum(this.albumName.trim()).subscribe({
        next: () => {
          this.loadAlbums(); // Reload albums after creation
          this.albumName = ''; // Clear input field
        },
        error: (error) => {
          console.error('Error creating album:', error);
        }
      });
      // this.albumName = '';
      // this.loadAlbums();
    }
  }

  arrangeBy(arrange: string, order: string): void {
    this.arrange = arrange;
    this.order = order;
    this.albums = this.albumService.sortAlbums(this.albums, arrange, order);
  }

  onAlbumSelected(album: Album): void {
    // Handle album selection - navigate to album photos view
    // this.showBackButton = true;
    // You might want to emit an event or navigate to a different view here
  }

  goBack(): void {
    this.showBackButton = false;
    // Handle back navigation logic
  }
}