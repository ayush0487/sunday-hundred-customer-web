import type { NextApiRequest, NextApiResponse } from 'next';

const reviews = [
  { name: "Priya S.", rating: 5, text: "Amazing experience! The staff was very professional and the ambiance was perfect.", date: "2 days ago", avatar: "PS" },
  { name: "Rahul M.", rating: 4, text: "Great service and reasonable prices. Will definitely come back.", date: "1 week ago", avatar: "RM" },
  { name: "Anita K.", rating: 5, text: "Best salon in the area. Loved the hair coloring results!", date: "2 weeks ago", avatar: "AK" },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(reviews);
}
