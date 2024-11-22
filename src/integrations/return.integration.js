import axios from "axios";

export const returnToShelf = async (shelfId, bookId) => {
  const response = await axios.post(`/api/v1/shelves/${shelfId}/books/${bookId}/return`);
  return response.data.success;
};
