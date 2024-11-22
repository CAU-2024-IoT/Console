import axios from "axios";

// export const checkBookInShelf = async (shelfId, bookId) => {
//   const SHELF_BASE_URL = process.env.SHELF_BASE_URL+shelfId;
//   try {
//     const response = await axios.get(`${SHELF_BASE_URL}/books/${bookId}`);
//     console.log(response);
//     return response.data.isAvailable; // 워킹 서버의 응답 데이터 중 필요한 부분만 반환
//   } catch (error) {
//     console.error("Error communicating with working server:", error.message);
//     throw new Error("Failed to check book availability");
//   }
// };

// 책장 대여 요청을 처리하는 함수
// integrations/rent.integration.js에 정의되어 있다고 가정
export const rentRequest = async (shelfId, bookId) => {
  // 워킹 서버로 대여 요청 전송
  const SHELF_URL = process.env.SHELF_BASE_URL+'/'+shelfId;
  const response = await axios.post(`${SHELF_URL}/books/${bookId}/rent`);
  return response.data.success;
};
