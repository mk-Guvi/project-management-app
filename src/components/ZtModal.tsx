"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export type ZtModalPropsT = {
  content: React.ReactNode;
  title?: React.ReactNode | React.ReactElement;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
  footerClassName?: string;
  titleClassName?: string;
  containerClassName?: string;
  descriptionClassName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ZtModal(props: ZtModalPropsT) {
  const {
    content,
    title,
    description,
    footer,
    containerClassName = "",
    contentClassName = "",
    footerClassName = "",
    titleClassName = "",
    descriptionClassName = "",
    open,
    onOpenChange,
  } = props;

  return (
    <Dialog open={open} >
      <DialogContent
        className={`max-w-96 z-20 sm:max-w-lg rounded-md ${containerClassName}`}
      >
        {title || description ? (
          <DialogHeader>
            {title && (
              <DialogTitle className={titleClassName}>{title}</DialogTitle>
            )}
            {description && (
              <DialogDescription className={descriptionClassName}>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        ) : null}
        <div className={contentClassName}>{content}</div>
        {footer && (
          <DialogFooter className={footerClassName}>{footer}</DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ZtModal;
