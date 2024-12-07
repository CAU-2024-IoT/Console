import axios from "axios";

export const returnToShelf = async (shelfId, bookId) => {
  const SHELF_URL = process.env.SHELF_BASE_URL+'/'+shelfId;
  console.log(`${SHELF_URL}/books/${bookId}`);
  
  const response = await axios.get(`${SHELF_URL}/books/${bookId}/return`); /* to do /return 추가, post로 교체 */
  return response.data.success;
};
