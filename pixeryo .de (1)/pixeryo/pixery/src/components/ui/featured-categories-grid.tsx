"use client";

import Image from "next/image";
import Link from "next/link";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

interface FeaturedCategory {
  title: string;
  description: string;
  imageSrc: string;
  href: string;
}

interface FeaturedCategoriesGridProps {
  categories: FeaturedCategory[];
}

export function FeaturedCategoriesGrid({ categories }: FeaturedCategoriesGridProps) {
  // Define optimal grid areas for exactly 5 categories
  const gridAreas = [
    // First row: Two smaller items
    "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]", // Top left
    "md:[grid-area:1/7/2/13] xl:[grid-area:1/5/2/9]", // Top middle

    // Second row: Large item spanning two rows
    "md:[grid-area:2/1/4/7] xl:[grid-area:1/9/3/13]", // Right large

    // Third row: Two medium items
    "md:[grid-area:2/7/3/13] xl:[grid-area:2/1/3/5]", // Bottom left
    "md:[grid-area:3/7/4/13] xl:[grid-area:2/5/3/9]", // Bottom middle
  ];

  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[40rem] xl:grid-rows-2">
      {categories.map((category, index) => {
        // Ensure we don't exceed our grid areas
        if (index >= gridAreas.length) return null;
        
        // For the third item (large one), we'll make it a bit special
        const isLargeItem = index === 2;
        
        return (
          <GridItem
            key={category.title}
            area={gridAreas[index]}
            title={category.title}
            description={category.description}
            href={category.href}
            imageSrc={category.imageSrc}
            isLarge={isLargeItem}
          />
        );
      })}
    </ul>
  );
}

interface GridItemProps {
  area: string;
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  isLarge?: boolean;
}

const GridItem = ({ area, title, description, href, imageSrc, isLarge = false }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <Link href={href} className="block h-full">
          <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
            <div className="relative flex-1 flex flex-col">
              <div className={cn(
                "relative w-full mb-4 overflow-hidden rounded-lg", 
                isLarge ? "h-48 md:h-56" : "h-32"
              )}>
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 hover:scale-105"
                />
              </div>
              <div className="space-y-3">
                <h3 className={cn(
                  "pt-0.5 font-semibold tracking-[-0.04em] text-balance text-foreground",
                  isLarge ? "text-2xl md:text-3xl leading-tight" : "text-xl leading-[1.375rem] md:text-2xl md:leading-[1.875rem]"
                )}>
                  {title}
                </h3>
                <p className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </li>
  );
}; 