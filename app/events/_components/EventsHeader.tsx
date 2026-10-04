import { TabsList, TabsTrigger } from '@/components/ui/tabs';

type Tab = 'upcoming' | 'ongoing' | 'past';

const headings: Record<Tab, { title: string; subtitle: string }> = {
  upcoming: {
    title: 'Upcoming Events',
    subtitle:
      'Discover cutting-edge experiences that push boundaries and inspire innovation.'
  },
  ongoing: {
    title: 'Ongoing Events',
    subtitle:
      'Explore the vibrant activities happening right now across our campus.'
  },
  past: {
    title: 'Past Events',
    subtitle:
      'Look back at the incredible moments and milestones from our journey.'
  }
};

export default function EventsHeader({ activeTab }: { activeTab: Tab }) {
  return (
    <div className="flex w-full flex-col items-center gap-4 border-b border-borde pb-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-orbitron px-4 text-4xl md:text-5xl font-bold tracking-tight text-primary transition-all">
          {headings[activeTab].title}
        </h1>
        <p className="max-w-2xl px-4 text-base leading-relaxed text-muted-foreground transition-all">
          {headings[activeTab].subtitle}
        </p>
      </div>

      <TabsList>
        <TabsTrigger value="upcoming" className="text-base">
          Upcoming
        </TabsTrigger>
        <TabsTrigger value="ongoing" className="text-base">
          Ongoing
        </TabsTrigger>
        <TabsTrigger value="past" className="text-base">
          Past
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
