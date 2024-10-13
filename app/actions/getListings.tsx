import { prisma } from "../libs/prismadb";

export interface IListingParams {
  userId?: string;
  guestCount?: number;
  startDate?: string;
  endDate?: string;
  bathroomCount?: number;
  roomCount?: number;
  locationValues?: string;
  category?: string;
}

export default async function getListings(params: IListingParams) {
  try {
    const {
      userId,
      guestCount,
      startDate,
      endDate,
      category,
      roomCount,
      locationValues,
      bathroomCount,
    } = params;
    const query = {
      userId,
      category,
      roomCount: {},
      bathroomCount: {},
      guestCount: {},
      locationValues,
      NOT: {}

    };

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }
    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
      };
    }
    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    }
    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
    }

    if (locationValues) {
      query.locationValues = locationValues;
    }
    if (category) {
      query.category = category;
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });
    const safeListings = listings.map((listings) => ({
      ...listings,
      createdAt: listings.createdAt.toISOString(),
    }));
    return safeListings;
  } catch (error) {
    console.log(error);
    throw new Error("error");
  }
}
