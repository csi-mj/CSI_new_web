'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  image: string;
  specialties: string[];
}

interface TeamCard3DProps {
  member: TeamMember;
  isActive: boolean;
  className?: string;
  isMobile?: boolean;
  onImageClick?: (member: TeamMember) => void;
}

// 3D Team Card Component
const TeamCard3D: React.FC<TeamCard3DProps> = ({ 
  member, 
  isActive, 
  className, 
  isMobile, 
  onImageClick 
}) => {
  // Log image URL for debugging
  console.log('Loading image:', member.image);
  
  return (
    <div className="w-full h-full" onClick={() => onImageClick?.(member)}>
      <CardContainer className="w-full h-full" containerClassName="py-0">
        <CardBody className="w-full h-full">
          <CardItem className="w-full h-full">
            <div className="relative group w-full h-full cursor-pointer">
              <div className="relative overflow-hidden rounded-xl md:rounded-2xl h-full">
                <div className="relative w-[85%] h-[85%] mx-auto mt-2 overflow-hidden rounded-xl md:rounded-2xl border border-white/10 shadow-2xl">
                  <div className={cn(
                    "relative w-full h-full overflow-hidden transition-all duration-500 group-hover:scale-105",
                    isActive ? 'opacity-100' : 'opacity-80'
                  )}>
                    <div className="relative w-full h-full bg-gray-800">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={400}
                        height={500}
                        className="object-cover w-full h-full"
                        priority={isActive}
                        unoptimized={true}
                        onError={(e) => console.error('Image failed to load:', e)}
                        onLoad={() => console.log('Image loaded successfully:', member.image)}
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                  </div>
                  {/* Enhanced overlay with better pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Subtle border highlight */}
                  <div className="absolute inset-0 rounded-xl md:rounded-2xl border border-white/5" />
                </div>
                
                {isActive && (
                  <div className="absolute px-12 inset-0 p-6 flex flex-col justify-end pointer-events-none">
                    <div className="space-y-2">
                      <h3 className="text-white text-xl font-medium">{member.name}</h3>
                    </div>
                    
                    <button
                      className="absolute right-12 bottom-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        onImageClick?.(member);
                      }}
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </CardItem>
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default TeamCard3D;
