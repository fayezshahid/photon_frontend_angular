import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

interface User {
  id: number;
  email: string;
}

interface SharedImage {
  id: number;
  image: string;
  name?: string;
  user_id: number;
  userEmail?: string;
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
  
  // Data properties
  users: User[] = [
    { id: 1, email: 'user1@example.com' },
    { id: 2, email: 'user2@example.com' },
    { id: 3, email: 'user3@example.com' }
  ];
  
  friends: User[] = [
    { id: 4, email: 'friend1@example.com' },
    { id: 5, email: 'friend2@example.com' }
  ];
  
  requests: User[] = [
    { id: 6, email: 'request1@example.com' },
    { id: 7, email: 'request2@example.com' }
  ];
  
  sharedImages: SharedImage[] = [
    {
      id: 1,
      image: 'assets/favicon.webp',
      name: 'Sunset Photo',
      user_id: 4,
      userEmail: 'friend1@example.com',
      date: new Date('2024-01-15'),
      size: 1024000
    },
    {
      id: 2,
      image: 'assets/favicon.webp',
      name: 'Mountain View',
      user_id: 5,
      userEmail: 'friend2@example.com',
      date: new Date('2024-01-20'),
      size: 2048000
    }
  ];
  
  requestsSent: number[] = [1, 3];
  
  // Filter properties
  filteredUsers: User[] = [];
  filteredFriends: User[] = [];
  filteredRequests: User[] = [];
  searchValue: string = '';
  
  // UI state properties
  activeTab: string = 'users';
  arrange: string = 'Date';
  order: string = 'desc';
  arrangeByIconHtml: string = '';

  private subscription: Subscription = new Subscription();

  constructor() {}

  ngOnInit(): void {
    this.arrangeBy('Date', 'desc');
    this.load();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  arrangeBy(arrangeType: string, orderType: string): void {
    this.arrange = arrangeType;
    this.order = orderType;
    
    if (orderType === 'desc') {
      this.arrangeByIconHtml = `
        <div>
          <i class="fa-solid fa-arrow-down"></i> <b>${arrangeType}</b>
        </div>
      `;
    } else {
      this.arrangeByIconHtml = `
        <div>
          <i class="fa-solid fa-arrow-up"></i> <b>${arrangeType}</b>
        </div>
      `;
    }
    
    this.sortSharedImages();
  }

  toggleOrder(): void {
    const newOrder = this.order === 'desc' ? 'asc' : 'desc';
    this.arrangeBy(this.arrange, newOrder);
  }

  sortSharedImages(): void {
    this.sharedImages = this.sharedImages.sort((a, b) => {
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
        default:
          comparison = 0;
      }
      
      return this.order === 'desc' ? -comparison : comparison;
    });
  }

  load(): void {
    this.loadUsers();
    this.loadFriends();
    this.loadRequests();
  }

  loadUsers(): void {
    this.filteredUsers = [...this.users];
  }

  loadFriends(): void {
    this.filteredFriends = [...this.friends];
  }

  loadRequests(): void {
    this.filteredRequests = [...this.requests];
  }

  search(event: any): void {
    const value = event.target.value.toLowerCase();
    
    if (this.activeTab === 'users') {
      this.filteredUsers = this.users.filter(user => 
        user.email.toLowerCase().includes(value)
      );
    } else if (this.activeTab === 'friends') {
      this.filteredFriends = this.friends.filter(friend => 
        friend.email.toLowerCase().includes(value)
      );
    } else if (this.activeTab === 'requests') {
      this.filteredRequests = this.requests.filter(request => 
        request.email.toLowerCase().includes(value)
      );
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
    if (!this.requestsSent.includes(id)) {
      this.requestsSent.push(id);
      console.log('Request sent to user:', id);
      // Show success message
      this.showMessage('Request Sent', 'success');
    }
  }

  deleteRequest(id: number): void {
    this.requestsSent = this.requestsSent.filter(reqId => reqId !== id);
    console.log('Request deleted for user:', id);
    this.showMessage('Request Deleted', 'success');
  }

  acceptRequest(id: number): void {
    // Move from requests to friends
    const requestUser = this.requests.find(req => req.id === id);
    if (requestUser) {
      this.friends.push(requestUser);
      this.requests = this.requests.filter(req => req.id !== id);
      this.filteredFriends = [...this.friends];
      this.filteredRequests = [...this.requests];
      console.log('Request accepted from user:', id);
      this.showMessage('Request Accepted', 'success');
    }
  }

  rejectRequest(id: number): void {
    this.requests = this.requests.filter(req => req.id !== id);
    this.filteredRequests = [...this.requests];
    console.log('Request rejected from user:', id);
    this.showMessage('Request Rejected', 'success');
  }

  removeFriend(id: number): void {
    this.friends = this.friends.filter(friend => friend.id !== id);
    this.filteredFriends = [...this.friends];
    console.log('Friend removed:', id);
    this.showMessage('Friend Removed', 'success');
  }

  removeSharedImage(userId: number, imageId: number): void {
    this.sharedImages = this.sharedImages.filter(img => img.id !== imageId);
    console.log('Shared image removed:', imageId, 'from user:', userId);
    this.showMessage('Shared Image Removed', 'success');
  }

  private showMessage(message: string, type: string): void {
    // Simple console log for now - you can replace with actual toast notification
    console.log(`${type.toUpperCase()}: ${message}`);
  }
}