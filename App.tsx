
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

import type { StyleSelection, RefinementSelection } from './types';
import { HAIR_COLORS, LIP_COLORS, SUNGLASSES } from './constants';
import { ImageUploader } from './components/ImageUploader';
import { ColorPalette } from './components/ColorPalette';
import { AccessorySelector } from './components/AccessorySelector';
import { Checkbox } from './components/Checkbox';
import { LoadingSpinner } from './components/LoadingSpinner';

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const App: React.FC = () => {
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [styleSelection, setStyleSelection] = useState<StyleSelection>({
    hairstyle: true,
    makeup: true,
    jewelry: false,
    clothing: false,
  });

  const [refinementSelection, setRefinementSelection] = useState<RefinementSelection>({
    hairColor: null,
    lipstickColor: null,
    sunglasses: 'no sunglasses',
  });

  const styleLabels: Record<keyof StyleSelection, string> = {
    hairstyle: 'Kiểu tóc',
    makeup: 'Trang điểm',
    jewelry: 'Trang sức',
    clothing: 'Quần áo',
  };

  const handleStyleSelectionChange = (key: keyof StyleSelection) => {
    setStyleSelection((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = useCallback(async () => {
    if (!characterImage || !styleImage) {
      setError('Vui lòng tải lên cả ảnh nhân vật và ảnh mẫu.');
      return;
    }
    setError(null);
    setGeneratedImage(null);
    setIsLoading(true);
    setLoadingMessage('Đang áp dụng các phong cách ban đầu...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

      const selectedStyles = Object.entries(styleSelection)
        .filter(([, value]) => value)
        .map(([key]) => styleLabels[key as keyof StyleSelection])
        .join(', ');
      
      if (!selectedStyles) {
          setError('Vui lòng chọn ít nhất một phong cách để áp dụng.');
          setIsLoading(false);
          return;
      }

      const prompt = `Act as an expert virtual stylist. Your task is to apply specific styles from the second image (style reference) to the person in the first image (character). Apply the following styles: ${selectedStyles}. It is crucial to preserve the facial identity of the person from the first image and maintain the original background. The final output must be a high-quality, photorealistic image.`;
      
      const characterMimeType = characterImage.substring(5, characterImage.indexOf(';'));
      const characterData = characterImage.split(',')[1];
      const characterPart = { inlineData: { mimeType: characterMimeType, data: characterData } };

      const styleMimeType = styleImage.substring(5, styleImage.indexOf(';'));
      const styleData = styleImage.split(',')[1];
      const stylePart = { inlineData: { mimeType: styleMimeType, data: styleData } };
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [characterPart, stylePart, { text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
      });

      const firstPart = response.candidates?.[0]?.content?.parts[0];
      if (firstPart && firstPart.inlineData) {
        const base64Image = firstPart.inlineData.data;
        setGeneratedImage(`data:image/png;base64,${base64Image}`);
      } else {
        throw new Error('Không có hình ảnh nào được tạo. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error(err);
      setError('Tạo ảnh thất bại. Model có thể đã từ chối yêu cầu. Vui lòng kiểm tra lại ảnh và thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [characterImage, styleImage, styleSelection]);

  const handleRefine = useCallback(async () => {
    if (!generatedImage) return;

    setError(null);
    setIsLoading(true);
    setLoadingMessage('Đang tinh chỉnh diện mạo mới của bạn...');
    
    const refinements: string[] = [];
    if (refinementSelection.hairColor) {
      refinements.push(`Change the hair color to ${refinementSelection.hairColor}.`);
    }
    if (refinementSelection.lipstickColor) {
        refinements.push(`Change the lipstick color to ${refinementSelection.lipstickColor}.`);
    }
    if (refinementSelection.sunglasses && refinementSelection.sunglasses !== 'no sunglasses') {
        refinements.push(`Add ${refinementSelection.sunglasses}.`);
    } else {
        refinements.push(`Ensure the person is not wearing sunglasses.`);
    }

    if (refinements.length === 0) {
      setIsLoading(false);
      return;
    }

    const prompt = `Modify the person in this image. ${refinements.join(' ')} Preserve all other features and the background. The output must be a photorealistic image.`;
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const imagePart = { inlineData: { mimeType: 'image/png', data: generatedImage.split(',')[1] } };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const firstPart = response.candidates?.[0]?.content?.parts[0];
        if (firstPart && firstPart.inlineData) {
            const base64Image = firstPart.inlineData.data;
            setGeneratedImage(`data:image/png;base64,${base64Image}`);
        } else {
            throw new Error('Không có hình ảnh nào được tạo trong quá trình tinh chỉnh.');
        }

    } catch(err) {
        console.error(err);
        setError('Tinh chỉnh ảnh thất bại. Vui lòng thử một sự kết hợp khác.');
    } finally {
        setIsLoading(false);
    }

  }, [generatedImage, refinementSelection]);

  const handleReset = () => {
    setCharacterImage(null);
    setStyleImage(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
    setRefinementSelection({ hairColor: null, lipstickColor: null, sunglasses: 'no sunglasses' });
  };

  const isGenerateDisabled = !characterImage || !styleImage || isLoading || !Object.values(styleSelection).some(v => v);
  const isRefineDisabled = !generatedImage || isLoading || Object.values(refinementSelection).every(v => v === null || v === 'no sunglasses');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      {isLoading && <LoadingSpinner message={loadingMessage} />}
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            AI Stylist Ảo
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Tạo diện mạo mới của bạn trong vài giây.
          </p>
        </header>

        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Lỗi: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ImageUploader title="1. Tải lên ảnh nhân vật" onImageUpload={async (f) => setCharacterImage(await fileToBase64(f))} />
              <ImageUploader title="2. Tải lên ảnh mẫu" onImageUpload={async (f) => setStyleImage(await fileToBase64(f))} />
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-300">3. Chọn phong cách để áp dụng</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {(Object.keys(styleSelection) as Array<keyof StyleSelection>).map((key) => (
                    <Checkbox key={key} id={key} label={styleLabels[key]} checked={styleSelection[key]} onChange={() => handleStyleSelectionChange(key)} />
                  ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleGenerate}
                disabled={isGenerateDisabled}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                Tạo diện mạo mới
              </button>
            </div>
        </div>

        {generatedImage && (
          <div className="mt-12 pt-8 border-t border-gray-700 space-y-8">
             <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Kết quả & Tinh chỉnh</h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-gray-800/50 rounded-lg p-4 border border-gray-700 flex items-center justify-center">
                    <img src={generatedImage} alt="Generated result" className="rounded-md max-h-[70vh] w-auto shadow-2xl" />
                </div>
                <div className="lg:col-span-2 bg-gray-800/50 rounded-lg p-6 border border-gray-700 flex flex-col space-y-6">
                    <h2 className="text-2xl font-bold text-center text-purple-300">Tinh chỉnh diện mạo</h2>
                    <div>
                        <h3 className="font-semibold mb-3 text-gray-300">Màu tóc</h3>
                        <ColorPalette colors={HAIR_COLORS} selectedColor={refinementSelection.hairColor} onSelectColor={(c) => setRefinementSelection(p => ({...p, hairColor: p.hairColor === c ? null : c}))} />
                    </div>
                     <div>
                        <h3 className="font-semibold mb-3 text-gray-300">Màu son</h3>
                        <ColorPalette colors={LIP_COLORS} selectedColor={refinementSelection.lipstickColor} onSelectColor={(c) => setRefinementSelection(p => ({...p, lipstickColor: p.lipstickColor === c ? null : c}))} />
                    </div>
                    <div>
                        <h3 className="font-semibold mb-3 text-gray-300">Kính râm</h3>
                        <AccessorySelector options={SUNGLASSES} selectedOption={refinementSelection.sunglasses} onSelectOption={(prompt) => setRefinementSelection(p => ({...p, sunglasses: prompt}))} />
                    </div>
                    <div className="pt-4 space-y-4">
                         <button
                            onClick={handleRefine}
                            disabled={isRefineDisabled}
                            className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            Áp dụng tinh chỉnh
                        </button>
                        <button
                            onClick={handleReset}
                            className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-full shadow-lg transform transition-colors duration-300"
                        >
                            Bắt đầu lại
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
