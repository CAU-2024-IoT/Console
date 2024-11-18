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

export const findBooksInfo = async () => {
  try {
    const booksInfo = await prisma.book.findMany({
    });
    return booksInfo;
  } catch (error) {
    throw new Error(
      `오류가 발생했어요. 요청을 확인해 주세요. (${error.message})`
    );
  }
};


export const setBookState = async (bookId, status) => {
  try {
    // 도서 상태 업데이트
    const updatedBook = await prisma.book.update({
      where: { book_id: bookId },
      data: { status },
    });

    return updatedBook;
  } catch (error) {
    console.error("Error updating book state:", error);
    throw new Error("Failed to update book state");
  }
};