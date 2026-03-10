import React, { useState } from 'react';
import { Window } from '../components/Window';
import { Calculator as CalcIcon } from 'lucide-react';

export const CalculatorApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldReset, setShouldReset] = useState(false);

  const handleNum = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setShouldReset(true);
  };

  const calculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(equation + display);
      setDisplay(String(result));
      setEquation('');
      setShouldReset(true);
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const buttons = [
    ['C', '(', ')', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=', '']
  ];

  return (
    <Window id={windowId} title="Calculator" icon={<CalcIcon size={14} />} defaultWidth={300} defaultHeight={400} resizable={false}>
      <div className="flex flex-col h-full bg-zinc-900 p-4 gap-4">
        <div className="bg-zinc-800 p-4 rounded-xl flex flex-col items-end justify-end h-24 shadow-inner border border-zinc-700">
          <div className="text-zinc-500 text-sm h-5">{equation}</div>
          <div className="text-white text-3xl font-light truncate w-full text-right">{display}</div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 flex-1">
          {buttons.flat().map((btn, i) => {
            if (!btn) return <div key={i} />;
            
            const isOp = ['/', '*', '-', '+', '='].includes(btn);
            const isClear = btn === 'C';
            
            return (
              <button
                key={i}
                className={`rounded-lg text-lg font-medium transition-colors ${
                  isOp ? 'bg-orange-500 hover:bg-orange-400 text-white' :
                  isClear ? 'bg-red-500 hover:bg-red-400 text-white' :
                  'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                }`}
                onClick={() => {
                  if (isClear) clear();
                  else if (btn === '=') calculate();
                  else if (isOp) handleOp(btn);
                  else handleNum(btn);
                }}
              >
                {btn}
              </button>
            );
          })}
        </div>
      </div>
    </Window>
  );
};
