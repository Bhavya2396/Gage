import React, { useState, ReactNode, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik, FormikConfig, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';
import { cn } from '@/lib/utils';
import { Alert, AlertCircle, Check, ChevronDown } from 'lucide-react';
import InteractiveButton from '@/components/ui/InteractiveButton';
import { useAnimation } from '@/contexts/AnimationContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface FormFieldProps {
  id?: string;
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  className?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  options?: Array<{ value: string; label: string }>;
  hint?: string;
  icon?: ReactNode;
  autoComplete?: string;
  description?: string;
  formik: FormikProps<any>;
  value?: any;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  step?: number;
  groupClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  hideErrors?: boolean;
  aria?: Record<string, string>;
}

/**
 * FormField - Accessible form input component
 * Supports various input types with validation and error messaging
 */
export const FormField: React.FC<FormFieldProps> = ({
  id: idProp,
  name,
  label,
  placeholder,
  type = 'text',
  className,
  required = false,
  disabled = false,
  rows = 3,
  options = [],
  hint,
  icon,
  autoComplete,
  description,
  formik,
  value,
  maxLength,
  minLength,
  min,
  max,
  step,
  groupClassName,
  labelClassName,
  inputClassName,
  hideErrors = false,
  aria = {},
}) => {
  const generatedId = useId();
  const id = idProp || `${name}-${generatedId}`;
  const [isFocused, setIsFocused] = useState(false);
  
  // Get field status
  const touched = formik.touched[name];
  const error = formik.errors[name] as string | undefined;
  const fieldValue = value !== undefined ? value : formik.values[name];
  const hasError = touched && !!error;
  const isValid = touched && !error;
  
  // Handle checkbox and radio inputs
  const isCheckboxOrRadio = type === 'checkbox' || type === 'radio';
  
  // Get accessibility settings
  const { highContrast } = useAccessibility();
  
  // Error message ID for aria-describedby
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  
  // Calculate character count and limit for text inputs
  const showCharCount = maxLength && (type === 'text' || type === 'textarea' || type === 'email');
  const charCount = typeof fieldValue === 'string' ? fieldValue.length : 0;
  const charCountWarning = maxLength ? charCount >= maxLength * 0.8 : false;
  const charCountDanger = maxLength ? charCount >= maxLength * 0.95 : false;
  
  // Handle focus events
  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent) => {
    setIsFocused(false);
    formik.handleBlur(e);
  };
  
  // Get common input props
  const inputProps = {
    id,
    name,
    placeholder,
    disabled,
    onChange: formik.handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    value: fieldValue ?? '',
    className: cn(
      "w-full px-3 py-2 rounded-md",
      "bg-glass-background backdrop-blur-sm",
      "border transition-colors duration-200",
      hasError 
        ? "border-status-error-400 focus:ring-2 focus:ring-status-error-400/30" 
        : isValid
          ? "border-status-success-400 focus:ring-2 focus:ring-status-success-400/30"
          : "border-glass-border focus:ring-2 focus:ring-primary-cyan-400/30",
      isFocused && !hasError && "border-primary-cyan-400",
      disabled && "opacity-60 cursor-not-allowed",
      highContrast && "border-width-2",
      inputClassName
    ),
    'aria-invalid': hasError ? 'true' : 'false',
    'aria-describedby': cn(
      hasError ? errorId : undefined,
      description ? descriptionId : undefined
    ),
    'aria-required': required ? 'true' : undefined,
    autoComplete,
    ...aria,
  };
  
  // Select specific props
  const selectProps = {
    ...inputProps,
    className: cn(
      inputProps.className,
      "appearance-none cursor-pointer pr-8"
    ),
  };
  
  // Checkbox/Radio props
  const checkboxProps = {
    id,
    name,
    disabled,
    onChange: formik.handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    checked: !!fieldValue,
    className: cn(
      "w-5 h-5 rounded",
      "border border-glass-border bg-glass-background",
      "checked:bg-primary-cyan-500 checked:border-primary-cyan-500",
      hasError && "border-status-error-400",
      disabled && "opacity-60 cursor-not-allowed"
    ),
    'aria-invalid': hasError ? 'true' : 'false',
    'aria-describedby': hasError ? errorId : undefined,
    'aria-required': required ? 'true' : undefined,
  };
  
  return (
    <div 
      className={cn(
        "mb-4", 
        isCheckboxOrRadio && "flex items-start",
        groupClassName
      )}
    >
      {/* Label */}
      <label 
        htmlFor={id} 
        className={cn(
          isCheckboxOrRadio ? "ml-2 pt-0.5" : "block mb-1",
          "text-sm font-medium text-alpine-mist",
          hasError && "text-status-error-400",
          labelClassName
        )}
      >
        {label}
        {required && <span className="ml-1 text-status-error-400">*</span>}
      </label>
      
      {/* Input container */}
      <div className={cn("relative", isCheckboxOrRadio ? "order-first" : "")}>
        {/* Icon */}
        {icon && !isCheckboxOrRadio && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-alpine-mist/70">
            {icon}
          </div>
        )}
        
        {/* Input field based on type */}
        {type === 'textarea' ? (
          <textarea
            {...inputProps}
            rows={rows}
            maxLength={maxLength}
            className={cn(inputProps.className, "min-h-[80px] resize-y")}
          />
        ) : type === 'select' ? (
          <div className="relative">
            <select {...selectProps}>
              <option value="">Select {label}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-alpine-mist/70 pointer-events-none" 
              size={16} 
            />
          </div>
        ) : type === 'checkbox' ? (
          <input type="checkbox" {...checkboxProps} />
        ) : type === 'radio' ? (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${id}-${option.value}`}
                  name={name}
                  value={option.value}
                  checked={fieldValue === option.value}
                  onChange={formik.handleChange}
                  onBlur={handleBlur}
                  className={cn(
                    "w-4 h-4 rounded-full",
                    "border border-glass-border bg-glass-background",
                    "checked:border-primary-cyan-500",
                    hasError && "border-status-error-400",
                    disabled && "opacity-60 cursor-not-allowed"
                  )}
                  disabled={disabled}
                />
                <label 
                  htmlFor={`${id}-${option.value}`} 
                  className="ml-2 text-sm text-alpine-mist"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <input
            type={type}
            {...inputProps}
            maxLength={maxLength}
            minLength={minLength}
            min={min}
            max={max}
            step={step}
            className={cn(
              inputProps.className,
              icon && "pl-10"
            )}
          />
        )}
        
        {/* Valid/Error state icons */}
        {!isCheckboxOrRadio && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait">
              {isValid && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key="valid"
                >
                  <Check className="text-status-success-400" size={18} />
                </motion.div>
              )}
              {hasError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key="error"
                >
                  <AlertCircle className="text-status-error-400" size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {/* Character counter */}
        {showCharCount && maxLength && (
          <div 
            className={cn(
              "absolute right-3 -bottom-5 text-xs",
              charCountDanger ? "text-status-error-400" : 
              charCountWarning ? "text-status-warning-400" : 
              "text-alpine-mist/70"
            )}
          >
            {charCount}/{maxLength}
          </div>
        )}
      </div>
      
      {/* Field description */}
      {description && (
        <div 
          id={descriptionId}
          className="mt-1 text-xs text-alpine-mist/70"
        >
          {description}
        </div>
      )}
      
      {/* Field hint */}
      {hint && (
        <div className="mt-1 text-xs text-primary-cyan-400">
          {hint}
        </div>
      )}
      
      {/* Error message */}
      {!hideErrors && hasError && (
        <AnimatePresence mode="wait">
          <motion.div
            id={errorId}
            initial={{ opacity: 0, height: 0, y: -5 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1 text-sm text-status-error-400 flex items-center gap-1"
            role="alert"
          >
            <Alert size={12} />
            <span>{error}</span>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

interface AccessibleFormProps<T extends FormikValues> {
  initialValues: T;
  validationSchema?: Yup.Schema<any>;
  onSubmit: (values: T) => void | Promise<any>;
  children: (formik: FormikProps<T>) => ReactNode;
  className?: string;
  resetOnSubmit?: boolean;
  successMessage?: string;
  errorMessage?: string;
  submitButtonLabel?: string;
  submitButtonProps?: React.ComponentProps<typeof InteractiveButton>;
  showSubmitButton?: boolean;
  onChange?: (values: T) => void;
}

/**
 * AccessibleForm - Enhanced form component with built-in validation and accessibility features
 * Wraps Formik with additional UI features and accessibility improvements
 */
export function AccessibleForm<T extends FormikValues>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  className,
  resetOnSubmit = false,
  successMessage = "Form submitted successfully",
  errorMessage = "Something went wrong. Please try again.",
  submitButtonLabel = "Submit",
  submitButtonProps = {},
  showSubmitButton = true,
  onChange,
}: AccessibleFormProps<T>) {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const { isReducedMotion } = useAnimation();
  
  // Handle form submission
  const handleSubmit = async (values: T, formikHelpers: any) => {
    try {
      setFormStatus('submitting');
      await onSubmit(values);
      setFormStatus('success');
      
      if (resetOnSubmit) {
        formikHelpers.resetForm();
      }
      
      // Reset status after delay
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    } catch (error) {
      setFormStatus('error');
      console.error('Form submission error:', error);
      
      // Reset status after delay
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    }
  };
  
  // Configure formik
  const formikConfig: FormikConfig<T> = {
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  };
  
  // Create formik instance
  const formik = useFormik(formikConfig);
  
  // Call onChange handler when values change
  React.useEffect(() => {
    if (onChange) {
      onChange(formik.values);
    }
  }, [formik.values, onChange]);
  
  // Transition settings for status messages
  const animationConfig = {
    initial: { opacity: 0, y: -10, height: 0 },
    animate: { opacity: 1, y: 0, height: 'auto' },
    exit: { opacity: 0, y: 10, height: 0 },
    transition: { duration: isReducedMotion ? 0.1 : 0.3 }
  };

  return (
    <form 
      onSubmit={formik.handleSubmit} 
      className={cn("w-full", className)}
      noValidate // We handle validation with Formik/Yup
      aria-live="polite"
    >
      {/* Form content */}
      {children(formik)}
      
      {/* Status messages */}
      <AnimatePresence mode="wait">
        {formStatus === 'success' && (
          <motion.div 
            key="success"
            {...animationConfig}
            className="mb-4 p-3 rounded bg-status-success-400/20 text-status-success-400 border border-status-success-400/30"
            role="status"
          >
            {successMessage}
          </motion.div>
        )}
        
        {formStatus === 'error' && (
          <motion.div 
            key="error"
            {...animationConfig}
            className="mb-4 p-3 rounded bg-status-error-400/20 text-status-error-400 border border-status-error-400/30"
            role="alert"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Submit button */}
      {showSubmitButton && (
        <div className="mt-6">
          <InteractiveButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={formStatus === 'submitting'}
            disabled={!formik.isValid || formik.isSubmitting}
            aria-disabled={!formik.isValid || formik.isSubmitting}
            aria-busy={formik.isSubmitting}
            {...submitButtonProps}
          >
            {submitButtonLabel}
          </InteractiveButton>
        </div>
      )}
    </form>
  );
}

export default AccessibleForm;
