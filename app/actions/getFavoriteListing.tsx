import { prisma } from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListing() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }

    const favorite = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])],
        },
      },
    });

    const safeFavorite = favorite.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toISOString(),
    }));
    return safeFavorite;
  } catch (error) {
    console.log(error)
    throw new Error("error");
  }
}
