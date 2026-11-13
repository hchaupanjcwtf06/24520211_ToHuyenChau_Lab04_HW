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
  { name: 'Eru Chitanda', age: 19, bio: 'Watashi, kininarimasu!', imageUrl: 'https://i.pinimg.com/736x/8d/68/7c/8d687c4a0378877bc3306db315a6b579.jpg' },
  { name: 'Drake', age: 37, bio: 'Trap Soul & R&B', imageUrl: 'https://i.pinimg.com/736x/01/29/7a/01297a7a1b6eb6fbe00e572ecb42d7da.jpg' },
  { name: 'Playboi Carti', age: 28, bio: 'Vamp', imageUrl: 'https://i.pinimg.com/736x/85/6d/0a/856d0ac40292f7e77a111ed3a78942b0.jpg' }
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