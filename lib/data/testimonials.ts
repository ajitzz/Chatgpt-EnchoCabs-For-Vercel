export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  weekly: string;
  date: string;
  text: string;
};

export const testimonials: Testimonial[] = [
  {
    id: 'basheer',
    name: 'Basheer',
    role: 'Senior Staff',
    avatar: 'https://i.ibb.co/1YQSW8wz/images.jpg',
    weekly: '29,000',
    date: '20/10/2025',
    text: 'We have used various tools in the past but ENCHO made it simple to earn more with reliable vehicles and stress-free living…',
  },
  {
    id: 'naufal',
    name: 'Naufal',
    role: 'Senior Staff',
    avatar: 'https://i.ibb.co/YTWmS0bz/premium-photo-1689530775582-83b8abdb5020.jpg',
    weekly: '24,000',
    date: '20/10/2025',
    text: 'I used ENCHO’s platform for a couple months and the earnings were steady. Accommodation and support team are excellent…',
  },
  {
    id: 'shareef',
    name: 'Shareef',
    role: 'New Join',
    avatar: 'https://i.ibb.co/WNdrqCFy/photo-1507003211169-0a1dd7228f2d.jpg',
    weekly: '29,000',
    date: '20/10/2025',
    text: 'A very well-done program that works exactly as advertised. Learned the routes quickly and started earning from day one…',
  },
];
