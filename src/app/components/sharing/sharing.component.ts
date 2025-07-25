import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { ShareService } from '../../services/share/share.service'; 
import { PairsService, User } from '../../services/pair/pair.service';
import { IMAGE_UPLOAD_URL } from '../../constants/endpoints';
import { map } from 'rxjs/operators';

interface SharedImage {
  imageId: number;
  image: string;
  name?: string;
  ownerId: number;
  ownerEmail?: string;
  date: Date;
  size: number;
}

@Component({
  selector: 'app-shared-images',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sharing.component.html',
  styleUrls: ['./sharing.component.css']
})
export class SharingComponent implements OnInit, OnDestroy {
  baseImageUrl: string = IMAGE_UPLOAD_URL;

  users: User[] = [];
  friends: User[] = [];
  requests: User[] = [];
  sharedImages: SharedImage[] = [];

  requestsSent: number[] = [];

  filteredUsers: User[] = [];
  filteredFriends: User[] = [];
  filteredRequests: User[] = [];
  searchValue: string = '';

  activeTab: string = 'users';
  arrange: string = 'Date';
  order: string = 'desc';
  arrangeByIconHtml: string = '';

  private subscription = new Subscription();

  constructor(
    private pairsService: PairsService,
    private shareService: ShareService
  ) {}

  ngOnInit(): void {
    this.load();
    this.arrangeBy('Date', 'desc');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  load(): void {
    const sub = forkJoin({
      users: this.pairsService.getUsers(),
      friends: this.pairsService.getFriends(),
      requests: this.pairsService.getRequests(),
      sent: this.pairsService.getRequestsSent(),
      images: this.fetchSharedImages()
    }).subscribe(({ users, friends, requests, sent, images }) => {
      console.log(images);
      this.users = users;
      this.friends = friends;
      this.requests = requests;
      this.requestsSent = sent;
      this.sharedImages = images;
      this.sortSharedImages();

      this.filteredUsers = [...users];
      this.filteredFriends = [...friends];
      this.filteredRequests = [...requests];
    });

    this.subscription.add(sub);
  }

  fetchSharedImages(): Observable<SharedImage[]> {
    return this.shareService.getSharedImages().pipe(
      map((images: any[]) => 
        images.map(img => ({
          ...img,
          image: this.baseImageUrl + img.image
        }))
      )
    );
  }


  arrangeBy(arrangeType: string, orderType: string): void {
    this.arrange = arrangeType;
    this.order = orderType;

    this.arrangeByIconHtml = `
      <div>
        <i class="fa-solid fa-arrow-${orderType === 'desc' ? 'down' : 'up'}"></i> <b>${arrangeType}</b>
      </div>
    `;

    this.sortSharedImages();
  }

  toggleOrder(): void {
    const newOrder = this.order === 'desc' ? 'asc' : 'desc';
    this.arrangeBy(this.arrange, newOrder);
  }

  sortSharedImages(): void {
    this.sharedImages = [...this.sharedImages].sort((a, b) => {
      let comparison = 0;
      switch (this.arrange.toLowerCase()) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
      }
      return this.order === 'desc' ? -comparison : comparison;
    });
  }

  search(event: any): void {
    const value = event.target.value.toLowerCase();
    if (this.activeTab === 'users') {
      this.filteredUsers = this.users.filter(u => u.email.toLowerCase().includes(value));
    } else if (this.activeTab === 'friends') {
      this.filteredFriends = this.friends.filter(f => f.email.toLowerCase().includes(value));
    } else if (this.activeTab === 'requests') {
      this.filteredRequests = this.requests.filter(r => r.email.toLowerCase().includes(value));
    }
  }

  seeUsers(): void {
    this.activeTab = 'users';
    this.searchValue = '';
    this.filteredUsers = [...this.users];
  }

  seeFriends(): void {
    this.activeTab = 'friends';
    this.searchValue = '';
    this.filteredFriends = [...this.friends];
  }

  seeRequests(): void {
    this.activeTab = 'requests';
    this.searchValue = '';
    this.filteredRequests = [...this.requests];
  }

  sendRequest(id: number): void {
    this.pairsService.sendRequest(id).subscribe(() => {
      this.requestsSent.push(id);
      this.showMessage('Request Sent', 'success');
    });
  }

  deleteRequest(id: number): void {
    this.pairsService.deleteRequest(id).subscribe(() => {
      this.requestsSent = this.requestsSent.filter(reqId => reqId !== id);
      this.showMessage('Request Deleted', 'success');
    });
  }

  acceptRequest(id: number): void {
    this.pairsService.acceptRequest(id).subscribe(() => {
      const requestUser = this.requests.find(r => r.id === id);
      if (requestUser) {
        this.friends.push(requestUser);
        this.requests = this.requests.filter(r => r.id !== id);
        this.filteredFriends = [...this.friends];
        this.filteredRequests = [...this.requests];
        this.showMessage('Request Accepted', 'success');
      }
    });
  }

  rejectRequest(id: number): void {
    this.pairsService.rejectRequest(id).subscribe(() => {
      this.requests = this.requests.filter(r => r.id !== id);
      this.filteredRequests = [...this.requests];
      this.showMessage('Request Rejected', 'success');
    });
  }

  removeFriend(id: number): void {
    this.pairsService.removeFriend(id).subscribe(() => {
      this.friends = this.friends.filter(f => f.id !== id);
      this.filteredFriends = [...this.friends];
      this.showMessage('Friend Removed', 'success');
    });
  }

  removeSharedImage(userId: number, imageId: number): void {
    this.shareService.removeSharedImage(userId, imageId).subscribe(() => {
      this.sharedImages = this.sharedImages.filter(img => img.imageId !== imageId);
      this.showMessage('Shared Image Removed', 'success');
    });
  }

  private showMessage(message: string, type: string): void {
    console.log(`${type.toUpperCase()}: ${message}`);
    // Replace with toast/alert if needed
  }
}
