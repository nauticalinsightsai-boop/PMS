import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { MarketingImageSpec } from '@/lib/marketing-stock-images';

type PageMarketingImageProps = {
  image: MarketingImageSpec;
  className?: string;
  priority?: boolean;
  aspectClassName?: string;
};

export function PageMarketingImage({
  image,
  className,
  priority = false,
  aspectClassName = 'aspect-[4/3]',
}: PageMarketingImageProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl',
        aspectClassName,
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="object-cover w-full h-full"
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );
}

type PageHeroWithImageProps = {
  image: MarketingImageSpec;
  children: ReactNode;
  className?: string;
  imagePosition?: 'left' | 'right';
  imageAspectClassName?: string;
  priority?: boolean;
};

export function PageHeroWithImage({
  image,
  children,
  className,
  imagePosition = 'right',
  imageAspectClassName,
  priority = false,
}: PageHeroWithImageProps) {
  const textOrder = imagePosition === 'right' ? 'order-1' : 'order-2 lg:order-1';
  const imageOrder = imagePosition === 'right' ? 'order-2' : 'order-1 lg:order-2';

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center', className)}>
      <div className={textOrder}>{children}</div>
      <PageMarketingImage
        image={image}
        className={imageOrder}
        aspectClassName={imageAspectClassName}
        priority={priority}
      />
    </div>
  );
}
