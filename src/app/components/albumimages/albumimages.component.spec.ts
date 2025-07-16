import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumimagesComponent } from './albumimages.component';

describe('AlbumimagesComponent', () => {
  let component: AlbumimagesComponent;
  let fixture: ComponentFixture<AlbumimagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumimagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumimagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
