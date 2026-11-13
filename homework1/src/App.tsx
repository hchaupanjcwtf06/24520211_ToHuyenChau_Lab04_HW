import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

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
  
  // Tọa độ để thẻ di chuyển theo chuột
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
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

  // Xử lý logic vuốt và lưu API
  const handleSwipeAction = (direction: 'left' | 'right') => {
    if (profiles.length === 0 || animatingDirection) return;

    setAnimatingDirection(direction);
    setStartPos(null);
    setCurrentPos(null);

    setTimeout(async () => {
      const target = profiles[0];
      const actionType = direction === 'right' ? 'LIKE' : 'PASS';
      
      setHistory((prev) => [...prev, { targetId: target._id, type: actionType }]);
      setProfiles((prev) => prev.slice(1));
      setAnimatingDirection(null);

      try {
        await fetch('http://localhost:3000/api/swipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetId: target._id, action: actionType }),
        });
      } catch (err) {
        console.error('Lỗi khi lưu swipe:', err);
      }
    }, 300);
  };

  const undoLastSwipe = () => {
    if (history.length === 0) return;
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') handleSwipeAction('left');
    if (e.key === 'ArrowRight') handleSwipeAction('right');
    if (e.key === 'Backspace') undoLastSwipe();
  };

  // Drag Physics: Bắt đầu bấm
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId); // Khóa chuột vào thẻ để kéo mượt hơn
    const pos = { x: e.clientX, y: e.clientY };
    setStartPos(pos);
    setCurrentPos(pos);
  };

  // Drag Physics: Đang kéo đi
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!startPos) return;
    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  // Drag Physics: Nhả chuột ra
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!startPos || !currentPos) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    const dx = currentPos.x - startPos.x;
    
    // Nếu kéo qua trái/phải quá 100px thì xác nhận quẹt
    if (dx > 100) {
      handleSwipeAction('right');
    } else if (dx < -100) {
      handleSwipeAction('left');
    } else {
      // Kéo chưa đủ xa thì thẻ búng về giữa
      setStartPos(null);
      setCurrentPos(null);
    }
  };

  // Tính toán tọa độ CSS Transform liên tục
  const isDragging = startPos !== null && currentPos !== null;
  const dx = isDragging ? currentPos.x - startPos.x : 0;
  const dy = isDragging ? currentPos.y - startPos.y : 0;
  const rotate = dx * 0.05; // Xoay nhẹ theo hướng kéo

  return (
    <div 
      onKeyDown={handleKeyDown} 
      tabIndex={0} 
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 outline-none select-none font-sans touch-none"
    >
      {/* Header Dark Mode */}
      <div className="w-full max-w-sm mb-6 flex justify-between items-center px-2 z-10">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400 drop-shadow-md">
          Swipe Deck
        </h1>
        <div className="bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-full shadow-lg text-sm font-bold text-slate-300">
          Score: <span className={score >= 0 ? "text-green-400" : "text-red-400"}>{score}</span>
        </div>
      </div>
      
      {/* Khung chứa Thẻ */}
      <div className="relative w-[340px] h-[520px]">
        {profiles.length > 0 ? (
          <div 
            onPointerDown={handlePointerDown} 
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            // Nếu không drag thì có transition (búng về hoặc văng ra). Khi drag thì tắt transition để mượt
            className={`absolute inset-0 w-full h-full bg-slate-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden cursor-grab active:cursor-grabbing origin-bottom border border-slate-700/50 ${
              !isDragging ? 'transition-all duration-300 ease-out' : ''
            }`}
            style={{
              transform: animatingDirection === 'right' 
                ? 'translate(150%, 0) rotate(15deg)'
                : animatingDirection === 'left'
                ? 'translate(-150%, 0) rotate(-15deg)'
                : `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`,
              opacity: animatingDirection ? 0 : 1,
            }}
          >
            {/* Cột mốc chữ LIKE / NOPE mờ ảo hiện ra khi kéo thẻ */}
            {isDragging && dx > 20 && (
              <div className="absolute top-10 left-6 border-4 border-green-400 text-green-400 text-3xl font-extrabold px-3 py-1 rounded-xl rotate-[-15deg] opacity-80 z-20 pointer-events-none">
                LIKE
              </div>
            )}
            {isDragging && dx < -20 && (
              <div className="absolute top-10 right-6 border-4 border-red-500 text-red-500 text-3xl font-extrabold px-3 py-1 rounded-xl rotate-[15deg] opacity-80 z-20 pointer-events-none">
                NOPE
              </div>
            )}

            <img 
              src={profiles[0].imageUrl || 'https://via.placeholder.com/400x600'} 
              alt="avatar" 
              className="w-full h-full object-cover pointer-events-none" 
            />
            
            <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent p-6 flex flex-col justify-end pointer-events-none">
              <h3 className="text-3xl font-bold text-white flex items-end gap-2 drop-shadow-md">
                {profiles[0].name} <span className="text-xl font-normal opacity-90">{profiles[0].age}</span>
              </h3>
              <p className="text-slate-300 mt-2 text-sm font-medium line-clamp-2 drop-shadow">{profiles[0].bio}</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-500 shadow-inner">
            <span className="text-5xl mb-4 opacity-50">👻</span>
            <p className="font-semibold tracking-wide">Hết người để quẹt rồi!</p>
          </div>
        )}
      </div>

      {/* Tinder Action Buttons (Dark Mode) */}
      <div className="flex gap-6 mt-8 justify-center items-center">
        <button 
          onClick={undoLastSwipe}
          className="w-14 h-14 bg-slate-800 text-yellow-500 border border-slate-700 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center text-2xl hover:scale-110 hover:border-yellow-500/50 hover:bg-slate-700 active:scale-95 transition-all"
        >
          ⏪
        </button>

        <button 
          onClick={() => handleSwipeAction('left')}
          className="w-16 h-16 bg-slate-800 text-red-500 border border-slate-700 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center text-3xl hover:scale-110 hover:border-red-500/50 hover:bg-slate-700 active:scale-95 transition-all"
        >
          ❌
        </button>

        <button 
          onClick={() => handleSwipeAction('right')}
          className="w-16 h-16 bg-slate-800 text-green-400 border border-slate-700 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center text-3xl hover:scale-110 hover:border-green-400/50 hover:bg-slate-700 active:scale-95 transition-all"
        >
          💚
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SwipeDeck />} />
    </Routes>
  );
}