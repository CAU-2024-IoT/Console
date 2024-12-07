import { prisma } from "../db.config.js";

export const createRentRecord = async ({ user_id, book_id, rent_date = new Date(), return_date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }) => {
    console.log(user_id, book_id);
    try {
      const rentRecord = await prisma.rent.create({
        data: {
          user_id : user_id,
          book_id : book_id,
          rent_date : rent_date,
          return_date : return_date,
        },
        include: {
          user: true,
          book: true
        }
      });
  
      return rentRecord;
    } catch (error) {
      console.error("Error creating rent record:", error);
      throw new Error("Failed to create rent record");
    }
  };

export const createRentalRecord = async (bookId, userId) => {
  const rentInfo = {
    book_id: bookId,
    user_id: userId,
    rentDate: new Date(),
    status: '대여중',
  };

  const result = await createRentRecord(rentInfo);
  if (!result) {
    throw new Error("Failed to create rent record.");
  }
  return rentInfo;
};
