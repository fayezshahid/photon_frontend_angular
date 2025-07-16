import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Album, AlbumService } from '../../services/album/album.service';

@Component({
  selector: 'app-albumcard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './albumcard.component.html',
  styleUrl: './albumcard.component.css',
})
export class AlbumCardComponent {
  @Input() album!: Album;
  @Output() albumSelected = new EventEmitter<Album>();
  @Output() albumEdited = new EventEmitter<void>();

  editAlbumName: string = '';

  constructor(private albumService: AlbumService, private router: Router) {}

  onAlbumClick(): void {
    this.router.navigate(['/album', this.album.id]);
  }

  openEditModal(): void {
    this.editAlbumName = this.album.name; // Pre-populate with current name
  }

  updateAlbum(id: number): void {
   if (this.editAlbumName.trim()) {
      this.albumService.updateAlbum(id, this.editAlbumName.trim());
      this.albumEdited.emit(); // Notify parent component
    }
  }

  deleteAlbum(): void {
    this.albumService.deleteAlbum(this.album.id);
    this.albumEdited.emit();
  }

  formatSize(bytes: number): string {
    return this.albumService.formatFileSize(bytes || 0);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}