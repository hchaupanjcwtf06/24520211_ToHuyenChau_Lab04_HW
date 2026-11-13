import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router'; // React Router v7

// --- Định nghĩa Type/Interface (TypeScript) ---
interface Profile {
  _id: string;
  name: string;
  age?: number;
  bio?: string;
  imageUrl?: string;
}

interface SwipeAction {
  targetId: string;
  type: 'LIKE' | 'PASS';
}

// --- Component Chính: Swipe Deck ---
function SwipeDeck() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [history, setHistory] = useState<SwipeAction[]>([]); // LIFO Undo Stack
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  // T14: Fetch dữ liệu thật từ Backend Express
  useEffect(() => {
    fetch('http://localhost:3000/api/profiles')
      .then((res) => res.json())
      .then((data) => setProfiles(data))
      .catch((err) => console.error('Lỗi khi tải profiles:', err));
  }, []);

  // T17: Pure Derived State tính Asymmetric Score
  const score = history.reduce((acc, action) => {
    return action.type === 'LIKE' ? acc + 10 : acc - 5;
  }, 0);

  // T15: Hàm xử lý hành động Quẹt (Vuốt)
  const swipe = async (direction: 'left' | 'right' | 'up') => {
    if (profiles.length === 0) return;
    
    const target = profiles[0];
    const actionType = direction === 'right' ? 'LIKE' : 'PASS';
    
    // Ghi nhận vào LIFO Stack cục bộ
    setHistory((prev) => [...prev, { targetId: target._id, type: actionType }]);
    setProfiles((prev) => prev.slice(1)); // Cập nhật UI ngay lập tức (Optimistic UI)

    // Gọi API lưu xuống Database
    try {
      await fetch('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: target._id, action: actionType }),
      });
    } catch (err) {
      console.error('Lỗi khi lưu swipe:', err);
    }
  };

  // T16: LIFO Undo Stack (Hoàn tác)
  const undoLastSwipe = () => {
    if (history.length === 0) return;
    setHistory((prev) => prev.slice(0, -1));
    console.log("Hoàn tác thao tác cuối cùng!");
  };

  // Dual Event Handlers: Bàn phím
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') swipe('left');
    if (e.key === 'ArrowRight') swipe('right');
    if (e.key === 'ArrowUp') swipe('up');
    if (e.key === 'Backspace') undoLastSwipe();
  };

  // Dual Event Handlers: Chuột / Cảm ứng
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!startPos) return;
    const dx = e.clientX - startPos.x;
    if (dx > 50) swipe('right');
    if (dx < -50) swipe('left');
    setStartPos(null);
  };

  return (
    <div 
      onKeyDown={handleKeyDown} 
      tabIndex={0} 
      className="min-h-screen flex flex-col items-center justify-center p-8 outline-none text-center bg-gray-50"
    >
      <h1 className="text-3xl font-bold mb-2">Hẹn Hò Nhưng Không Yêu</h1>
      <h2 className="text-xl mb-6 font-semibold text-red-500">
        Điểm nỗ lực (Derived State): {score}
      </h2>
      
      <div 
        onPointerDown={handlePointerDown} 
        onPointerUp={handlePointerUp}
        className="w-72 h-[400px] bg-white shadow-xl border border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing mb-6 select-none touch-none relative overflow-hidden"
      >
        {profiles.length > 0 ? (
          <div className="p-4 pointer-events-none">
            {profiles[0].imageUrl ? (
              <img src={profiles[0].imageUrl} alt="avatar" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">No Image</div>
            )}
            <h3 className="text-2xl font-bold">{profiles[0].name || "Ẩn danh"}</h3>
            <p className="text-gray-500 mt-2 text-sm">Vuốt chuột hoặc dùng phím ⬅️ ➡️</p>
          </div>
        ) : (
          <p className="text-gray-500 font-medium">Hết người để quẹt!</p>
        )}
      </div>

      <div className="flex gap-4 text-xs font-medium text-gray-600 bg-gray-200 px-4 py-2 rounded-full">
        <span>⬅️ PASS (Trái)</span>
        <span>➡️ LIKE (Phải)</span>
        <span>⌫ UNDO (Backspace)</span>
      </div>
    </div>
  );
}

// --- App Layout Root ---
export default function App() {
  return (
    // React Router v7 layout
    <Routes>
      <Route path="/" element={<SwipeDeck />} />
    </Routes>
  );
}