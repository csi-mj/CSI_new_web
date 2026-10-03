'use client';

import { useState, useEffect } from 'react';
import EventGrid from './_components/EventGrid';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import EventsHeader from './_components/EventsHeader';

type Tab = 'upcoming' | 'ongoing' | 'past';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (['upcoming', 'ongoing', 'past'].includes(hash)) {
        setActiveTab(hash as Tab);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (val: string) => {
    const tab = val as Tab;
    setActiveTab(tab);
    window.location.hash = tab;
  };

  return (
    <section className="relative min-h-screen overflow-hidden py-5">
      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-col">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="flex w-full flex-col"
          >
            <EventsHeader activeTab={activeTab} />

            <div className="w-full">
              <TabsContent value="upcoming" className="mt-0 outline-none">
                <EventGrid activeTab="upcoming" />
              </TabsContent>

              <TabsContent value="ongoing" className="mt-0 outline-none">
                <EventGrid activeTab="ongoing" />
              </TabsContent>

              <TabsContent value="past" className="mt-0 outline-none">
                <EventGrid activeTab="past" />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
