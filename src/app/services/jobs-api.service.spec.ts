import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { JobsApiService } from './jobs-api.service';
import { JobAdDto } from '../models/job-ad';
import { provideHttpClient } from '@angular/common/http';

describe('JobsApiService', () => {
  let service: JobsApiService;
  let httpMock: HttpTestingController;

  const dummyJobAds: JobAdDto[] = [
    {
      id: '1',
      title: 'Test Job 1',
      description: 'Test Job Description 1',
      skills: ['skill 1', 'skill 2', 'skill 3'],
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
      _embedded: undefined,
    },
    {
      id: '2',
      title: 'Test Job 2',
      description: 'Test Job Description 2',
      skills: ['skill 1', 'skill 2'],
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
      _embedded: undefined,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JobsApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(JobsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve job ads - GET', () => {
    service.getJobAds().subscribe((jobAds: any) => {
      expect(jobAds.length).toBe(2);
      expect(jobAds).toEqual(dummyJobAds);
    });

    const req = httpMock.expectOne('http://localhost:3000/jobs');
    expect(req.request.method).toBe('GET');
    req.flush(dummyJobAds);
  });

  it('should create a job ad - POST', () => {
    const newJobAd: JobAdDto = {
      id: '3',
      title: 'Test Job 3',
      description: 'Test Job Description 3',
      skills: ['skill 1', 'skill 2', 'skill 3', 'skill 4'],
      status: 'archived',
      createdAt: new Date(),
      updatedAt: new Date(),
      _embedded: undefined,
    };

    const mockDate = new Date();
    jasmine.clock().install();
    jasmine.clock().mockDate(mockDate);

    service.createJobAd(newJobAd).subscribe((response) => {
      expect(response).toEqual(
        jasmine.objectContaining({
          id: '3',
          title: 'Test Job 3',
          description: 'Test Job Description 3',
          skills: ['skill 1', 'skill 2', 'skill 3', 'skill 4'],
          status: 'archived',
          createdAt: mockDate,
          updatedAt: mockDate,
          _embedded: undefined,
        })
      );
    });

    const req = httpMock.expectOne('http://localhost:3000/jobs');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(
      jasmine.objectContaining({
        id: '3',
        title: 'Test Job 3',
        description: 'Test Job Description 3',
        skills: ['skill 1', 'skill 2', 'skill 3', 'skill 4'],
        status: 'archived',
        createdAt: mockDate,
        updatedAt: mockDate,
        _embedded: undefined,
      })
    );
    req.flush(newJobAd);

    jasmine.clock().uninstall();
  });

  it('should delete a job ad - DELETE', () => {
    const jobId = '1';

    service.deleteJobAd(jobId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:3000/jobs/${jobId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should update a job ad - PUT', () => {
    const updatedJobAd: JobAdDto = {
      id: '1',
      title: 'Updated Job 1',
      description: 'Updated Job Description 1',
      skills: ['skill 4', 'skill 5', 'skill 6', 'skill 7'],
      status: 'archived',
      createdAt: new Date(),
      updatedAt: new Date(),
      _embedded: undefined,
    };

    const mockDate = new Date();
    jasmine.clock().install();
    jasmine.clock().mockDate(mockDate);

    service.updateJobAd(updatedJobAd).subscribe((response) => {
      expect(response).toEqual(
        jasmine.objectContaining({
          id: '1',
          title: 'Updated Job 1',
          description: 'Updated Job Description 1',
          skills: ['skill 4', 'skill 5', 'skill 6', 'skill 7'],
          status: 'archived',
          updatedAt: new Date(),
          _embedded: undefined,
        })
      );
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/jobs/${updatedJobAd.id}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(
      jasmine.objectContaining({
        id: '1',
        title: 'Updated Job 1',
        description: 'Updated Job Description 1',
        updatedAt: mockDate,
      })
    );
    req.flush(updatedJobAd);

    jasmine.clock().uninstall();
  });
});
