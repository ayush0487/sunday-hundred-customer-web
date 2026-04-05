import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiResponse, Category } from '@/types/api.types';

const categoriesData: Category[] = [
  {
    id: "cat-1",
    type_cat: "Beauty & Wellness",
    type_cat_slug: "beauty-wellness",
    type_cat_img_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
    type_cat_is_active: true,
    name: "Beauty & Wellness", // Legacy field
    sub_categories: [
      {
        id: "subcat-1-1",
        sub_cat: "Salons",
        sub_cat_slug: "beauty-wellness-salons",
        sub_cat_img_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
        sub_cat_is_active: true,
      },
      {
        id: "subcat-1-2",
        sub_cat: "Spas",
        sub_cat_slug: "beauty-wellness-spas",
        sub_cat_img_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
        sub_cat_is_active: true,
      },
      {
        id: "subcat-1-3",
        sub_cat: "Skincare",
        sub_cat_slug: "beauty-wellness-skincare",
        sub_cat_img_url: "https://images.unsplash.com/photo-1556304956-0ee4e2b677b8?w=400&h=300&fit=crop",
        sub_cat_is_active: true,
      },
    ],
  },
  {
    id: "cat-2",
    type_cat: "Fitness & Wellness",
    type_cat_slug: "fitness-wellness",
    type_cat_img_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    type_cat_is_active: true,
    name: "Fitness & Wellness", // Legacy field
    sub_categories: [
      {
        id: "subcat-2-1",
        sub_cat: "Gym",
        sub_cat_slug: "fitness-wellness-gym",
        sub_cat_img_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
        sub_cat_is_active: true,
      },
      {
        id: "subcat-2-2",
        sub_cat: "Yoga",
        sub_cat_slug: "fitness-wellness-yoga",
        sub_cat_img_url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop",
        sub_cat_is_active: true,
      },
      {
        id: "subcat-2-3",
        sub_cat: "Martial Arts",
        sub_cat_slug: "fitness-wellness-martial-arts",
        sub_cat_img_url: "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400&h=300&fit=crop",
        sub_cat_is_active: true,
      },
    ],
  },
  {
    id: "cat-3",
    type_cat: "Professional Services",
    type_cat_slug: "professional-services",
    type_cat_img_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    type_cat_is_active: true,
    name: "Professional Services", // Legacy field
    sub_categories: [
      {
        id: "subcat-3-1",
        sub_cat: "Plumbing",
        sub_cat_slug: "professional-services-plumbing",
        sub_cat_img_url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop",
        sub_cat_is_active: true,
      },
      {
        id: "subcat-3-2",
        sub_cat: "Electrical",
        sub_cat_slug: "professional-services-electrical",
        sub_cat_img_url: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop",
        sub_cat_is_active: true,
      },
      {
        id: "subcat-3-3",
        sub_cat: "Carpentry",
        sub_cat_slug: "professional-services-carpentry",
        sub_cat_img_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop",
        sub_cat_is_active: true,
      },
    ],
  },
  {
    id: "cat-4",
    type_cat: "Education & Tutoring",
    type_cat_slug: "education-tutoring",
    type_cat_img_url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop",
    type_cat_is_active: true,
    name: "Education & Tutoring", // Legacy field
    sub_categories: [
      {
        id: "subcat-4-1",
        sub_cat: "Online Courses",
        sub_cat_slug: "education-tutoring-online-courses",
        sub_cat_img_url: "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=400&h=300&fit=crop",
        sub_cat_is_active: true,
      },
      {
        id: "subcat-4-2",
        sub_cat: "Coaching",
        sub_cat_slug: "education-tutoring-coaching",
        sub_cat_img_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
        sub_cat_is_active: true,
      },
    ],
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Category[]>>
) {
  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      message: "Categories fetched",
      data: categoriesData,
    });
  } else {
    res.status(405).json({
      success: false,
      message: "Method not allowed",
      data: [],
    });
  }
}
