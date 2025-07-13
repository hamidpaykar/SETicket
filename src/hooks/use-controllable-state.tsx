import * as React from 'react';

import { useCallbackRef } from '@/hooks/use-callback-ref';

/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/react/use-controllable-state/src/useControllableState.tsx
 */

/**
 * Parameters for the useControllableState hook.
 * Supports both controlled and uncontrolled component patterns.
 * 
 * @template T - The type of the state value
 */
type UseControllableStateParams<T> = {
  /** The controlled value (when provided, component becomes controlled) */
  prop?: T | undefined;
  /** Default value for uncontrolled mode */
  defaultProp?: T | undefined;
  /** Callback fired when state changes */
  onChange?: (state: T) => void;
};

/**
 * Function type for state setters that can accept either a value or a function.
 * 
 * @template T - The type of the state value
 */
type SetStateFn<T> = (prevState?: T) => T;

/**
 * A hook that manages both controlled and uncontrolled state patterns.
 * 
 * This hook allows components to work in both controlled and uncontrolled modes:
 * - **Controlled**: Parent provides `prop` and `onChange`, component doesn't manage state
 * - **Uncontrolled**: Component manages its own state using `defaultProp` as initial value
 * 
 * @template T - The type of the state value
 * @param params - Configuration object for the controllable state
 * @returns A tuple containing [value, setValue] similar to React.useState
 * 
 * @example
 * ```tsx
 * // Component that can be used both controlled and uncontrolled
 * interface MyInputProps {
 *   value?: string;
 *   defaultValue?: string;
 *   onChange?: (value: string) => void;
 * }
 * 
 * function MyInput({ value, defaultValue, onChange }: MyInputProps) {
 *   const [inputValue, setInputValue] = useControllableState({
 *     prop: value,
 *     defaultProp: defaultValue,
 *     onChange
 *   });
 * 
 *   return (
 *     <input
 *       value={inputValue ?? ''}
 *       onChange={(e) => setInputValue(e.target.value)}
 *     />
 *   );
 * }
 * 
 * // Uncontrolled usage
 * <MyInput defaultValue="hello" onChange={console.log} />
 * 
 * // Controlled usage
 * const [value, setValue] = useState('hello');
 * <MyInput value={value} onChange={setValue} />
 * ```
 * 
 * @features
 * - **Automatic Mode Detection**: Determines controlled vs uncontrolled based on prop presence
 * - **Consistent API**: Same interface regardless of mode
 * - **Change Callbacks**: Fires onChange in both modes when value actually changes
 * - **Type Safe**: Full TypeScript support with proper generics
 * 
 * @pattern
 * This implements the "Controllable State" pattern common in React component libraries.
 * It's useful for building reusable components that can work in both scenarios.
 */
function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {}
}: UseControllableStateParams<T>) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
    defaultProp,
    onChange
  });
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;
  const handleChange = useCallbackRef(onChange);

  const setValue: React.Dispatch<React.SetStateAction<T | undefined>> =
    React.useCallback(
      (nextValue) => {
        if (isControlled) {
          const setter = nextValue as SetStateFn<T>;
          const value =
            typeof nextValue === 'function' ? setter(prop) : nextValue;
          if (value !== prop) handleChange(value as T);
        } else {
          setUncontrolledProp(nextValue);
        }
      },
      [isControlled, prop, setUncontrolledProp, handleChange]
    );

  return [value, setValue] as const;
}

/**
 * Internal hook for managing uncontrolled state with change callbacks.
 * Handles the uncontrolled mode behavior of useControllableState.
 * 
 * @template T - The type of the state value
 * @param params - Configuration object excluding the controlled prop
 * @returns Standard React useState return tuple
 * 
 * @internal This hook is used internally by useControllableState
 */
function useUncontrolledState<T>({
  defaultProp,
  onChange
}: Omit<UseControllableStateParams<T>, 'prop'>) {
  const uncontrolledState = React.useState<T | undefined>(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = React.useRef(value);
  const handleChange = useCallbackRef(onChange);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef, handleChange]);

  return uncontrolledState;
}

export { useControllableState };
