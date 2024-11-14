import { StoreNotFoundError } from "../errors.js";
import {
  setReview,
  setImage
} from "../repositories/review.repository.js";

export const addReview = async (data) => {
  const joinReviewId = await setReview({
    user_id: data.user_id,
    store_id: data.store_id,
    content: data.content,
    rating: data.rating,
    images: data.images,
  });

  if (joinReviewId === null){
    throw new StoreNotFoundError("존재하지 않는 식당입니다.");
  }

  if (Array.isArray(data.images) && data.images.length > 0) {
    for (const image of data.images) {
      await setImage(joinReviewId, image);
    }
  }
};