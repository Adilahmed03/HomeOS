import { useState } from 'react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  return (
    <div className="w-full h-full bg-gray-900/95 backdrop-blur-md border border-cyan-500/20 overflow-hidden flex flex-col">
      {/* Display */}
      <div className="p-4 bg-gray-800/50">
        <div className="bg-black/80 text-cyan-300 text-right text-2xl font-mono p-4 rounded-lg mb-4 min-h-[60px] flex items-center justify-end border border-cyan-500/30 backdrop-blur-sm">
          {display}
        </div>
      </div>
      
      {/* Button Grid */}
      <div className="flex-1 p-4 pt-0">
        
        <div className="grid grid-cols-4 gap-3">
          <button onClick={clear} className="bg-gray-700/80 hover:bg-gray-600/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-gray-600/50 hover:border-cyan-500/50 transition-all duration-200">
            C
          </button>
          <button className="bg-gray-700/80 hover:bg-gray-600/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-gray-600/50 hover:border-cyan-500/50 transition-all duration-200">
            ±
          </button>
          <button className="bg-gray-700/80 hover:bg-gray-600/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-gray-600/50 hover:border-cyan-500/50 transition-all duration-200">
            %
          </button>
          <button onClick={() => inputOperation('/')} className="bg-cyan-600/80 hover:bg-cyan-500/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-cyan-500/50 hover:border-cyan-400 transition-all duration-200">
            ÷
          </button>
          
          <button onClick={() => inputNumber(7)} className="bg-gray-800/80 hover:bg-gray-700/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-gray-600/30 hover:border-gray-500 transition-all duration-200">
            7
          </button>
          <button onClick={() => inputNumber(8)} className="bg-gray-800/80 hover:bg-gray-700/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-gray-600/30 hover:border-gray-500 transition-all duration-200">
            8
          </button>
          <button onClick={() => inputNumber(9)} className="bg-gray-800/80 hover:bg-gray-700/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-gray-600/30 hover:border-gray-500 transition-all duration-200">
            9
          </button>
          <button onClick={() => inputOperation('*')} className="bg-cyan-600/80 hover:bg-cyan-500/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-cyan-500/50 hover:border-cyan-400 transition-all duration-200">
            ×
          </button>
          
          <button onClick={() => inputNumber(4)} className="bg-gray-800/80 hover:bg-gray-700/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-gray-600/30 hover:border-gray-500 transition-all duration-200">
            4
          </button>
          <button onClick={() => inputNumber(5)} className="bg-gray-800/80 hover:bg-gray-700/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-gray-600/30 hover:border-gray-500 transition-all duration-200">
            5
          </button>
          <button onClick={() => inputNumber(6)} className="bg-gray-800/80 hover:bg-gray-700/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-gray-600/30 hover:border-gray-500 transition-all duration-200">
            6
          </button>
          <button onClick={() => inputOperation('-')} className="bg-cyan-600/80 hover:bg-cyan-500/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-cyan-500/50 hover:border-cyan-400 transition-all duration-200">
            -
          </button>
          
          <button onClick={() => inputNumber(1)} className="bg-gray-800/80 hover:bg-gray-700/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-gray-600/30 hover:border-gray-500 transition-all duration-200">
            1
          </button>
          <button onClick={() => inputNumber(2)} className="bg-gray-800/80 hover:bg-gray-700/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-gray-600/30 hover:border-gray-500 transition-all duration-200">
            2
          </button>
          <button onClick={() => inputNumber(3)} className="bg-gray-800/80 hover:bg-gray-700/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-gray-600/30 hover:border-gray-500 transition-all duration-200">
            3
          </button>
          <button onClick={() => inputOperation('+')} className="bg-cyan-600/80 hover:bg-cyan-500/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-cyan-500/50 hover:border-cyan-400 transition-all duration-200">
            +
          </button>
          
          <button onClick={() => inputNumber(0)} className="bg-gray-800/80 hover:bg-gray-700/80 text-white font-bold py-3 px-4 rounded-lg text-lg col-span-2 border border-gray-600/30 hover:border-gray-500 transition-all duration-200">
            0
          </button>
          <button onClick={inputDecimal} className="bg-gray-800/80 hover:bg-gray-700/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-gray-600/30 hover:border-gray-500 transition-all duration-200">
            .
          </button>
          <button onClick={performCalculation} className="bg-green-600/80 hover:bg-green-500/80 text-white font-bold py-3 px-4 rounded-lg text-lg border border-green-500/50 hover:border-green-400 transition-all duration-200 shadow-lg shadow-green-500/20">
            =
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
