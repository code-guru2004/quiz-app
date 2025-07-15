// Example usage in a page or form
'use client';

import ImageDrawer from '@/components/shared/ImageDrawer';
import { useState } from 'react';


export default function Page() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="p-4 space-y-4">
      <ImageDrawer onSelect={(url) => setSelectedImage(url)} />
      {selectedImage && (
        <div>
          <p className="text-sm text-muted-foreground">Selected Image:</p>
          <img src={selectedImage} alt="Selected" className="w-48 h-auto mt-2 rounded" />
        </div>
      )}
    </div>
  );
}
