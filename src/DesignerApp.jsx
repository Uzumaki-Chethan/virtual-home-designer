import { useState, useEffect, useRef } from "react";
import Workspace from "./components/Workspace";
import { motion } from 'framer-motion'; // Import motion

const FURNITURE_ASSETS = [
  { name: "Sofa", src: "/assets/furniture/Copilot_20250924_222920.png" }, { name: "Chair", src: "/assets/furniture/Copilot_20250924_211924.png" },
  { name: "Modern TV stand", src: "/assets/furniture/Copilot_20250924_210831.png" }, { name: "Book Shelf", src: "/assets/furniture/Copilot_20250924_211018.png" },
  { name: "Rug", src: "/assets/furniture/Copilot_20250924_211117.png" }, { name: "Floor Lamp", src: "/assets/furniture/Copilot_20250924_211219.png" },
  { name: "Bed", src: "/assets/furniture/Copilot_20250924_211320.png" }, { name: "Night Stand", src: "/assets/furniture/Copilot_20250924_211419.png" },
  { name: "Wide Dresser", src: "/assets/furniture/Copilot_20250924_211544.png" }, { name: "Tall Dresser", src: "/assets/furniture/Copilot_20250924_211647.png" },
  { name: "Dining Table", src: "/assets/furniture/Copilot_20250924_211755.png" }, { name: "Mirror", src: "/assets/furniture/Copilot_20250924_212219.png" },
  { name: "Frame", src: "/assets/furniture/Copilot_20250924_212345.png" },
];
const PAINT_COLORS = [
  { name: 'Red', hex: '#E53E3E' }, { name: 'Yellow', hex: '#ECC94B' }, { name: 'Blue', hex: '#4299E1' },
  { name: 'Green', hex: '#48BB78' }, { name: 'Orange', hex: '#ED8936' }, { name: 'Purple', hex: '#805AD5' },
  { name: 'Brown', hex: '#7B341E' }, { name: 'Alabaster', hex: '#F2F0E6' }, { name: 'Revere Pewter', hex: '#D0CFC8' },
  { name: 'Agreeable Gray', hex: '#D4CEC3' }, { name: 'Sea Salt', hex: '#DAE0DB' }, { name: 'Hale Navy', hex: '#4F5863' },
  { name: 'Chantilly Lace', hex: '#F6F7F2' }, { name: 'Accessible Beige', hex: '#D2C9BB' }, { name: 'Urbane Bronze', hex: '#635F5A' },
  { name: 'Iron Ore', hex: '#4E4D4A' }, { name: 'Tricorn Black', hex: '#303133' }, { name: 'Aegean Teal', hex: '#738F93' },
  { name: 'Kendall Charcoal', hex: '#696866' }, { name: 'Swiss Coffee', hex: '#DDDCD1' }, { name: 'Pale Oak', hex: '#E2DCD1' },
  { name: 'October Mist', hex: '#B5B9A9' }, { name: 'Classic Gray', hex: '#DADAD4' },
];
const PRE_WRITTEN_SUGGESTIONS = [
  "Modern Look: Paint an accent wall 'Hale Navy'. Place the 'Sofa' against it, the 'Modern TV stand' opposite, and a 'Floor Lamp' in the corner.",
  "Cozy Bedroom: Use 'Sea Salt' paint. Place the 'Bed' against the main wall with a 'Night Stand'. Add the 'Wide Dresser' and a 'Rug'.",
  // ... Add more suggestions if desired
];

// Animation for the page wrapper (Fade In/Out) - Same as HomePage
const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }
};

