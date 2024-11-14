export const bodyToReview = (body) => {
  return {
    user_id: body.userId,
    store_id: body.storeId,
    content: body.content,
    rating: body.rating,
    images: body.images,
  };
};

/*
"user_id": 1,
"store_id": 1,
"content": "이 가게는 정말 좋았습니다. 다시 방문하고 싶어요!",
"evaluation": 5
"images":["image_url_1", "image_url_2"]
 */