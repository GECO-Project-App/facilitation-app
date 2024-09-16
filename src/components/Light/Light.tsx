'use client'
import {Lamp} from '@/components/icons/lamp';
import { useState } from 'react';
export const Light = () => {
    const [isOn , setIsOn] = useState('white');
  return (
    <div
  className="shaking cursor-pointer"
  onMouseEnter={() => {
    setIsOn('yellow');
  }}
  onMouseLeave={() => {
    setIsOn('white');
  }}>
  <Lamp fill={isOn}/>
</div>
  );
};
