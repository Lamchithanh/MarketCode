export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  thumbnailUrl?: string;
  technologies: string[];
  category: string;
  price: string;
  rating: number;
  reviews: number;
  averageRating?: number; // New field from database
  totalReviews?: number;  // New field from database
  downloadCount?: number;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  fileUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  fileSize?: number;
  images?: string[];
  features?: Array<{
    title: string;
    description: string;
  }>;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}
