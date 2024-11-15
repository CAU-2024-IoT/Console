import  {findBookInfo} from "../repositories/book.repository.js"
import  {BookNotFoundError} from "../errors.js"

export const getBookInfo = async (bookId) => {
    if (isNaN(bookId)){
      throw new BookNotFoundError("도서 ID 형식이 잘못되었습니다.", {"bookId" : bookId});
    }
    const bookInfo = await findBookInfo(bookId);
    if (!bookInfo) {
      throw new BookNotFoundError("도서를 찾을 수 없습니다.", {"bookId" : bookId});
    }
    return bookInfo;
};