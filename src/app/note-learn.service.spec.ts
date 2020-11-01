import { TestBed } from '@angular/core/testing';

import { NoteLearnService } from './note-learn.service';

describe('NoteLearnService', () => {
  let service: NoteLearnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteLearnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
