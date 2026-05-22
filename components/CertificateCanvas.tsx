'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Download, X } from 'lucide-react';

interface Props {
  courseName: string;
  completedDate: string;
  xpEarned: number;
  onClose: () => void;
}

function drawCertificate(canvas: HTMLCanvasElement, courseName: string, userName: string, completedDate: string, xpEarned: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#07071a');
  bg.addColorStop(0.5, '#0d0d2b');
  bg.addColorStop(1, '#070718');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Border frame
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, W - 56, H - 56);
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  // Corner accents
  const corners = [[48, 48], [W - 48, 48], [48, H - 48], [W - 48, H - 48]] as [number, number][];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
    ctx.fill();
  });

  // Logo / Header
  ctx.font = 'bold 28px sans-serif';
  ctx.fillStyle = 'rgba(167, 139, 250, 0.9)';
  ctx.textAlign = 'center';
  ctx.fillText('EnglishUp', W / 2, 100);

  // Certificate title
  ctx.font = '700 18px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillText('CERTIFICATE OF COMPLETION', W / 2, 138);

  // Divider line
  const grad = ctx.createLinearGradient(100, 0, W - 100, 0);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.6)');
  grad.addColorStop(1, 'transparent');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, 158);
  ctx.lineTo(W - 100, 158);
  ctx.stroke();

  // "This is to certify that"
  ctx.font = '16px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('This is to certify that', W / 2, 196);

  // Name
  ctx.font = 'bold 38px serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(userName, W / 2, 248);

  // Underline for name
  const nameWidth = ctx.measureText(userName).width;
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - nameWidth / 2, 258);
  ctx.lineTo(W / 2 + nameWidth / 2, 258);
  ctx.stroke();

  // "has successfully completed"
  ctx.font = '16px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('has successfully completed', W / 2, 290);

  // Course name
  ctx.font = 'bold 24px sans-serif';
  ctx.fillStyle = 'rgba(167, 139, 250, 1)';
  ctx.fillText(courseName, W / 2, 330);

  // Divider 2
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, 358);
  ctx.lineTo(W - 100, 358);
  ctx.stroke();

  // Stats row
  const stats = [
    { label: 'Completed', value: completedDate },
    { label: 'XP Earned', value: `${xpEarned} XP` },
    { label: 'Issued by', value: 'EnglishUp' },
  ];
  stats.forEach((s, i) => {
    const x = 160 + i * (W - 320) / 2;
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.textAlign = 'center';
    ctx.fillText(s.value, x, 398);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText(s.label, x, 416);
  });

  // Footer watermark
  ctx.font = '12px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.textAlign = 'center';
  ctx.fillText('englishup.app', W / 2, H - 48);
}

export default function CertificateCanvas({ courseName, completedDate, xpEarned, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('user-name') || 'Learner';
    setUserName(name);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !userName) return;
    drawCertificate(canvasRef.current, courseName, userName, completedDate, xpEarned);
  }, [userName, courseName, completedDate, xpEarned]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `certificate-${courseName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-[#0d0d1f] border border-violet-500/30 rounded-2xl p-6 max-w-2xl w-full"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-violet-400" />
              <span className="font-bold text-white">Your Certificate</span>
            </div>
            <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <canvas
            ref={canvasRef}
            width={700}
            height={460}
            className="w-full rounded-xl border border-white/10"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white/80 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
