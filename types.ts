// Fix: Import `ReactNode` to correctly type the `icon` property which holds a JSX element.
import type { ReactNode } from 'react';

export interface StyleSelection {
  clothing: boolean;
  hairstyle: boolean;
  makeup: boolean;
  glasses: boolean;
  earrings: boolean;
  necklace: boolean;
  watchBracelet: boolean;
  shoesSocks: boolean;
  hat: boolean;
  tattoo: boolean;
  handbag: boolean; // Thêm tùy chọn Túi xách
}

export interface RefinementSelection {
  hairColor: string | null;
  lipstickColor: string | null;
  sunglasses: string | null;
}

export interface SunglassOption {
  name: string;
  prompt: string;
  icon: ReactNode;
}