import React, { useState, useEffect, useRef } from 'react';

const FALLBACK_NFTS = [
  {
    id: 'nft-1',
    title: 'Bored Ape Yacht #4812',
    description: 'A ultra-rare digital collectable Bored Ape featuring laser vision, gold cybernetic fur, and a nautical captain hat.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'nft-2',
    title: 'CyberPunk Runner #9921',
    description: 'Futuristic neon punk character with holographic neural visors and augmented street wear, minted on Ethereum.',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'nft-3',
    title: 'Ether Castle #104',
    description: 'A masterpiece of generative voxel architecture representing a floating crystal fortress in the Ethereum metaverse.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'nft-4',
    title: 'Abstract Genesis',
    description: 'An intricate neural-network visual representation exploring machine consciousness and algorithmic creativity.',
    image: 'https://images.unsplash.com/photo-1644016825042-4fcf138f6572?auto=format&fit=crop&w=800&q=80'
  }
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function PhotoViewer() {
  const [nfts, setNfts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Viewport adjustment states
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const slideshowIntervalRef = useRef(null);

  // Fetch NFTs from API
  useEffect(() => {
    fetch(`${API_URL}/api/gallery`)
      .then((res) => {
        if (!res.ok) throw new Error('API connection refused');
        return res.json();
      })
      .then((data) => {
        const list = data.data || data;
        const normalized = (Array.isArray(list) ? list : []).map((item) => ({
          id: item.id || item.ID || item.guid,
          title: item.title || item.Title || 'Untitled NFT',
          description: item.description || item.Description || 'No description provided.',
          image: item.image || item.Image || item.image_url || item.ImageUrl || ''
        }));
        
        if (normalized.length === 0) {
          setNfts(FALLBACK_NFTS);
        } else {
          setNfts(normalized);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn('Backend database not reachable. Falling back to default NFT collection.', error);
        setNfts(FALLBACK_NFTS);
        setIsLoading(false);
      });
  }, []);

  // Handle slideshow mode
  useEffect(() => {
    if (isSlideshowActive) {
      slideshowIntervalRef.current = setInterval(() => {
        handleNext();
      }, 3000);
    } else {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
      }
    }

    return () => {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
      }
    };
  }, [isSlideshowActive, nfts.length]);

  const handlePrev = () => {
    resetTransformations();
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? nfts.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    resetTransformations();
    setCurrentIndex((prevIndex) => (prevIndex === nfts.length - 1 ? 0 : prevIndex + 1));
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.25, 4));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.25, 0.25));
  };

  const handleActualSize = () => {
    setZoom(1);
  };

  const handleBestFit = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  const resetTransformations = () => {
    setZoom(1);
    setRotation(0);
  };

  const toggleSlideshow = () => {
    setIsSlideshowActive((prev) => !prev);
  };

  const toggleInfo = () => {
    setShowInfo((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="pv-loading" style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <div>Loading Gallery...</div>
      </div>
    );
  }

  const activeNft = nfts[currentIndex] || FALLBACK_NFTS[0];

  return (
    <div className="pv-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: '#f0f0f0', position: 'relative' }}>
      
      {/* File Header Status (Emulating XP Picture and Fax Viewer top bar) */}
      <div className="pv-header-status" style={{ padding: '6px 12px', background: '#ece9d8', borderBottom: '1px solid #aca899', fontSize: '11px', display: 'flex', justifyContent: 'space-between', color: '#000' }}>
        <span>🖼️ {activeNft.title}</span>
        <span>{currentIndex + 1} of {nfts.length}</span>
      </div>

      {/* Main Viewport Container */}
      <div className="pv-viewport" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', background: '#9f9f9f', padding: '16px' }}>
        
        {/* The Checkerboard Canvas (Classic Transparent Grid) */}
        <div 
          className="pv-canvas"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(45deg, #bbb 25%, transparent 25%), linear-gradient(-45deg, #bbb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #bbb 75%), linear-gradient(-45deg, transparent 75%, #bbb 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            opacity: 0.15
          }}
        />

        {/* Display Active Image */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '100%', maxHeight: '100%' }}>
          <img
            src={activeNft.image}
            alt={activeNft.title}
            className="pv-image"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s cubic-bezier(0.1, 0.8, 0.25, 1)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              backgroundColor: '#fff',
              border: '1px solid #000'
            }}
          />
        </div>

        {/* Overlay Navigation Arrows */}
        <button 
          onClick={handlePrev}
          className="pv-nav-arrow left"
          style={{
            position: 'absolute', left: '12px', zIndex: 10,
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(236, 233, 216, 0.7)', border: '1px solid #aca899',
            fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', outline: 'none', transition: 'all 0.15s ease'
          }}
        >
          ◀
        </button>
        <button 
          onClick={handleNext}
          className="pv-nav-arrow right"
          style={{
            position: 'absolute', right: '12px', zIndex: 10,
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(236, 233, 216, 0.7)', border: '1px solid #aca899',
            fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', outline: 'none', transition: 'all 0.15s ease'
          }}
        >
          ▶
        </button>
      </div>

      {/* Info Panel: NFT Details Strip */}
      {showInfo && (
        <div className="pv-info-panel" style={{ background: 'rgba(255, 255, 255, 0.95)', borderTop: '1px solid #aca899', padding: '12px 16px', color: '#000', zIndex: 5, boxSizing: 'border-box' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '13px', color: '#003399', fontWeight: 'bold' }}>{activeNft.title}</h3>
          <p style={{ margin: 0, fontSize: '11px', lineHeight: '1.4', color: '#333' }}>{activeNft.description}</p>
        </div>
      )}

      {/* Bottom Tool-strip Bar (Emulating the classic XP blue-circle buttons) */}
      <div className="pv-toolbar" style={{ background: '#ece9d8', borderTop: '1px solid #aca899', padding: '8px 12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', zIndex: 10, flexShrink: 0 }}>
        
        <button onClick={handlePrev} title="Previous Image" className="pv-btn">◀</button>
        <button onClick={handleNext} title="Next Image" className="pv-btn">▶</button>
        
        <div style={{ width: '1px', height: '18px', background: '#aca899', margin: '0 4px' }} />

        <button onClick={toggleSlideshow} className={`pv-btn ${isSlideshowActive ? 'active' : ''}`} title={isSlideshowActive ? 'Stop Slideshow' : 'Start Slideshow'}>
          {isSlideshowActive ? '⏸️' : '▶️'}
        </button>

        <div style={{ width: '1px', height: '18px', background: '#aca899', margin: '0 4px' }} />

        <button onClick={handleZoomIn} title="Zoom In" className="pv-btn">🔍+</button>
        <button onClick={handleZoomOut} title="Zoom Out" className="pv-btn">🔍-</button>
        <button onClick={handleBestFit} title="Fit to Window" className="pv-btn">📺</button>
        <button onClick={handleActualSize} title="Actual Size" className="pv-btn">1️⃣</button>

        <div style={{ width: '1px', height: '18px', background: '#aca899', margin: '0 4px' }} />

        <button onClick={handleRotateLeft} title="Rotate Counter-Clockwise" className="pv-btn">↺</button>
        <button onClick={handleRotateRight} title="Rotate Clockwise" className="pv-btn">↻</button>
        
        <div style={{ width: '1px', height: '18px', background: '#aca899', margin: '0 4px' }} />

        <button onClick={toggleInfo} className={`pv-btn ${showInfo ? 'active' : ''}`} title="Toggle Info Description">
          ℹ️
        </button>

      </div>
    </div>
  );
}

export default PhotoViewer;
