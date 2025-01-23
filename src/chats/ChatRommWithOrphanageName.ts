interface ChatRoomWithOrphanageName {
  chat_room_id: string;
  user: {
    user_id: string;
    name: string;
    email: string;
    age: number;
    sex: string;
    nickname: string;
    region: string;
    phone_number: string;
    profile_photo: string;
  };
  orphanage_user: {
    orphanage_user_id: string;
    name: string;
    email: string;
    orphanage_name: string; // orphanage_name 추가
  };
}
