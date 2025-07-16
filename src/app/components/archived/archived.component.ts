import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoCardComponent } from '../photocard/photocard.component';
import { PhotoService, Photo } from '../../services/photo/photo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-archived',
  standalone: true,
  imports: [CommonModule, FormsModule, PhotoCardComponent],
  templateUrl: './archived.component.html',
  styleUrl: './archived.component.css'
})
export class ArchivedComponent {
  photoCards: Photo[] = [];
  arrange: string = 'date';
  order: string = 'desc';
  
  private subscription: Subscription = new Subscription();

  constructor(private photoService: PhotoService) {}

  ngOnInit(): void {
    this.loadArchivedPhotos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadArchivedPhotos(): void {
    this.subscription.add(
      this.photoService.getArchivedPhotos().subscribe(photos => {
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
