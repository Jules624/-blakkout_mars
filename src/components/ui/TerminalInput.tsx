import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface TerminalInputProps {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Function called when a valid answer is submitted */
  onValidSubmit?: (value: string) => void;
  /** Function to validate the input value */
  validateInput?: (value: string) => boolean;
  /** Expected solution for automatic validation */
  expectedSolution?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
  /** Error message to display */
  errorMessage?: string;
  /** Success message to display */
  successMessage?: string;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  placeholder = "Enter your answer...",
  onValidSubmit,
  validateInput,
  expectedSolution,
  disabled = false,
  className,
  ariaLabel,
  errorMessage = "Incorrect answer",
  successMessage = "Correct!"
}) => {
  const [value, setValue] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [isValidating, setIsValidating] = useState<boolean>(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset status after error display
  const resetStatus = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setStatus('idle');
    }, 2000);
  }, []);

  // Validate input value
  const isValidAnswer = useCallback((inputValue: string): boolean => {
    if (validateInput) {
      return validateInput(inputValue);
    }
    if (expectedSolution) {
      return inputValue.toUpperCase().trim() === expectedSolution.toUpperCase().trim();
    }
    return false;
  }, [validateInput, expectedSolution]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (isValidating || disabled) return;

    setIsValidating(true);
    
    if (isValidAnswer(value)) {
      setStatus('success');
      onValidSubmit?.(value);
      setValue(''); // Clear input on success
      
      // Reset success status after delay
      timeoutRef.current = setTimeout(() => {
        setStatus('idle');
      }, 1500);
    } else {
      setStatus('error');
      resetStatus();
    }
    
    setIsValidating(false);
  }, [value, isValidAnswer, onValidSubmit, resetStatus, isValidating, disabled]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (status !== 'idle') {
      setStatus('idle');
    }
  }, [status]);

  // Handle key press events
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const inputClasses = cn(
    "flex-1 rounded bg-gray-800 px-4 py-2 text-white placeholder-gray-400",
    "focus:outline-none focus:ring-2 transition-all duration-200",
    {
      "focus:ring-blue-500": status === 'idle',
      "ring-2 ring-red-500 focus:ring-red-500": status === 'error',
      "ring-2 ring-green-500 focus:ring-green-500": status === 'success',
      "opacity-50 cursor-not-allowed": disabled,
    },
    className
  );

  const buttonClasses = cn(
    "rounded px-6 py-2 text-white font-medium transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900",
    {
      "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500": status === 'idle' && !disabled,
      "bg-red-600 hover:bg-red-700 focus:ring-red-500": status === 'error',
      "bg-green-600 hover:bg-green-700 focus:ring-green-500": status === 'success',
      "bg-gray-600 cursor-not-allowed": disabled || isValidating,
    }
  );

  return (
    <div className="w-full">
      <div className="flex space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled || isValidating}
          className={inputClasses}
          aria-label={ariaLabel || placeholder}
          aria-invalid={status === 'error'}
          aria-describedby={status !== 'idle' ? 'terminal-input-status' : undefined}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || isValidating}
          className={buttonClasses}
          aria-label="Submit answer"
        >
          {isValidating ? 'VALIDATING...' : 'VALIDER'}
        </button>
      </div>
      
      {/* Status message for accessibility */}
      {status !== 'idle' && (
        <div
          id="terminal-input-status"
          className={cn(
            "mt-2 text-sm font-medium",
            {
              "text-red-400": status === 'error',
              "text-green-400": status === 'success',
            }
          )}
          role="status"
          aria-live="polite"
        >
          {status === 'error' ? errorMessage : successMessage}
        </div>
      )}
    </div>
  );
};

export default TerminalInput;