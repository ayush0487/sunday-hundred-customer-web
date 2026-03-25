import type { NextApiRequest, NextApiResponse } from 'next';

const services = [
  { name: "Classic Haircut", duration: "30 min", originalPrice: 500, price: 350 },
  { name: "Hair Coloring", duration: "90 min", originalPrice: 3000, price: 1999 },
  { name: "Deep Tissue Massage", duration: "60 min", originalPrice: 2500, price: 1800 },
  { name: "Facial Treatment", duration: "45 min", originalPrice: 1500, price: 999 },
  { name: "Manicure & Pedicure", duration: "60 min", originalPrice: 1200, price: 799 },
  { name: "Beard Styling", duration: "20 min", originalPrice: 400, price: 250 },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(services);
}
