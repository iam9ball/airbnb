import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import { SafeListing, SafeUser } from "@/app/types";
import getReservation from "@/app/actions/getReservation";

interface IParams {
  listingId?: string;
}

export default async function ListingPage({ params }: { params: IParams }) {
  const listing = await getListingById(params);
  const currentUser = await getCurrentUser();
  const reservations = await getReservation(params);

  if (!listing) {
    return <EmptyState />;
  }
  return (
    <>
      <ListingClient
        listing={listing as SafeListing & { user: SafeUser }}
        reservations={reservations}
        currentUser={currentUser as SafeUser}
      />
    </>
  );
}