export default function DesignerApp() {
  const [roomImageUrl, setRoomImageUrl] = useState(null);
  const [furniture, setFurniture] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState('select');
  const [paintColor, setPaintColor] = useState(PAINT_COLORS[0].hex);
  const [wallPolygons, setWallPolygons] = useState([]);
  const [newPolygonPoints, setNewPolygonPoints] = useState([]);
  const [colorSearch, setColorSearch] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        setFurniture(furniture.filter((item) => item.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [furniture, selectedId]);

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setRoomImageUrl(URL.createObjectURL(event.target.files[0]));
      setAiSuggestion('');
      handleClearRoom(true);
    }
  };

  const getAISuggestion = () => {
    setIsLoadingSuggestion(true);
    setAiSuggestion('');
    const randomDelay = 4000 + Math.floor(Math.random() * 3001);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * PRE_WRITTEN_SUGGESTIONS.length);
      setAiSuggestion(PRE_WRITTEN_SUGGESTIONS[randomIndex]);
      setIsLoadingSuggestion(false);
    }, randomDelay);
  };

  const handleAddFurniture = (asset) => {
    const newFurniture = { id: Date.now().toString(), src: asset.src, x: 50, y: 50, width: 150, height: 150, rotation: 0, scaleX: 1 };
    setFurniture([...furniture, newFurniture]);
  };

  const handleFlipFurniture = () => {
    const updatedFurniture = furniture.map((item) => {
      if (item.id === selectedId) { return { ...item, scaleX: -item.scaleX }; }
      return item;
    });
    setFurniture(updatedFurniture);
  };

  const handleClearRoom = (keepImage = false) => {
    if (!keepImage) { setRoomImageUrl(null); }
    setFurniture([]);
    setSelectedId(null);
    setWallPolygons([]);
    setNewPolygonPoints([]);
    setAiSuggestion('');
  };

  const handleClearPaint = () => {
    setWallPolygons([]);
    setNewPolygonPoints([]);
  };

  const changeMode = (newMode) => {
    setSelectedId(null);
    setMode(newMode);
  };

  const handleExport = () => {
    if (!stageRef.current) return;
    const currentSelectedId = selectedId;
    setSelectedId(null);
    setTimeout(() => {
      try {
        const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = 'room-design.png';
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) { console.error("Failed to export canvas:", error); alert("Sorry, error exporting."); }
      finally { setSelectedId(currentSelectedId); }
    }, 100);
  };

  const filteredColors = PAINT_COLORS.filter(color => color.name.toLowerCase().includes(colorSearch.toLowerCase()));

  return (
    // --- Added motion.div wrapper ---
    <motion.div
      key="designer" // Unique key for AnimatePresence
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="h-screen w-screen flex flex-col font-sans" // Existing classes
    >
      <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold text-slate-800">Virtual Interior Designer</h1>
        <div className="flex items-center gap-4">
          {roomImageUrl && ( <button onClick={getAISuggestion} disabled={isLoadingSuggestion} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-purple-300"> {isLoadingSuggestion ? 'Thinking...' : 'Get Suggestion'} </button> )}
          {selectedId && mode === 'select' && ( <button onClick={handleFlipFurniture} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Flip Item</button> )}
          {roomImageUrl && ( <button onClick={() => handleClearRoom(false)} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Clear Room</button> )}
          {roomImageUrl && ( <button onClick={handleExport} className="bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600"> Export Design </button> )}
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Upload Room</label>
          <input id="file-upload" type="file" onChange={handleImageUpload} accept="image/*" className="hidden" />
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-slate-100 p-4 shadow-lg overflow-y-auto">
           {isLoadingSuggestion && ( <div className="mb-4 p-3 bg-white rounded-lg shadow"><p className="text-sm text-slate-600 animate-pulse">Generating suggestion...</p></div> )}
           {aiSuggestion && ( <div className="mb-4 p-3 bg-white rounded-lg shadow"> <h3 className="text-lg font-semibold text-slate-800 mb-2">Suggestion</h3> <p className="text-sm text-slate-600">{aiSuggestion}</p> </div> )}
           <h2 className="text-lg font-semibold mb-2 text-slate-800">Mode</h2>
           <div className="flex gap-2 mb-4"> <button onClick={() => changeMode('select')} className={`flex-1 p-2 rounded-md text-sm font-medium ${mode === 'select' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>Select</button> <button onClick={() => changeMode('paint')} className={`flex-1 p-2 rounded-md text-sm font-medium ${mode === 'paint' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>Paint</button> </div>
           {mode === 'paint' && ( <div> <h2 className="text-lg font-semibold mb-2 text-slate-800">Wall Colors</h2> <input type="text" placeholder="Search colors..." value={colorSearch} onChange={(e) => setColorSearch(e.target.value)} className="w-full p-2 mb-2 border rounded-md"/> <div className="grid grid-cols-3 gap-2 mb-4 h-48 overflow-y-auto pr-2"> {filteredColors.map(color => ( <div key={color.name} onClick={() => setPaintColor(color.hex)} className="cursor-pointer" title={color.name}> <div style={{ backgroundColor: color.hex }} className={`w-full h-10 rounded-md border-2 ${paintColor === color.hex ? 'border-blue-600' : 'border-slate-300'}`}></div> <p className="text-xs text-center text-slate-600">{color.name}</p> </div> ))} </div> {wallPolygons.length > 0 && ( <button onClick={handleClearPaint} className="w-full p-2 rounded-md text-sm font-medium bg-red-500 text-white mb-2">Clear All Paint</button> )} <button onClick={() => setNewPolygonPoints([])} className="w-full p-2 rounded-md text-sm font-medium bg-yellow-500 text-white mb-4">Clear Points</button> </div> )}
           <hr className="my-4"/>
           <h2 className="text-lg font-semibold mb-4 text-slate-800">Furniture</h2>
           <div className="grid grid-cols-2 gap-4"> {FURNITURE_ASSETS.map((asset) => ( <div key={asset.name} className="bg-white p-2 rounded-lg shadow cursor-pointer hover:shadow-xl transition-shadow" onClick={() => handleAddFurniture(asset)}> <img src={asset.src} alt={asset.name} className="w-full h-auto object-contain" /> <p className="text-center text-sm mt-2 text-slate-700 font-semibold">{asset.name}</p> </div> ))} </div>
        </aside>
        <Workspace
          stageRef={stageRef}
          imageUrl={roomImageUrl}
          furniture={furniture}
          setFurniture={setFurniture}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          mode={mode}
          paintColor={paintColor}
          wallPolygons={wallPolygons}
          setWallPolygons={setWallPolygons}
          newPolygonPoints={newPolygonPoints}
          setNewPolygonPoints={setNewPolygonPoints}
        />
      </main>
    </motion.div> // --- End motion.div wrapper ---
  );
}