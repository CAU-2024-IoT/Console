import { setBookState } from "../repositories/book.repository.js";
import { createRentalRecord } from "../repositories/rent.repository.js";
import { getBookInfo } from "./book.service.js";
import { rentRequest } from "../integrations/rent.integration.js";
import { checkBookInShelf } from "../integrations/check.integration.js";
import { countShelves } from "../repositories/shelf.repository.js";

const findBookShelf = async (bookId, preferredShelfId) => {
  // Step 1: 선호하는 책장 먼저 확인
  if (preferredShelfId) {
    const isBookExists = await checkBookInShelf(preferredShelfId, bookId);
    console.log(isBookExists);
    if (isBookExists) {
      console.log(preferredShelfId)
      return preferredShelfId;
    }
  }

  // Step 2: 전체 책장 탐색
  const shelfNum = await countShelves();
  for (let i = 1; i <= shelfNum; i++) {
    if (i === preferredShelfId) continue; // 이미 확인한 책장은 건너뛰기
    const isBookExists = await checkBookInShelf(i, bookId);
    if (isBookExists) {
      return i;
    }
  }

  throw new Error("Book not found in any shelf.");
};

export const rentBook = async (dto) => {
  const { bookId, userId } = dto;

  try {
    // Step 1: 도서 정보 확인 및 상태 확인
    const book = await getBookInfo(bookId);
    if (book.status === 'DAEYONG') {
      throw new Error("The book is currently rented by another user.");
    }
    console.log(book);
    // Step 2: 책이 위치한 책장 탐색
    const shelfId = await findBookShelf(bookId, book.shelf_id);

    // Step 3: 책장 대여 요청
    const rentResult = await rentRequest(shelfId, bookId);
    if (!rentResult) {
      throw new Error("Failed to rent book from shelf.");
    }

    // Step 4: 도서 상태 업데이트
    await updateBookState(bookId, 'DAEYONG');

    // Step 5: 대여 기록 생성 및 반환
    const rentInfo = await createRentalRecord(bookId, userId);
    return rentInfo;

  } catch (error) {
    console.error(`Error renting book: ${error.message}`);
    throw new Error(`Failed to rent book: ${error.message}`);
  }
};

const updateBookState = async (bookId, newState) => {
  const result = await setBookState(bookId, newState);
  if (!result) {
    throw new Error(`Failed to update book state to ${newState}.`);
  }
};

