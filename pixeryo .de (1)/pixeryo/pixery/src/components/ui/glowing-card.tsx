"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GlowingEffect } from "./glowing-effect";

interface GlowingCardProps {
  title: string;
  description: string;
  imageSrc: string;
  href: string;
}

export default function GlowingCard({ title, description, imageSrc, href }: GlowingCardProps) {
  return (
    <div className="relative h-full rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
      {/* Glowing Effect */}
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />
      
      <div className="relative flex h-full flex-col overflow-hidden rounded-lg z-10">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image 
            src={imageSrc} 
            alt={title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between p-6">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              {description}
            </p>
          </div>
          <div className="mt-6">
            <Link
              href={href}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View images →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 