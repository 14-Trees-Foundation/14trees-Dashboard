export type ViewMode = 'horizontal' | 'vertical';
export type PhotoSize = 'small' | 'medium' | 'large';

export interface ImageItem {
  id: number;
  entity_id: number;
  image_url: string;
  sequence: number;
  created_at: string;
  updated_at: string;
}

export interface ImageSequenceUpdate {
  id: number;
  sequence: number;
}

export interface ImageApiMethods {
  getImages: (entityId: number) => Promise<ImageItem[]>;
  uploadImages: (entityId: number, files: File[]) => Promise<ImageItem[]>;
  removeImages: (entityId: number, imageIds: number[]) => Promise<void>;
  reorderImages: (entityId: number, sequences: ImageSequenceUpdate[]) => Promise<void>;
}

export interface ImageManagerProps {
  entityId: number;
  entityName: string;
  open: boolean;
  onClose: () => void;
  apiMethods: ImageApiMethods;
  title?: string;
  layout?: 'modal' | 'dialog';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  height?: string;
  acceptedFileTypes?: string;
  supportedFormats?: string;
  showEntityName?: boolean;
}

export interface ImagePreviewModalProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
}

export interface UseImageManagerProps {
  entityId: number;
  open: boolean;
  apiMethods: ImageApiMethods;
}

export interface UseImageManagerReturn {
  // State
  loading: boolean;
  uploading: boolean;
  uploadProgress: number;
  images: ImageItem[];
  selectedFiles: File[];
  previewImage: string | null;
  dragOver: boolean;
  viewMode: ViewMode;
  photoSize: PhotoSize;
  
  // Setters
  setPreviewImage: (url: string | null) => void;
  setDragOver: (dragOver: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  setPhotoSize: (size: PhotoSize) => void;
  
  // Actions
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFiles: (files: File[]) => void;
  handleDrop: (event: React.DragEvent) => void;
  handleDragOver: (event: React.DragEvent) => void;
  handleDragLeave: (event: React.DragEvent) => void;
  removeSelectedFile: (index: number) => void;
  uploadImages: () => Promise<void>;
  removeImage: (imageId: number) => Promise<void>;
  handleDragEnd: (result: any) => Promise<void>;
  moveImage: (imageId: number, direction: 'up' | 'down') => Promise<void>;
}