import { prisma } from "../db.config.js";

export const findBookInfo = async (bookId) => {
  try {
    const bookInfo = await prisma.book.findUnique({
      where: { book_id: bookId },
    });
    return bookInfo;
  } catch (error) {
    throw new Error(
      `오류가 발생했어요. 요청을 확인해 주세요. (${error.message})`
    );
  }
};
