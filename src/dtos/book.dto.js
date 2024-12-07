export const getBookInfoDTO = (bookId) => {
    const parsedBookId = parseInt(bookId, 10);
    return parsedBookId;
};

export const taskDoneDTO = (body)=>{
    const shelfId = body.location;
    const bookId = body.bookId;
    return {
        bookId,
        shelfId
      };
}