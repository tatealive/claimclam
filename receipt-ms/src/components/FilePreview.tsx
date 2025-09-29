import { useEffect, useMemo, useState } from 'react';
import { Image } from '@heroui/react';

interface FilePreviewProps {
  file?: File | null;
  src?: string; // Optional direct URL (e.g., when not a File)
  fileName?: string;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * FilePreview
 * - Renders an image thumbnail for images
 * - Renders a lightweight PDF preview (embed) for PDFs
 * - Falls back to a generic file icon and name for other types
 */
export function FilePreview({ file, src, fileName, className, width = 96, height = 96 }: FilePreviewProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

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

  if (isImage && displaySrc) {
    return (
      <Image
        className={className}
        src={displaySrc}
        alt={fileName || 'Attachment preview'}
        width={width}
        height={height}
        radius="sm"
        isZoomed
        isBlurred
      />
    );
  }

  if (isPdf && displaySrc) {
    return (
      <div className={className} style={{ width, height }}>
        <embed
          src={displaySrc}
          type="application/pdf"
          width={width}
          height={height}
        />
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
}

export default FilePreview;


