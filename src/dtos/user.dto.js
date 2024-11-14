// 헬퍼 함수: 생일을 Date 형식으로 변환
const formatBirth = (birthDate) => {
  return new Date(birthDate); // 공통된 birth 변환 로직
};

// 클라이언트 요청 데이터를 User 형식으로 변환 (주로 POST 요청 시 사용)
export const bodyToUser = (body) => {
  const birth = formatBirth(body.birth);

  return {
    email: body.email,
    name: body.name,
    gender: body.gender,
    birth, // 헬퍼 함수 사용
    address: body.address,
    phonenum: body.phonenum,
    preference: body.preferences, // 사용자가 선택한 음식 선호도 (선택 항목)
  };
};

// DB에서 가져온 데이터를 클라이언트 응답 형식으로 변환 (GET 요청 응답 시 사용)
export const responseFromUser = ({ user, preferences }) => {
  const preferFoods = preferences.map(
    (preference) => preference.food.name // preference.food.name으로 수정
  );

  return {
    email: user.email,
    name: user.name,
    preferCategory: preferFoods,
  };
}

export const userMissionDTO = (userId) =>{
    return parseInt(userId, 10);
};

export const userGetReviewDTO = (userId) => {
    const parsedUserId = parseInt(userId, 10);
    return parsedUserId;
};