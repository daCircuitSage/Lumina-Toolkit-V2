/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themeOptions = [
    {
      id: 'light' as const,
      name: 'Light',
      description: 'Clean and bright interface',
      icon: Sun,
    },
    {
      id: 'dark' as const,
      name: 'Dark',
      description: 'Easy on the eyes',
      icon: Moon,
    },
    {
      id: 'system' as const,
      name: 'System',
      description: 'Follows your device preference',
      icon: Monitor,
    },
  ];

  return (
    <div className="tool-container">
      <div className="max-w-2xl">
        <h1 className="display-md mb-2">Settings</h1>
        <p className="body-md text-body mb-8">Customize your Lumina Toolkit experience</p>

        {/* Theme Selection Section */}
        <div className="card-content mb-8">
          <h2 className="display-sm mb-6">Appearance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => setTheme(option.id)}
                  className={`
                    relative p-6 rounded-xl border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-primary bg-primary/10' 
                      : 'border-hairline bg-canvas-soft hover:border-primary/50'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check size={14} className="text-on-primary" />
                      </div>
                    </div>
                  )}
                  
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-4
                    ${isSelected ? 'bg-primary' : 'bg-canvas'}
                  `}>
                    <Icon size={24} className={isSelected ? 'text-on-primary' : 'text-ink'} />
                  </div>
                  
                  <h3 className="body-md-strong mb-1 text-left">{option.name}</h3>
                  <p className="body-sm text-body text-left">{option.description}</p>
                  
                  {option.id === 'system' && (
                    <div className="mt-3 pt-3 border-t border-hairline">
                      <p className="caption text-mute text-left">
                        Currently: {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme Preview Section */}
        <div className="card-content">
          <h2 className="display-sm mb-6">Theme Preview</h2>
          
          <div className="space-y-4">
            {/* Preview Card */}
            <div className="p-4 rounded-xl bg-canvas-soft border border-hairline">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-on-primary font-semibold">L</span>
                </div>
                <div>
                  <h3 className="body-md-strong">Sample Card</h3>
                  <p className="body-sm text-body">This is how content looks</p>
                </div>
              </div>
              <p className="body-md mb-3">
                This is sample text to demonstrate how the theme affects readability and contrast.
              </p>
              <div className="flex gap-2">
                <button className="button-primary">Primary Button</button>
                <button className="button-secondary">Secondary</button>
              </div>
            </div>

            {/* Color Palette Preview */}
            <div className="p-4 rounded-xl bg-canvas-soft border border-hairline">
              <h3 className="body-md-strong mb-3">Color Palette</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <div className="w-full h-12 rounded-lg bg-primary"></div>
                  <p className="caption text-mute">Primary</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-12 rounded-lg bg-positive"></div>
                  <p className="caption text-mute">Positive</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-12 rounded-lg bg-warning"></div>
                  <p className="caption text-mute">Warning</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-12 rounded-lg bg-negative"></div>
                  <p className="caption text-mute">Negative</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-4 rounded-xl bg-canvas-soft border border-hairline">
          <p className="body-sm text-body">
            <strong className="text-ink">Tip:</strong> Your theme preference is saved locally and will persist across browser sessions.
          </p>
        </div>
      </div>
    </div>
  );
}
