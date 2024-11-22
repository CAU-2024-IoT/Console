import { setBookState } from "../repositories/book.repository.js";
import { createRentalRecord } from "../repositories/rent.repository.js";
import { getBookInfo } from "./book.service.js";
import { rentRequest } from "../integrations/rent.integration.js";
import { checkBookInShelf } from "../integrations/check.integration.js";
import { countShelves } from "../repositories/shelf.repository.js";

// export const rentBook = async (dto) => {
//   const { bookId, userId } = dto;
//   let shelfId = null;

//   try {
//     // Step 1: 해당 도서가 존재하는지 확인
//     const book = await getBookInfo(bookId);

//     // Step 2: 도서가 대여 가능한 상태인지 확인
//     if (book.status === 'DAEYONG') {
//       throw new Error("The book is currently rented by another user.");
//     }

//     // Step 3: 책이 존재할 확률이 높은 책장을 먼저 확인
//     if (book.shelf_id) {
//       const isBookExists = await checkBookInShelf(book.shelf_id, book.bookId);
//       if (isBookExists) {
//         shelfId = book.shelf_id;
//       }
//     }

//     // Step 4: 존재하지 않을 경우 전체 책장 탐색
//     if (!shelfId) {
//       const shelfNum = await countShelves();
//       for (let i = 1; i <= shelfNum; i++) {
//         if (i === book.shelf_id) continue; // 이미 확인한 shelf_id는 건너뛰기
//         const isBookExists = await checkBookInShelf(i, book.bookId);
//         if (isBookExists) {
//           shelfId = i;
//           break;
//         }
//       }
//     }

//     // Step 5: 책장이 확인되지 않았을 경우 에러 처리
//     if (!shelfId) {
//       throw new Error("Book not found in any shelf.");
//     }

//     // Step 6: 책장에게 대여 요청
//     const rentResult = await rentRequest(shelfId, book.bookId);
//     if (!rentResult) {
//       throw new Error("Failed to rent book from shelf.");
//     }

//     // Step 7: 도서 상태를 '대여중'으로 업데이트
//     const updateBookStateResult = await setBookState(bookId, 'DAEYONG');
//     if (!updateBookStateResult) {
//       throw new Error("Failed to update book state. Please try again.");
//     }

//     // Step 8: 대여 정보 생성 및 저장
//     const rentInfo = {
//       book_id: bookId,
//       user_id: userId,
//       rentDate: new Date(),
//       status: '대여중',
//     };

//     const updateRentTableResult = await createRentRecord(rentInfo);
//     if (!updateRentTableResult) {
//       throw new Error("Failed to create rent record. Please try again.");
//     }

//     // Step 9: 최종 결과 반환
//     return rentInfo;

//   } catch (error) {
//     console.error(`Error renting book: ${error.message}`);
//     throw new Error(`Failed to rent book: ${error.message}`);
//   }
// };


const findBookShelf = async (bookId, preferredShelfId) => {
  // Step 1: 선호하는 책장 먼저 확인
  if (preferredShelfId) {
    const isBookExists = await checkBookInShelf(preferredShelfId, bookId);
    if (isBookExists) {
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

    // Step 2: 책이 위치한 책장 탐색
    const shelfId = await findBookShelf(book.bookId, book.shelf_id);

    // Step 3: 책장 대여 요청
    const rentResult = await rentRequest(shelfId, book.bookId);
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

