'use client';

import React from 'react';
import { XIcon, FileText, ShieldCheck, Users, BookOpen, Package } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { UnitType } from '@/types/courses';

const ACTIVITY_OPTIONS: { type: UnitType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'Assignment', label: 'Assignment', icon: <FileText size={20} />, description: 'Create an assignment for learners to complete' },
  { type: 'License', label: 'License', icon: <ShieldCheck size={20} />, description: 'Track licensing requirements and expiry dates' },
  { type: 'Face to Face', label: 'Face to Face', icon: <Users size={20} />, description: 'Schedule in-person training sessions' },
  { type: 'Read and Acknowledge', label: 'Read and Acknowledge', icon: <BookOpen size={20} />, description: 'Require learners to read and acknowledge content' },
  { type: 'Scorm Package', label: 'Scorm Package', icon: <Package size={20} />, description: 'Upload a SCORM-compatible learning package' },
];

type AddActivityModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: UnitType) => void;
};

export default function AddActivityModal({ isOpen, onClose, onSelect }: AddActivityModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-semibold text-[var(--text-primary)]">
            Add Activity
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 p-1 text-muted-foreground rounded-sm cursor-pointer"
              aria-label="Close"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-2">
          <p className="text-sm text-gray-500 mb-4">Select a unit type to add</p>
          {ACTIVITY_OPTIONS.map((option) => (
            <button
              key={option.type}
              onClick={() => {
                onSelect(option.type);
                onClose();
              }}
              className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-[var(--training-primary)] hover:bg-[#FFF7ED] transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-[var(--training-primary)]/10 flex items-center justify-center text-gray-500 group-hover:text-[var(--training-primary)] transition-colors">
                {option.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--training-primary)]">
                  {option.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
