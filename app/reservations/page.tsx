import getCurrentUser from "../actions/getCurrentUser";
import getReservation from "../actions/getReservation";
import EmptyState from "../components/EmptyState";
import { SafeUser } from "../types";
import ReservationClient from "./ReservationClient";

export default async function ReservationPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return  <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  const reservations = await getReservation({
    authorId: currentUser?.id,
  });

  if (currentUser && reservations.length === 0) {
    return (
      <EmptyState
        title="No reservation found"
        subtitle="Looks like you have no reservations on your properties"
      />
    );
  }

  return (
    <ReservationClient reservation={reservations} currentUser={currentUser as SafeUser}/>
  )
}
