import { StaticImageData } from "next/image";

export interface Event {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  fullDescription: string;
  image: StaticImageData;
  attendees: number;
  speakers?: string[];
  highlights?: string[];
}
