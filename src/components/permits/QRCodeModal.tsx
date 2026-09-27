'use client';

import React from 'react';
import { X, QrCode, Download, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  permitNumber: string;
  permitTitle: string;
  qrCodeDataUrl: string;
  permitId: string;
}

export const QRCodeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  permitNumber,
  permitTitle,
  qrCodeDataUrl,
  permitId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden text-center p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-sky-400" />
            <h3 className="font-bold text-slate-100 text-sm">Site Walk-Around QR Code</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl inline-block shadow-inner mx-auto">
          {qrCodeDataUrl ? (
            <img src={qrCodeDataUrl} alt={`QR Code for ${permitNumber}`} className="w-52 h-52 object-contain" />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
              Generating QR Code...
            </div>
          )}
        </div>

        <div>
          <h4 className="font-mono font-bold text-sm text-slate-200">{permitNumber}</h4>
          <p className="text-xs text-slate-400 truncate max-w-xs mx-auto mt-0.5">{permitTitle}</p>
        </div>

        <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 leading-relaxed text-left">
          Safety officers and plant inspectors on floor patrol can scan this barcode with any smartphone camera to instantly verify live status, isolation points, and gas clearance.
        </p>

        <div className="pt-2 flex gap-2">
          {qrCodeDataUrl && (
            <a
              href={qrCodeDataUrl}
              download={`${permitNumber}-QR.png`}
              className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Save PNG</span>
            </a>
          )}
          <a
            href={`/permits/${permitId}`}
            target="_blank"
            className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open Link</span>
          </a>
        </div>
      </div>
    </div>
  );
};
