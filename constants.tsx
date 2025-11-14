
import React from 'react';
import type { SunglassOption } from './types';

export const HAIR_COLORS: string[] = [
  '#000000', '#2C1608', '#4E342E', '#D7CCC8', '#FFECB3', 
  '#E65100', '#BF360C', '#B71C1C', '#4A148C', '#311B92',
  '#1A237E', '#0D47A1', '#01579B', '#006064', '#004D40',
  '#1B5E20', '#F57F17', '#FF6F00', '#E91E63', '#9C27B0'
];

export const LIP_COLORS: string[] = [
  '#D50000', '#C51162', '#AA00FF', '#6200EA', '#B01212',
  '#E05D5D', '#F48FB1', '#CE93D8', '#FF4081', '#FF5252',
  '#FF7999', '#D93059', '#B73E3E', '#912B2B', '#791E1E'
];

export const SUNGLASSES: SunglassOption[] = [
    { name: 'Không đeo', prompt: 'no sunglasses', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" /> },
    { name: 'Phi công', prompt: 'classic aviator sunglasses', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H13.5V4.5H10.5V1.5Z M3 7.5L4.5 12H19.5L21 7.5" /> },
    { name: 'Wayfarer', prompt: 'classic wayfarer sunglasses', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L6 7.5H18L21 10.5V13.5H3V10.5Z" /> },
    { name: 'Tròn', prompt: 'round John Lennon style sunglasses', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5C8.5 10.29 10.29 8.5 12.5 8.5C14.71 8.5 16.5 10.29 16.5 12.5C16.5 14.71 14.71 16.5 12.5 16.5C10.29 16.5 8.5 14.71 8.5 12.5Z M3 12.5C3 10.29 4.79 8.5 7 8.5 M18 8.5C20.21 8.5 22 10.29 22 12.5" /> },
];
