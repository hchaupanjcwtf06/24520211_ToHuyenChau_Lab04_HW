import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // React Router v7

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

function SwipeDeck() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [history, setHistory] = useState<SwipeAction[]>([]);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  
  // Trạng thái dùng để kích hoạt CSS Animation trượt thẻ
  const [animatingDirection, setAnimatingDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/profiles')
      .then((res) => res.json())
      .then((data) => setProfiles(data))
      .catch((err) => console.error('Lỗi khi tải profiles:', err));
  }, []);

  const score = history.reduce((acc, action) => {
    return action.type === 'LIKE' ? acc + 10 : acc - 5;
  }, 0);

  // Hàm xử lý vuốt CÓ ANIMATION
  const handleSwipeAction = (direction: 'left' | 'right') => {
    if (profiles.length === 0 || animatingDirection) return;

    // 1. Kích hoạt animation
    setAnimatingDirection(direction);

    // 2. Đợi 300ms cho animation chạy xong rồi mới xóa thẻ và gọi API
    setTimeout(async () => {
      const target = profiles[0];
      const actionType = direction === 'right' ? 'LIKE' : 'PASS';
      
      setHistory((prev) => [...prev, { targetId: target._id, type: actionType }]);
      setProfiles((prev) => prev.slice(1));
      setAnimatingDirection(null); // Reset trạng thái thẻ tiếp theo

      try {
        await fetch('http://localhost:3000/api/swipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetId: target._id, action: actionType }),
        });
      } catch (err) {
        console.error('Lỗi khi lưu swipe:', err);
      }
    }, 300); // 300ms khớp với duration của Tailwind CSS
  };

  const undoLastSwipe = () => {
    if (history.length === 0) return;
    setHistory((prev) => prev.slice(0, -1));
    console.log("⏪ Hoàn tác (Score Update)");
  };

  // Dual Event Handlers: Bàn phím
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') handleSwipeAction('left');
    if (e.key === 'ArrowRight') handleSwipeAction('right');
    if (e.key === 'Backspace') undoLastSwipe();
  };

  // Dual Event Handlers: Chuột
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!startPos) return;
    const dx = e.clientX - startPos.x;
    if (dx > 50) handleSwipeAction('right');
    if (dx < -50) handleSwipeAction('left');
    setStartPos(null);
  };

  return (
    <div 
      onKeyDown={handleKeyDown} 
      tabIndex={0} 
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 outline-none select-none font-sans"
    >
      {/* Header */}
      <div className="w-full max-w-sm mb-6 flex justify-between items-center px-2">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
          🔥 Swipe Deck
        </h1>
        <div className="bg-white px-4 py-1 rounded-full shadow-sm text-sm font-bold text-gray-700">
          Score: <span className={score >= 0 ? "text-green-500" : "text-red-500"}>{score}</span>
        </div>
      </div>
      
      {/* Khung chứa Thẻ */}
      <div className="relative w-80 h-[500px]">
        {profiles.length > 0 ? (
          <div 
            onPointerDown={handlePointerDown} 
            onPointerUp={handlePointerUp}
            className={`absolute inset-0 w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing transform transition-all duration-300 ease-out origin-bottom
              ${animatingDirection === 'right' ? 'translate-x-[120%] rotate-12 opacity-0' : ''}
              ${animatingDirection === 'left' ? '-translate-x-[120%] -rotate-12 opacity-0' : ''}
            `}
          >
            {/* Ảnh tràn viền */}
            <img 
              src={profiles[0].imageUrl || 'https://via.placeholder.com/400x600'} 
              alt="avatar" 
              className="w-full h-full object-cover pointer-events-none" 
            />
            
            {/* Gradient tối dần từ dưới lên để chữ nổi bật */}
            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end pointer-events-none">
              <h3 className="text-3xl font-bold text-white flex items-end gap-2">
                {profiles[0].name} <span className="text-xl font-normal opacity-90">{profiles[0].age}</span>
              </h3>
              <p className="text-gray-300 mt-2 text-sm line-clamp-2">{profiles[0].bio}</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-gray-400">
            <span className="text-5xl mb-4">👻</span>
            <p className="font-medium">Hết người để quẹt rồi!</p>
          </div>
        )}
      </div>

      {/* Tinder Action Buttons */}
      <div className="flex gap-6 mt-8 justify-center items-center">
        <button 
          onClick={undoLastSwipe}
          title="Undo (Backspace)"
          className="w-12 h-12 bg-white text-yellow-500 rounded-full shadow-lg flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-transform"
        >
          ⏪
        </button>

        <button 
          onClick={() => handleSwipeAction('left')}
          title="Pass (Left Arrow)"
          className="w-16 h-16 bg-white text-red-500 rounded-full shadow-lg flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-transform border-2 border-transparent hover:border-red-100"
        >
          ❌
        </button>

        <button 
          onClick={() => handleSwipeAction('right')}
          title="Like (Right Arrow)"
          className="w-16 h-16 bg-white text-green-500 rounded-full shadow-lg flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-transform border-2 border-transparent hover:border-green-100"
        >
          💚
        </button>
      </div>
    </div>
  );
}

// --- App Layout Root ---
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SwipeDeck />} />
    </Routes>
  );
}