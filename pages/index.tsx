import Image from 'next/image';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import type { ReactElement } from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';

import { HoverCard } from '@/shared/components/ui/hover-card';
import { Layout } from '@/shared/components/layout';
import { Skeleton } from '@/shared/components/ui/skeleton';
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
  const lastUpdatedDistance = formatDistance(new Date(), new Date(lastUpdated), { includeSeconds: true });
  return (
    <div className='grid grid-cols-12 gap-4'>
      {countries.map(c => (
        <Link
          className='col-span-12 md:col-span-6'
          href={`/countries/${c.name.common.toLocaleLowerCase()}`}
          key={c.name.common}
        >
          <HoverCard className='flex justify-between gap-4' key={c.name.common}>
            <div className='grid'>
              <div className='flex flex-row justify-between'>
                <span>{c.name.common}</span>
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
      ))}
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
