import axios from "axios";

export const checkBookInShelf = async (shelfId, bookId) => {
    // 워킹 서버와 통신하여 책 존재 여부 확인
    const SHELF_URL = process.env.SHELF_BASE_URL+'/'+shelfId;
    console.log(`${SHELF_URL}/books/${bookId}`);
    try{
      const response = await axios.get(`${SHELF_URL}/books/${bookId}`);
      console.log(response.data);
      return response.data.success;
    }catch(error){
      console.log(error);
    }
    

  };