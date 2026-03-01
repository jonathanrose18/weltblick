import Image from 'next/image';
import Link from 'next/link';
import { LoaderCircleIcon } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useEffect, useState, type ReactElement } from 'react';
import { useRouter } from 'next/router';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';

import { HoverCard } from '@/shared/components/ui/hover-card';
import { Layout } from '@/shared/components/layout';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import { countriesClient } from '@/features/countries/countries-client';
import { sortCountriesByName } from '@/features/countries/utils';
import type { Country } from '@/features/countries/types';
import type { NextPageWithLayout } from '@/pages/_app';

export const getStaticProps = (async () => {
  const res = await countriesClient.get<Country[]>('/all?fields=name,flags,capital');

  const countries = sortCountriesByName(res.data);

  return {
    props: {
      countries,
      lastUpdated: new Date().toISOString(),
    },
    revalidate: 60,
  };
}) satisfies GetStaticProps<{ countries: Country[]; lastUpdated: string }>;

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const Page: NextPageWithLayout<PageProps> = ({ countries, lastUpdated }) => {
  const router = useRouter();
  const lastUpdatedDistance = formatDistance(new Date(), new Date(lastUpdated), { includeSeconds: true });

  const [pendingCountry, setPendingCountry] = useState<string | null>(null);

  useEffect(() => {
    const clearPendingCountry = () => setPendingCountry(null);

    router.events.on('routeChangeComplete', clearPendingCountry);
    router.events.on('routeChangeError', clearPendingCountry);

    return () => {
      router.events.off('routeChangeComplete', clearPendingCountry);
      router.events.off('routeChangeError', clearPendingCountry);
    };
  }, [router.events]);

  return (
    <div className='grid grid-cols-12 gap-4'>
      {countries.map(c => {
        const countrySlug = c.name.common.toLocaleLowerCase();
        const isPending = pendingCountry === countrySlug;

        return (
          <Link
            aria-busy={isPending}
            className={cn('col-span-12 md:col-span-6', isPending && 'pointer-events-none')}
            href={`/countries/${countrySlug}`}
            key={c.name.common}
            onClick={() => setPendingCountry(countrySlug)}
          >
            <HoverCard className={cn('flex justify-between gap-4', isPending && 'bg-primary/5 ring-2 ring-primary/30')}>
              <div className='grid'>
                <div className='flex flex-row justify-between gap-2'>
                  <span>{c.name.common}</span>
                  {isPending && (
                    <span className='inline-flex items-center gap-1 text-xs text-primary'>
                      <LoaderCircleIcon className='h-3.5 w-3.5 animate-spin' />
                      Loading...
                    </span>
                  )}
                </div>

                <span className='text-sm text-balance text-muted-foreground'>
                  {c.capital?.join(', ') ?? 'No capital'}
                </span>
              </div>
              <div className='relative h-8 w-8 min-w-8 min-h-8 rounded-full overflow-hidden'>
                <Skeleton className='h-8 w-8' />
                <Image alt={c.flags.alt || `Flag of ${c.name.common}`} fill src={c.flags.png} />
              </div>
            </HoverCard>
          </Link>
        );
      })}
      <div className='col-span-12 flex justify-end text-sm text-muted-foreground'>
        Last updated: {lastUpdatedDistance}
      </div>
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
