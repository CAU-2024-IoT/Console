import { setBookState } from "../repositories/book.repository.js";
import { deleteRentRecord } from "../repositories/return.repository.js";
import { getBookInfo } from "./book.service.js";
import { returnToShelf } from "../integrations/return.integration.js";

export const returnBook = async (dto) => {
  const { bookId, userId } = dto;

  try {
    // Step 1: 해당 도서가 존재하는지 확인
    const book = await getBookInfo(bookId);

    // Step 2: 도서가 '대여중' 상태인지 확인
    if (book.status !== 'DAEYONG') {
      throw new Error("The book is not currently rented and cannot be returned.");
    }

    // Step 3: 책장에 반납 정보 전달
    const shelfReturnResult = await returnToShelf(book.shelf_id, bookId);
    if (!shelfReturnResult) {
      throw new Error("Failed to return book to the shelf.");
    }

    // Step 4: 대여 기록 삭제
    const returnInfo = {
      book_id: bookId,
      user_id: userId,
      returnDate: new Date(),
    };
    const updateRentTableResult = await deleteRentRecord(returnInfo);
    if (!updateRentTableResult) {
      throw new Error("Failed to delete rent record. Please try again.");
    }

    // Step 5: 도서 상태를 '보관중'으로 업데이트
    const updateBookStateResult = await setBookState(bookId, 'BOGAN');
    if (!updateBookStateResult) {
      throw new Error("Failed to update book state to 'BOGAN'.");
    }

    // 최종 반환 데이터 생성
    return {
      shelfReturnResult 
    };

  } catch (error) {
    console.error(`Error during book return: ${error.message}`);
    throw new Error(`Failed to return book: ${error.message}`);
  }
};
