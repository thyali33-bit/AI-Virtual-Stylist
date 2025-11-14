
import React, { useState, useRef } from 'react';

// Component Modal để hiển thị ảnh kích thước đầy đủ
const FullSizeImageModal: React.FC<{ imageUrl: string; onClose: () => void }> = ({ imageUrl, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
    <div className="relative max-w-full max-h-full">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 z-10"
        aria-label="Close image viewer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img src={imageUrl} alt="Full size preview" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-xl" />
    </div>
  </div>
);

interface ImageUploaderProps {
  title: string;
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showFullSizeImage, setShowFullSizeImage] = useState<boolean>(false); // State để điều khiển modal
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    // Chỉ kích hoạt input file nếu chưa có ảnh hoặc người dùng muốn thay đổi ảnh
    if (!imagePreview) {
      fileInputRef.current?.click();
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Ngăn chặn sự kiện click lan truyền đến button zoom
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'IMG' || (e.target as HTMLElement).classList.contains('text-gray-400')) {
      handleClick();
    }
  };


  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center flex flex-col items-center">
      <h3 className="text-xl font-bold mb-4 text-purple-300">{title}</h3>
      <div
        className="relative w-64 h-96 bg-gray-700/50 rounded-md cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors duration-300 overflow-hidden"
        onClick={handleContainerClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg"
        />
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Preview" className="object-contain h-full w-full" />
            {/* Biểu tượng zoom */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowFullSizeImage(true); }} // Ngăn chặn sự kiện click lan truyền
              className="absolute bottom-2 right-2 p-2 bg-gray-800/70 text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
              aria-label="View full size image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-gray-400 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Nhấn để tải ảnh lên</p>
          </div>
        )}
      </div>

      {showFullSizeImage && imagePreview && (
        <FullSizeImageModal imageUrl={imagePreview} onClose={() => setShowFullSizeImage(false)} />
      )}
    </div>
  );
};
