'use client';

import {useToast} from '@/hooks/useToast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';

export function Toaster() {
  const {toasts} = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({id, title, description, action, children, ...props}) {
        return (
          <Toast key={id} {...props}>
            <>
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
              {children && (
                <div className="flex flex-col gap-2 w-full items-center justify-center h-full">
                  {children}
                </div>
              )}
            </>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
