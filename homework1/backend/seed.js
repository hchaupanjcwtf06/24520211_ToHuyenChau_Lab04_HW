require('dotenv').config();
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: String,
  age: Number,
  bio: String,
  imageUrl: String
});
const Profile = mongoose.model('Profile', profileSchema);

const mockProfiles = [
  {
    name: 'LeBron Jame',
    age: 39,
    bio: 'Ném rổ 3 điểm lúc 2 giờ sáng, hỏi "Are you my sunshine?" khi đang kéo trận ranked thua 0-12.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR_EdN1Dm3aeXbIQAk35elJ-HL0A04O-MGpzU9ZaSNxlNI9uD9yiPHSAs&s=10',
  },
  {
    name: 'Don Pollo',
    age: 21,
    bio: 'Guli guli wacha lingan gu — giao tiếp 100% bằng âm thanh meme, nghe xong tự động lắc đầu theo nhịp.',
    imageUrl: 'https://i1.sndcdn.com/artworks-HLlqmQQ3FERlTeGb-dHzC8A-t500x500.jpg',
  },
  {
    name: 'Joker',
    age: 20,
    bio: 'Deadline 15 phút nữa nộp nhưng tay vẫn đút túi quần, cười nhẹ vì đã bật chế độ không quan tâm.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnw-7m75otlKNIP5msF6RTL6n7z_c_ThaXA5pDlob_otaG2lZWeNsrQAA&s=10',
  },
  {
    name: 'Tung Tung Sahur',
    age: 24,
    bio: 'Gõ trống đánh thức lúc 4h sáng nhưng ngủ quên mất, chuyên gia trễ giờ nhưng vẫn đến đúng lúc ăn.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Full_image_of_Tung_Tung_Tung_Sahur.png?utm_source=vi.wikipedia.org&utm_campaign=index&utm_content=original',
  },
  {
    name: 'Nguyen 67',
    age: 27,
    bio: 'SIX SEVENNNNNNNN',
    imageUrl: 'https://i.scdn.co/image/ab67616d00001e020ae65b71845f81b1814813f7',
  },
  {
    name: 'Sigma Boy',
    age: 19,
    bio: 'Im lặng uống nước lọc, nhìn xa xăm qua cửa sổ khi đồng đội đang gõ phím chửi nhau trong chat tổng.',
    imageUrl: 'https://gocanhnam.com/wp-content/uploads/2026/01/Hinh-Anh-Sigma-Boy-26-1.jpg',
  },
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Profile.deleteMany({}); // Xóa sạch data cũ để tránh trùng lặp
    await Profile.insertMany(mockProfiles); // Nạp 3 profile mới
    console.log(`✅ Đã nạp thành công ${mockProfiles.length} profile mẫu!`);
    process.exit();
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

seedData();