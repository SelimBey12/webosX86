import React from 'react';

export type AppId = 'terminal' | 'explorer' | 'editor' | 'emulator' | 'calculator' | 'minesweeper' | 'monitor' | 'browser' | 'settings' | 'kernel' | 'dos' | 'qemu' | 'ide' | 'hexeditor' | 'visualstudio' | 'blender' | 'minecraft' | 'update';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
  props?: any;
}

export interface AppDefinition {
  id: AppId;
  title: string;
  icon: string;
  component: React.FC<{ windowId: string; props?: any }>;
  defaultWidth: number;
  defaultHeight: number;
  resizable?: boolean;
}

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, FileNode>;
  createdAt: number;
  updatedAt: number;
}
