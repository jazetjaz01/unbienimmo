// components/MapAndListLayout.tsx

import * as React from 'react';

interface MapAndListLayoutProps {
  mapComponent: React.ReactNode;
  listComponent: React.ReactNode;
}

export function MapAndListLayout({ mapComponent, listComponent }: MapAndListLayoutProps) {
  return (
    // CECI DOIT ÊTRE W-FULL ET FLEX
    <div className="flex h-[85vh] w-full gap-4"> 
      {/* w-2/3 */}
      <div className="w-2/3 h-full rounded-xl shadow-lg overflow-hidden"> 
        {mapComponent}
      </div>
      {/* w-1/3 */}
      <div className="w-1/3 h-full overflow-y-auto"> 
        {listComponent}
      </div>
    </div>
  );
}