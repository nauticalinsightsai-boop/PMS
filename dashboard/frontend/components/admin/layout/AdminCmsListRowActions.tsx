'use client';

import React from 'react';
import { Edit2, Trash2, GripVertical } from 'lucide-react';

const editBtnClass =
 'p-2 hover:bg-brand-surface r-card-sm text-brand-muted hover:text-brand-accent transition-colors duration-200';
const deleteBtnClass =
 'p-2 hover:bg-red-50 r-card-sm text-brand-muted hover:text-red-600 transition-colors duration-200';

export type AdminCmsListRowActionsProps = {
 onEdit?: () => void;
 onDelete: () => void;
 showEdit?: boolean;
 /** When false, grip shows disabled (manual sort required). */
 dragEnabled?: boolean;
 dragTitle?: string;
 disabledDragTitle?: string;
};

/** Edit / delete / drag grip — matches Discover (Website Data) list rows. */
export function AdminCmsListRowActions({
 onEdit,
 onDelete,
 showEdit = true,
 dragEnabled = true,
 dragTitle = 'Drag to reorder',
 disabledDragTitle = 'Switch sort to Manual order to drag',
}: AdminCmsListRowActionsProps) {
 return (
  <div className="flex items-center gap-1 shrink-0">
   {showEdit && onEdit ? (
   <button type="button" onClick={onEdit} className={editBtnClass} title="Edit" aria-label="Edit">
    <Edit2 size={14} />
   </button>
   ) : null}
   <button type="button" onClick={onDelete} className={deleteBtnClass} title="Delete" aria-label="Delete">
    <Trash2 size={14} />
   </button>
   <div
    className={`p-2 r-card-sm transition-colors duration-200 ${
     dragEnabled
      ? 'text-brand-muted hover:text-brand-accent cursor-grab active:cursor-grabbing'
      : 'text-brand-muted/40 cursor-not-allowed'
    }`}
    title={dragEnabled ? dragTitle : disabledDragTitle}
    aria-hidden
   >
    <GripVertical size={14} />
   </div>
  </div>
 );
}
