
import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  title: string;
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center flex flex-col justify-between h-full">
      <h3 className="text-xl font-bold mb-4 text-purple-300">{title}</h3>
      <div
        className="flex-grow aspect-w-1 aspect-h-1 bg-gray-700/50 rounded-md cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors duration-300 overflow-hidden"
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg"
        />
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="object-cover h-full w-full" />
        ) : (
          <div className="text-gray-400 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Nhấn để tải ảnh lên</p>
          </div>
        )}
      </div>
    </div>
  );
};
