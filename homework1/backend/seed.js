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

];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Profile.deleteMany({}); // Xóa sạch data cũ để tránh trùng lặp
    await Profile.insertMany(mockProfiles); // Nạp 3 profile mới
    console.log('✅ Đã nạp thành công 3 profile mẫu!');
    process.exit();
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

seedData();