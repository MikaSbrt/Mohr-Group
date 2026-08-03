import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VehicleDetail from '@/components/VehicleDetail';
import { getVehicle, vehicles } from '@/lib/vehicles';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return { title: 'Fahrzeug nicht gefunden' };

  return {
    title: vehicle.name,
    description: vehicle.tagline,
  };
}

export default async function VehiclePage({ params }: Params) {
  const { slug } = await params;
  const index = vehicles.findIndex((v) => v.slug === slug);
  if (index === -1) notFound();

  const vehicle = vehicles[index];
  const prev = vehicles[(index - 1 + vehicles.length) % vehicles.length];
  const next = vehicles[(index + 1) % vehicles.length];

  return <VehicleDetail vehicle={vehicle} prev={prev} next={next} />;
}
