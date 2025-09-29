import { useEffect, useMemo, useState } from 'react';
import { Image, Modal, ModalContent, ModalHeader, ModalBody, Button } from '@heroui/react';
import { EyeIcon, DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface FilePreviewProps {
  file?: File | null;
  src?: string; // Optional direct URL (e.g., when not a File)
  fileName?: string;
  className?: string;
  width?: number;
  height?: number;
  showModal?: boolean; // Whether to show modal on click
}

/**
 * FilePreview
 * - Renders an image thumbnail for images
 * - Renders a PDF placeholder with icon for PDFs
 * - Falls back to a generic file icon and name for other types
 * - Includes modal view for larger preview
 */
export function FilePreview({ 
  file, 
  src, 
  fileName, 
  className, 
  width = 96, 
  height = 96,
  showModal = true 
}: FilePreviewProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mimeType = useMemo(() => {
    if (file?.type) return file.type;
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
    if (ext === 'png') return 'image/png';
    if (ext === 'pdf') return 'application/pdf';
    return undefined;
  }, [file?.type, fileName]);

  const isImage = mimeType?.startsWith('image/');
  const isPdf = mimeType === 'application/pdf';

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    setObjectUrl(null);
  }, [file]);

  const displaySrc = src || objectUrl || undefined;

  const handleClick = () => {
    if (showModal && (isImage || isPdf)) {
      setIsModalOpen(true);
    }
  };

  const renderThumbnail = () => {
    if (isImage && displaySrc) {
      return (
        <Image
          className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}
          src={displaySrc}
          alt={fileName || 'Attachment preview'}
          width={width}
          height={height}
          radius="sm"
          onClick={handleClick}
        />
      );
    }

    if (isPdf) {
      return (
        <div 
          className={`cursor-pointer hover:bg-gray-50 transition-colors border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 ${className}`}
          style={{ width, height }}
          onClick={handleClick}
        >
          <DocumentIcon className="h-8 w-8 text-red-500 mb-2" />
          <span className="text-xs text-gray-600 text-center">PDF</span>
          {fileName && (
            <span className="text-xs text-gray-500 truncate max-w-full" title={fileName}>
              {fileName}
            </span>
          )}
        </div>
      );
    }

    // Fallback: generic file icon + name
    return (
      <div className={`flex items-center space-x-2 ${className || ''}`} style={{ maxWidth: width }}>
        <svg className="h-6 w-6 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
        {fileName && (
          <span className="truncate text-sm text-gray-700" title={fileName}>{fileName}</span>
        )}
      </div>
    );
  };

  return (
    <>
      {renderThumbnail()}
      
      {/* Modal for larger view */}
      {showModal && (isImage || isPdf) && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          size="5xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">File Preview</h3>
              {fileName && (
                <p className="text-sm text-gray-600">{fileName}</p>
              )}
            </ModalHeader>
            <ModalBody className="p-6">
              {isImage && displaySrc ? (
                <div className="flex justify-center">
                  <Image
                    src={displaySrc}
                    alt={fileName || 'Attachment preview'}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
              ) : isPdf && displaySrc ? (
                <div className="w-full h-[70vh]">
                  <embed
                    src={displaySrc}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <PhotoIcon className="h-16 w-16 mb-4" />
                  <p>Preview not available</p>
                </div>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default FilePreview;


