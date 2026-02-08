"use client";

import { type ReactNode } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { ZoomIn, RotateCw, Loader2, X } from "lucide-react";

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@make-the-change/core/ui";
import { cn } from "@make-the-change/core/shared/utils";
import { formatFileSize } from "@/lib/media/image-utils";

export type BaseCropModalProps = {
  image: { src: string; file: File } | null;
  crop: { x: number; y: number };
  zoom: number;
  rotation: number;
  aspect: number;
  cropShape?: "rect" | "round";
  showGrid?: boolean;
  minHeight?: number;
  isSaving: boolean;
  headerTitle: ReactNode;
  headerDescription?: ReactNode;
  headerBadge?: ReactNode;
  progress?: { current: number; total: number };
  zoomLabel?: ReactNode;
  rotationLabel?: ReactNode;
  resetRotationLabel?: ReactNode;
  fileInfoLabel?: ReactNode;
  hideFileInfo?: boolean;
  containerClassName?: string;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onRotationChange: (rotation: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel: ReactNode;
  confirmIcon?: ReactNode;
  cancelLabel: ReactNode;
  secondaryActions?: ReactNode;
  confirmDisabled?: boolean;
  size?: "default" | "sm" | "lg" | "xl" | "full";
};

export function BaseCropModal({
  image,
  crop,
  zoom,
  rotation,
  aspect,
  cropShape = "rect",
  showGrid = false,
  minHeight = 400,
  isSaving,
  headerTitle,
  headerBadge,
  progress,
  zoomLabel,
  rotationLabel,
  resetRotationLabel,
  fileInfoLabel,
  hideFileInfo = false,
  containerClassName,
  onCropChange,
  onZoomChange,
  onRotationChange,
  onCropComplete,
  onConfirm,
  onCancel,
  confirmLabel,
  confirmIcon,
  cancelLabel,
  secondaryActions,
  confirmDisabled = false,
  size = "xl",
}: BaseCropModalProps) {
  if (!image) return null;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSaving) onCancel();
      }}
    >
      <DialogContent 
        className={cn(
          "flex flex-col p-0 gap-0 overflow-hidden max-h-[90vh]",
          size === "xl" && "max-w-5xl",
          size === "lg" && "max-w-4xl",
          size === "full" && "max-w-[95vw] h-[90vh]",
          containerClassName
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-4 sm:px-6 bg-background z-10">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-xl font-bold">{headerTitle}</DialogTitle>
            <DialogDescription className="sr-only">
              Interface de recadrage d'image
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              {headerBadge}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden min-h-[400px]">
          {/* Left: Image Area */}
          <div className="relative w-full h-[40vh] sm:h-full sm:flex-1 bg-muted/10">
            <Cropper
              image={image.src}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              cropShape={cropShape}
              showGrid={showGrid}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onRotationChange={onRotationChange}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: {
                  borderRadius: "0px",
                },
              }}
            />
          </div>

          {/* Right: Controls Sidebar */}
          <div className="w-full sm:w-80 shrink-0 p-4 sm:p-6 space-y-6 overflow-y-auto sm:border-l bg-card/30">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <ZoomIn className="h-4 w-4 text-primary" />
                    {zoomLabel ?? "Zoom"}
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(event) => onZoomChange(Number(event.target.value))}
                  className="w-full accent-primary h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <RotateCw className="h-4 w-4 text-primary" />
                    {rotationLabel ?? "Rotation"}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{rotation}&deg;</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => onRotationChange(0)}
                      disabled={rotation === 0 || isSaving}
                      className="h-6 px-2 text-xs hover:bg-primary/10 hover:text-primary"
                    >
                      {resetRotationLabel ?? "Reset"}
                    </Button>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={rotation}
                  onChange={(event) => onRotationChange(Number(event.target.value))}
                  className="w-full accent-primary h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                />
              </div>
            </div>

            {!hideFileInfo && (
              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Fichier</span>
                  <span className="bg-background px-2 py-0.5 rounded-full border border-border/50">{fileInfoLabel ?? formatFileSize(image.file.size)}</span>
                </div>
                <div className="truncate opacity-80" title={image.file.name}>
                  {image.file.name}
                </div>
              </div>
            )}

            {progress && progress.total > 1 && (
              <div className="rounded-lg border border-border/50 bg-card/50 p-4">
                <div className="mb-2 flex items-center justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="text-primary">
                    {progress.current}/{progress.total}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-4 sm:px-6 bg-background z-10">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving} className="w-full sm:w-auto">
            {cancelLabel}
          </Button>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            {secondaryActions}
            <Button type="button" onClick={onConfirm} disabled={isSaving || confirmDisabled} className="w-full sm:w-auto">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  {confirmIcon}
                  {confirmLabel}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
