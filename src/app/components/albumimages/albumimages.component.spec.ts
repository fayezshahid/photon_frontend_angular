import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumImagesComponent } from './albumimages.component';

describe('AlbumimagesComponent', () => {
  let component: AlbumImagesComponent;
  let fixture: ComponentFixture<AlbumImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
