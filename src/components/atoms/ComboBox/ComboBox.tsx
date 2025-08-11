import React, { useState, useRef, useEffect } from 'react';
import styles from './ComboBox.module.scss';

export interface ComboBoxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboBoxProps {
  options: ComboBoxOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  size?: 'small' | 'medium' | 'large';
  id?: string;
  name?: string;
  searchable?: boolean;
  clearable?: boolean;
  maxHeight?: number;
}

export const ComboBox: React.FC<ComboBoxProps> = ({
  options = [],
  value = '',
  placeholder = 'Seleccionar...',
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  error = false,
  required = false,
  size = 'medium',
  id,
  name,
  searchable = true,
  clearable = false,
  maxHeight = 200,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filtrar opciones basado en el término de búsqueda
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Encontrar la opción seleccionada
  const selectedOption = options.find(option => option.value === value);

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar navegación con teclado
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          const selectedOption = filteredOptions[highlightedIndex];
          if (!selectedOption.disabled) {
            handleSelect(selectedOption.value);
          }
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (searchable) {
      setSearchTerm(event.target.value);
      setIsOpen(true);
      setHighlightedIndex(-1);
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
      onFocus?.();
    }
  };

  const handleInputBlur = () => {
    // Delay para permitir clicks en las opciones
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        onBlur?.();
      }
    }, 150);
  };

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange?.('');
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        inputRef.current?.focus();
      }
    }
  };

  // Clases CSS
  const containerClassName = [
    styles.comboBox,
    styles[`comboBox--${size}`],
    isOpen && styles['comboBox--open'],
    error && styles['comboBox--error'],
    disabled && styles['comboBox--disabled']
  ].filter(Boolean).join(' ');

  const inputClassName = [
    styles.input,
    styles[`input--${size}`],
    error && styles['input--error'],
    disabled && styles['input--disabled']
  ].filter(Boolean).join(' ');

  const dropdownClassName = [
    styles.dropdown,
    isOpen && styles['dropdown--open']
  ].filter(Boolean).join(' ');

  // Valor a mostrar en el input
  const displayValue = searchable && isOpen
    ? searchTerm
    : (selectedOption?.label || '');

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.inputWrapper} onClick={handleToggle}>
        <input
          ref={inputRef}
          type="text"
          className={inputClassName}
          value={displayValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          disabled={disabled}
          required={required}
          readOnly={!searchable}
          id={id}
          name={name}
          autoComplete="off"
        />
        
        <div className={styles.indicators}>
          {clearable && value && !disabled && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              tabIndex={-1}
              aria-label="Limpiar selección"
            >
              ×
            </button>
          )}
          <div className={styles.separator} />
          <div className={`${styles.arrow} ${isOpen ? styles['arrow--up'] : ''}`}>
            ▼
          </div>
        </div>
      </div>

      <ul
        ref={listRef}
        className={dropdownClassName}
        style={{ maxHeight: `${maxHeight}px` }}
        role="listbox"
        aria-expanded={isOpen}
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => (
            <li
              key={option.value}
              className={`${styles.option} ${
                index === highlightedIndex ? styles['option--highlighted'] : ''
              } ${
                option.value === value ? styles['option--selected'] : ''
              } ${
                option.disabled ? styles['option--disabled'] : ''
              }`}
              onClick={() => !option.disabled && handleSelect(option.value)}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
            >
              {option.label}
            </li>
          ))
        ) : (
          <li className={styles.noOptions}>
            No se encontraron opciones
          </li>
        )}
      </ul>
    </div>
  );
};

export default ComboBox;