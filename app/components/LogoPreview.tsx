'use client';

import { Download } from 'lucide-react';
import Image from 'next/image';

export default function LogoPreview({
  logoUrl,
  loading,
}: {
  logoUrl: string | null;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="relative w-96 h-96 bg-white shadow-xl rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
        {loading ? (
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-gray-500 font-medium">Generating your logo...</p>
          </div>
        ) : logoUrl ? (
          <Image
            src={logoUrl}
            alt="Generated Logo"
            fill
            className="object-contain p-4"
            priority
          />
        ) : (
          <div className="text-gray-400 text-center px-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="font-medium text-gray-600">No logo generated yet</p>
            <p className="text-sm mt-2">Describe your logo in the prompt on the left to get started.</p>
          </div>
        )}
      </div>

      {logoUrl && !loading && (
        <a
          href={logoUrl}
          download="logo.png"
          className="mt-8 flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
        >
          <Download size={18} />
          Download Logo (PNG)
        </a>
      )}
    </div>
  );
}
