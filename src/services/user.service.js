import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError, UserNotFoundError } from "../errors.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  checkUserExists,
  getUserMissions,
  getUserReview,
} from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }
  console.log(data.preference);
  for (const preference of data.preference) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};

export const userMission = async (userId) => {
    if (isNaN(userId)){
        throw new UserNotFoundError("사용자 ID 형식이 잘못되었습니다.", userId);
    }

    const joinUserId = await checkUserExists(userId);

    if (!joinUserId) {
      throw new UserNotFoundError("사용자를 찾을 수 없습니다.", userId);
    }

    const userMissions = await getUserMissions(userId);
    console.log(userMissions);
    return userMissions;
};

export const userGetReview = async (userId) => {
    if (isNaN(userId)){
      throw new UserNotFoundError("사용자 ID 형식이 잘못되었습니다.", userId);
    }

    const joinUserId = await checkUserExists(userId);

    if (!joinUserId) {
      throw new UserNotFoundError("사용자를 찾을 수 없습니다.", userId);
    }

    const userReviews = await getUserReview(userId);
    console.log(userReviews);
    return userReviews;
};
