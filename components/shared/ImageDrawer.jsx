// components/ImageDrawer.tsx
'use client';

import { useEffect, useState } from 'react';
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerHeader } from '@/components/ui/drawer'; // adjust if path differs
import { Button } from '@/components/ui/button';

export default function ImageDrawer({ onSelect }) {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchImages = async () => {
    const res = await fetch('/api/cloudinary/images');
    const data = await res.json();


    setImages(data.resources);
  };

  useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Select Image</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select images</DrawerTitle>
        </DrawerHeader>

        <div className="py-4 px-8 grid grid-cols-1 space-y-3 max-h-[70vh] overflow-y-auto">
          {
            images.length === 0 && (
              <div>
                No image found
              </div>
            )
          }
          {images.length > 0 && images.map((img) => (
            <img
              key={img.asset_id}
              src={img.secure_url}
              alt="Cloudinary"
              className="w-full h-auto rounded-s-md opacity-90 cursor-pointer rounded border-4 hover:border-blue-500 hover:opacity-100"
              onClick={() => {
                onSelect(img.secure_url);
                setOpen(false); // close drawer on select
              }}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
