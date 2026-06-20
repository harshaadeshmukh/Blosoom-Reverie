import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImageBlob);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-deep/80 backdrop-blur-sm p-4">
      <div className="bg-ivory w-full max-w-lg rounded-xl overflow-hidden flex flex-col shadow-2xl animate-fade-up">
        <div className="p-4 border-b border-border-soft flex justify-between items-center bg-ivory-soft">
          <h3 className="font-playfair italic text-xl text-charcoal">Crop Photo</h3>
          <button onClick={onCancel} className="text-text-muted hover:text-charcoal transition-colors">
            ✕
          </button>
        </div>
        
        <div className="relative w-full h-[50vh] sm:h-[60vh] bg-charcoal">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 5}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
            classes={{ containerClassName: 'bg-charcoal' }}
          />
        </div>

        <div className="p-6 bg-ivory">
          <div className="mb-6 flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[2px] text-charcoal-mid">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="flex-grow accent-rose h-1 bg-[#D0B8A8] rounded-full appearance-none outline-none"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 py-3 border border-[#D0B8A8] text-charcoal text-[10px] tracking-[2px] uppercase font-inter hover:bg-ivory-soft transition-colors rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-charcoal text-ivory text-[10px] tracking-[2px] uppercase font-inter hover:bg-rose transition-colors rounded-md"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
