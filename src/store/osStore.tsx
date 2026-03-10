import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { WindowState, AppId } from '../types';

interface OSState {
  windows: WindowState[];
  focusedWindowId: string | null;
  startMenuOpen: boolean;
  wallpaper: string;
  contextMenu: { x: number, y: number, type: string, context?: any } | null;
  isBSOD: boolean;
}

type OSAction =
  | { type: 'OPEN_APP'; appId: AppId; props?: any }
  | { type: 'CLOSE_WINDOW'; id: string }
  | { type: 'FOCUS_WINDOW'; id: string }
  | { type: 'MINIMIZE_WINDOW'; id: string }
  | { type: 'MAXIMIZE_WINDOW'; id: string }
  | { type: 'RESTORE_WINDOW'; id: string }
  | { type: 'UPDATE_WINDOW'; id: string; updates: Partial<WindowState> }
  | { type: 'TOGGLE_START_MENU' }
  | { type: 'CLOSE_START_MENU' }
  | { type: 'SET_WALLPAPER'; url: string }
  | { type: 'OPEN_CONTEXT_MENU'; payload: { x: number, y: number, type: string, context?: any } }
  | { type: 'CLOSE_CONTEXT_MENU' }
  | { type: 'TRIGGER_BSOD' };

const initialState: OSState = {
  windows: [],
  focusedWindowId: null,
  startMenuOpen: false,
  wallpaper: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
  contextMenu: null,
  isBSOD: false,
};

const osReducer = (state: OSState, action: OSAction): OSState => {
  switch (action.type) {
    case 'TRIGGER_BSOD':
      return { ...state, isBSOD: true };
    case 'OPEN_APP': {
      const id = `win_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const maxZ = Math.max(0, ...state.windows.map(w => w.zIndex));
      
      // We will populate default width/height/title in the component that dispatches this,
      // or we can just set some defaults here and let the Window component adjust.
      const newWindow: WindowState = {
        id,
        appId: action.appId,
        title: action.appId, // Will be overridden
        icon: '', // Will be overridden
        x: 50 + (state.windows.length * 20) % 200,
        y: 50 + (state.windows.length * 20) % 200,
        width: 800,
        height: 600,
        isMaximized: false,
        isMinimized: false,
        zIndex: maxZ + 1,
        props: action.props,
      };
      return {
        ...state,
        windows: [...state.windows, newWindow],
        focusedWindowId: id,
        startMenuOpen: false,
        contextMenu: null,
      };
    }
    case 'CLOSE_WINDOW':
      return {
        ...state,
        windows: state.windows.filter(w => w.id !== action.id),
        focusedWindowId: state.focusedWindowId === action.id 
          ? (state.windows.length > 1 ? state.windows[state.windows.length - 2].id : null) 
          : state.focusedWindowId
      };
    case 'FOCUS_WINDOW': {
      if (state.focusedWindowId === action.id) return { ...state, startMenuOpen: false, contextMenu: null };
      const maxZ = Math.max(0, ...state.windows.map(w => w.zIndex));
      return {
        ...state,
        windows: state.windows.map(w => 
          w.id === action.id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w
        ),
        focusedWindowId: action.id,
        startMenuOpen: false,
        contextMenu: null,
      };
    }
    case 'MINIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w => w.id === action.id ? { ...w, isMinimized: true } : w),
        focusedWindowId: state.focusedWindowId === action.id ? null : state.focusedWindowId
      };
    case 'MAXIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w => w.id === action.id ? { ...w, isMaximized: true, isMinimized: false } : w),
        focusedWindowId: action.id
      };
    case 'RESTORE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w => w.id === action.id ? { ...w, isMaximized: false, isMinimized: false } : w),
        focusedWindowId: action.id
      };
    case 'UPDATE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w => w.id === action.id ? { ...w, ...action.updates } : w)
      };
    case 'TOGGLE_START_MENU':
      return { ...state, startMenuOpen: !state.startMenuOpen, contextMenu: null };
    case 'CLOSE_START_MENU':
      return { ...state, startMenuOpen: false };
    case 'SET_WALLPAPER':
      return { ...state, wallpaper: action.url };
    case 'OPEN_CONTEXT_MENU':
      return { ...state, contextMenu: action.payload, startMenuOpen: false };
    case 'CLOSE_CONTEXT_MENU':
      return { ...state, contextMenu: null };
    default:
      return state;
  }
};

const OSContext = createContext<{
  state: OSState;
  dispatch: React.Dispatch<OSAction>;
} | null>(null);

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(osReducer, initialState);

  // Close start menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.start-menu') && !target.closest('.start-button')) {
        dispatch({ type: 'CLOSE_START_MENU' });
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <OSContext.Provider value={{ state, dispatch }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error('useOS must be used within OSProvider');
  return context;
};
