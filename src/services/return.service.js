import { setBookState } from "../repositories/book.repository.js";
import { deleteRentRecord } from "../repositories/return.repository.js";
import { getBookInfo } from "./book.service.js";

export const returnBook = async (dto) => {
  const { bookId, userId } = dto;

  try {
    // Step 1: 해당 도서가 존재하는지 확인
    const book = await getBookInfo(bookId);

    // Step 2: 도서가 대여 가능한 상태인지 확인
    if (book.status != 'DAEYONG') { // '대여중' 상태라면 대여 불가
      throw new Error("The book is not 대여중.");
    }

    // Step 3: 대여 정보 객체 생성 및 반환
    const rentInfo = {
      book_id : bookId,
      user_id : userId,
      rentDate: new Date(),
    };
    console.log(rentInfo);
    const updateRentTableResult = await deleteRentRecord(rentInfo);
    if (!updateRentTableResult) {
        throw new Error("Failed to update book state. Please try again.");
      }

    // Step 4: 도서 상태를 '대여중'으로 업데이트
    const updateBookStateResult = await setBookState(bookId, 'BOGAN');
    if (!updateBookStateResult) {
      throw new Error("Failed to update book state. Please try again.");
    }
    // (선택사항) 대여 정보 저장 로직 추가 가능
    // 예: await saveRentInfoToDB(rentInfo);

    return rentInfo;
  } catch (error) {
    throw new Error(`Failed to return book: ${error.message}`);
  }
};
