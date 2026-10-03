import React from 'react';
import {
  Rocket,
  GraduationCap,
  Flame,
  Ticket,
  IdCard,
  Laptop,
  Code,
  Wrench,
  Trophy,
  Users,
  Zap,
  Lightbulb,
  MessageCircle,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  CreditCard,
  User
} from 'lucide-react';
import { iconColors } from '@/config/colors';

export default function MembershipHeader() {
  return (
    <div className="mx-auto mb-12 w-full max-w-[1400px] space-y-10">
      <div className="border-border/50 flex flex-col items-center border-b pb-8 text-center">
        <h2 className="text-primary flex flex-wrap items-center justify-center gap-3 text-4xl font-black md:gap-4 md:text-6xl">
          CSI-MJCET Membership
          <span className="text-muted-foreground mt-2 block w-full text-2xl font-bold md:mt-0 md:inline md:w-auto md:text-4xl">
            (2026–27)
          </span>
        </h2>
        <p className="text-muted-foreground bg-muted/30 mt-6 flex items-center justify-center gap-3 rounded-full px-6 py-3 text-xl font-semibold md:text-2xl">
          <GraduationCap
            className={`h-6 w-6 md:h-8 md:w-8 ${iconColors.indigo}`}
          />
          Don’t Just Join a Club. Build Your Tech Journey.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 items-start gap-8 text-left lg:grid-cols-12">
        {/* Left Column - 7 cols */}
        <div className="space-y-8 lg:col-span-7">
          <div className="prose prose-lg dark:prose-invert">
            <h3 className="mb-3 text-3xl font-bold">Welcome to CSI-MJCET!</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Be part of the Computer Society of India, with 100,000+ members
              across 488+ student branches and a community built around
              technology, innovation, collaboration, and leadership.
            </p>
          </div>

          <div className="bg-card/30 border-border/50 rounded-3xl border p-6">
            <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold">
              <Flame className={`h-8 w-8 ${iconColors.rose}`} /> What Do You
              Get?
            </h3>
            <ul className="text-muted-foreground grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <li className="flex gap-3">
                <Ticket
                  className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors.teal}`}
                />{' '}
                <span>
                  <strong>Free Access</strong> to events & seminars
                </span>
              </li>
              <li className="flex gap-3">
                <IdCard
                  className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors.purple}`}
                />{' '}
                <span>
                  <strong>Official ID</strong> & national benefits
                </span>
              </li>
              <li className="flex gap-3">
                <Laptop
                  className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors.blue}`}
                />{' '}
                <span>
                  <strong>Explore Tech</strong> like AI, Web, Cloud
                </span>
              </li>
              <li className="flex gap-3">
                <Code
                  className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors.green}`}
                />{' '}
                <span>
                  <strong>DSA & Workshops</strong> for active learning
                </span>
              </li>
              <li className="flex gap-3">
                <Wrench
                  className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors.orange}`}
                />{' '}
                <span>
                  <strong>Guided Projects</strong> with mentorship
                </span>
              </li>
              <li className="flex gap-3">
                <Trophy
                  className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors.yellow}`}
                />{' '}
                <span>
                  <strong>Learn from Winners</strong> & seniors
                </span>
              </li>
              <li className="flex gap-3 sm:col-span-2">
                <Users
                  className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors.indigo}`}
                />{' '}
                <span>
                  <strong>Strong Network</strong> of friends and collaborators
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - 5 cols */}
        <div className="space-y-8 lg:col-span-5">
          <div className="bg-card/30 border-border/50 space-y-5 rounded-3xl border p-6 md:p-8">
            <h3 className="text-foreground flex items-center gap-3 text-2xl font-bold">
              <Zap className={`h-7 w-7 ${iconColors.yellow}`} /> More Than Just
              a Club
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether you&apos;re a beginner or already building, CSI-MJCET
              gives you the skills, people, and opportunities to level up.
            </p>
            <div className="py-2">
              <p className="text-foreground mb-1 text-xl font-bold">
                Learn. Build. Compete. Collaborate. Lead.
              </p>
            </div>
            <p className="text-muted-foreground text-lg">
              You don&apos;t need to be an expert. <br />
              <span className="mt-1 flex items-center gap-2">
                You just need the curiosity to start.{' '}
                <Rocket className={`h-5 w-5 ${iconColors.orange}`} />
              </span>
            </p>
            <div className="pt-2">
              <p className="text-foreground flex items-center gap-3 text-xl font-black">
                <Lightbulb
                  className={`h-6 w-6 shrink-0 ${iconColors.yellow}`}
                />{' '}
                Innovate. Collaborate. Dominate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts Grid - Full width below */}
      <div className="grid w-full grid-cols-1 gap-6 pt-4 md:grid-cols-2 md:gap-10">
        <div className="bg-card/30 border-border/50 rounded-3xl border p-6 md:p-8">
          <h3 className="text-foreground mb-6 flex items-center gap-3 text-xl font-bold">
            <MessageCircle className={`h-6 w-6 ${iconColors.blue}`} /> Contact
            Us
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ul className="text-muted-foreground space-y-4 text-base">
              <li className="flex items-start gap-3">
                <Phone
                  className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors.green}`}
                />{' '}
                <div>
                  <strong className="text-foreground">Meer Aymaan Ali</strong>
                  <br />
                  <a href="tel:+916304739303" className="hover:text-primary transition-colors hover:underline">+91 6304739303</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors.green}`}
                />{' '}
                <div>
                  <strong className="text-foreground">Nusrah Khan</strong>
                  <br />
                  <a href="tel:+917997098324" className="hover:text-primary transition-colors hover:underline">+91 79970 98324</a>
                </div>
              </li>
            </ul>
            <ul className="text-muted-foreground space-y-4 text-base">
              <li className="flex items-center gap-3 group">
                <Mail className={`h-5 w-5 shrink-0 ${iconColors.rose}`} />{' '}
                <a href="mailto:csi@mjcollege.ac.in" className="text-foreground font-bold hover:text-primary transition-colors hover:underline">csi@mjcollege.ac.in</a>
              </li>
              <li className="flex items-center gap-3 group">
                <Instagram className={`h-5 w-5 shrink-0 ${iconColors.purple}`} />{' '}
                <a href="https://www.instagram.com/csi_mjcet" target="_blank" rel="noopener noreferrer" className="text-foreground font-bold hover:text-primary transition-colors hover:underline">@csi_mjcet</a>
              </li>
              <li className="flex items-center gap-3 group">
                <Linkedin className={`h-5 w-5 shrink-0 ${iconColors.blue}`} />{' '}
                <a href="https://www.linkedin.com/company/csi-mjcet" target="_blank" rel="noopener noreferrer" className="text-foreground font-bold hover:text-primary transition-colors hover:underline">CSI-MJCET</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-card/30 border-border/50 rounded-3xl border p-6 md:p-8">
          <h3 className="text-foreground mb-6 flex items-center gap-3 text-xl font-bold">
            <CreditCard className={`h-6 w-6 ${iconColors.teal}`} /> Cash Payment
          </h3>
          <ul className="text-muted-foreground space-y-4 text-base">
            <li className="flex items-start gap-3">
              <Phone
                className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors.green}`}
              />{' '}
              <div>
                <strong className="text-foreground">Mir Danish Ahmed:</strong>
                <br />
                <a href="tel:+918106110632" className="hover:text-primary transition-colors hover:underline">+91 8106110632</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <User
                className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors.indigo}`}
              />{' '}
              <div>
                <strong className="text-foreground">
                  Faculty Coordinator:
                </strong>
                <br />
                Mr. Zainuddin Naveed
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
