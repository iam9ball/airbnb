import getCurrentUser from "../actions/getCurrentUser";
import getReservation from "../actions/getReservation";
import EmptyState from "../components/EmptyState";
import { SafeUser } from "../types";
import TripClient from "./TripClient";

export default async function TripPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }
  const reservations = await getReservation({
    userId: currentUser.id,
  });

  if (reservations.length == 0) {
    return (
      <EmptyState
        title="No trips found"
        subtitle="looks like you haven't reserved any trips"
      />
    );
  }

  return <TripClient reservations={reservations} currentUser={currentUser as SafeUser} />;
}


