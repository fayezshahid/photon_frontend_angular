import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoCardComponent } from '../photocard/photocard.component';
import { PhotoService, Photo } from '../../services/photo/photo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, PhotoCardComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent {
  photoCards: Photo[] = [];
  searchBy: string = 'Search by';
  searchName: string = '';
  searchDateFrom: string = '';
  searchDateTo: string = '';
  showNameSearch: boolean = false;
  showDateSearch: boolean = false;

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
        this.photoCards = photos;
      })
    );
  }

  setSearchBy(searchType: string): void {
    this.searchBy = searchType;
    if (searchType === 'Name') {
      this.showNameSearch = true;
      this.showDateSearch = false;
    } else if (searchType === 'Date') {
      this.showNameSearch = false;
      this.showDateSearch = true;
    }
    // Reset search results when changing search type
    this.loadActivePhotos();
  }

  searchByName(): void {
    if (!this.searchName.trim()) {
      this.loadActivePhotos();
      return;
    }

    this.subscription.add(
      this.photoService.getActivePhotos().subscribe(photos => {
        this.photoCards = photos.filter(photo => 
          photo.name && photo.name.toLowerCase().includes(this.searchName.toLowerCase())
        );
      })
    );
  }

  searchByDate(): void {
    if (!this.searchDateFrom || !this.searchDateTo) {
      this.loadActivePhotos();
      return;
    }

    const fromDate = new Date(this.searchDateFrom);
    const toDate = new Date(this.searchDateTo);
    
    // Set time to include full day range
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    this.subscription.add(
      this.photoService.getActivePhotos().subscribe(photos => {
        this.photoCards = photos.filter(photo => {
          const photoDate = new Date(photo.updatedAt);
          return photoDate >= fromDate && photoDate <= toDate;
        });
      })
    );
  }

  onImageEdited(): void {
    // Refresh search results when an image is edited
    if (this.searchBy === 'Name' && this.searchName) {
      this.searchByName();
    } else if (this.searchBy === 'Date' && this.searchDateFrom && this.searchDateTo) {
      this.searchByDate();
    } else {
      this.loadActivePhotos();
    }
  }

  // Helper method to clear date selection
  clearDateRange(): void {
    this.searchDateFrom = '';
    this.searchDateTo = '';
    this.loadActivePhotos();
  }

  // Helper method to clear name search
  clearNameSearch(): void {
    this.searchName = '';
    this.loadActivePhotos();
  }
}