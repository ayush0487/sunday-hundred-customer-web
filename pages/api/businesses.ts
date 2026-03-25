import type { NextApiRequest, NextApiResponse } from 'next';

const businesses = [
  {
    id: "1",
    name: "Luxe Salon & Spa",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=450&fit=crop",
    rating: 4.8,
    reviews: 234,
    distance: "1.2 km",
    category: "Salon & Spa",
  },
  {
    id: "2",
    name: "Iron Fitness Studio",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=450&fit=crop",
    rating: 4.6,
    reviews: 189,
    distance: "2.4 km",
    category: "Gym & Fitness",
  },
  {
    id: "3",
    name: "Zen Yoga Center",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&h=450&fit=crop",
    rating: 4.9,
    reviews: 312,
    distance: "0.8 km",
    category: "Yoga & Wellness",
  },
  {
    id: "4",
    name: "Glow Beauty Lounge",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=450&fit=crop",
    rating: 4.7,
    reviews: 156,
    distance: "3.1 km",
    category: "Beauty & Skincare",
  },
  {
    id: "5",
    name: "Royal Barber Shop",
    image: "https://images.unsplash.com/photo-1585747860019-8965e7a42418?w=600&h=450&fit=crop",
    rating: 4.5,
    reviews: 98,
    distance: "1.8 km",
    category: "Barber",
  },
  {
    id: "6",
    name: "Aura Wellness Spa",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=450&fit=crop",
    rating: 4.9,
    reviews: 421,
    distance: "0.5 km",
    category: "Spa & Massage",
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(businesses);
}
