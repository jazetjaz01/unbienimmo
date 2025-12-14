// components/MapAndListLayout.tsx

import * as React from 'react';

interface MapAndListLayoutProps {
  mapComponent: React.ReactNode;
  listComponent: React.ReactNode;
}

export function MapAndListLayout({ mapComponent, listComponent }: MapAndListLayoutProps) {
  return (
    <div className="flex h-[85vh] w-full gap-4">
      {/* 2/3 pour la carte */}
      <div className="flex-grow w-2/3 h-full rounded-xl shadow-lg overflow-hidden">
        {mapComponent}
      </div>
      
      {/* 1/3 pour la liste des résultats */}
      <div className="w-1/3 h-full overflow-y-auto pr-2">
        {listComponent}
      </div>
    </div>
  );
}