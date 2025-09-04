export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string | null;
  rating: number;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestimonialStats {
  total: number;
  average_rating: string;
  five_star_count: number;
}

export interface TestimonialsResponse {
  testimonials: Testimonial[];
  stats: TestimonialStats;
  message: string;
}
