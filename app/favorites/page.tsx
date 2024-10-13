import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListing from "../actions/getFavoriteListing";
import EmptyState from "../components/EmptyState";
import { SafeUser } from "../types";
import FavoriteClient from "./FavoriteClient";

export default async function FavoritePage() {
  const listings = await getFavoriteListing();
  const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return (
      <EmptyState
        title="No favorites found"
        subtitle="looks like you have no favorite listings."
      />
    );
  }
  return (
    <FavoriteClient listings={listings} currentUser={currentUser as SafeUser} />
  );
}
