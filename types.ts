// Fix: Import `ReactNode` to correctly type the `icon` property which holds a JSX element.
import type { ReactNode } from 'react';

export interface StyleSelection {
  hairstyle: boolean;
  makeup: boolean;
  jewelry: boolean;
  clothing: boolean;
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
