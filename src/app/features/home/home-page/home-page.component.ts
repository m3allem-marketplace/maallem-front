import { Component, OnInit } from '@angular/core';

import { WorkerSummary } from '../../../shared/models/worker-summary.model';
import { Category } from '../../../shared/models/category.model';

const STUB_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'سباكة',
    icon: 'plumbing',
    subcategories: [],
  },
  {
    id: '2',
    name: 'كهرباء',
    icon: 'electrical',
    subcategories: [    {
      id: '11',
      name: 'تركيب نجف',
      icon: 'electrical',
      subcategories: []
    },
    {
      id: '12',
      name: 'إصلاح أعطال',
      icon: 'electrical',
      subcategories: []
    } ,   {
      id: '11',
      name: 'تركيب نجف',
      icon: 'electrical',
      subcategories: []
    },
    {
      id: '12',
      name: 'إصلاح أعطال',
      icon: 'electrical',
      subcategories: []
    },   {
      id: '11',
      name: 'تركيب نجف',
      icon: 'electrical',
      subcategories: []
    },
    {
      id: '12',
      name: 'إصلاح أعطال',
      icon: 'electrical',
      subcategories: []
    }],
  },
  {
    id: '3',
    name: 'نجارة',
    icon: 'carpentry',
    subcategories: [],
  },
  {
    id: '4',
    name: 'دهانات',
    icon: 'painting',
    subcategories: [],
  },
  {
    id: '5',
    name: 'تكييف',
    icon: 'ac',
    subcategories: [],
  },
  {
    id: '6',
    name: 'تنظيف',
    icon: 'cleaning',
    subcategories: [],
  },
  {
    id: '7',
    name: 'نقل عفش',
    icon: 'moving',
    subcategories: [],
  },
  {
    id: '8',
    name: 'سيراميك',
    icon: 'tiling',
    subcategories: [],
  },
];

const STUB_WORKERS: WorkerSummary[] = [
  {
    id: 'w1',
    name: 'أحمد حسن',
    avatar: 'https://i.pravatar.cc/150?img=11',
    category: 'سباك',
    rating: 4,
    tier: 'gold',
    ratePerHour: 150,
  },
  {
    id: 'w2',
    name: 'محمد علي',
    avatar: 'https://i.pravatar.cc/150?img=32',
    category: 'كهربائي',
    rating: 5,
    tier: 'gold',
    ratePerHour: 130,
  },
   {
    id: 'w3',
    name: 'محمد علي',
    avatar: 'https://i.pravatar.cc/150?img=32',
    category: 'كهربائي',
    rating: 2.5,
    tier: 'gold',
    ratePerHour: 130,
  },
   {
    id: 'w4',
    name: 'محمد علي',
    avatar: 'https://i.pravatar.cc/150?img=32',
    category: 'كهربائي',
    rating: 3,
    tier: 'gold',
    ratePerHour: 130,
  },
];

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  categories: Category[] = [];
  featuredWorkers: WorkerSummary[] = [];
  isLoading = true;

  ngOnInit(): void {
  this.categories = STUB_CATEGORIES;

  this.featuredWorkers = STUB_WORKERS.filter(
    worker => worker.tier === 'gold'
  );

  this.isLoading = false;
}
  }
