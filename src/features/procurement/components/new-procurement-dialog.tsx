// NOTE: This component has been replaced with direct page navigation
// The procurement form now opens in a dedicated page at /dashboard/procurement/new
// instead of in a dialog/modal popup

/*
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { ProcurementForm } from '@/components/ui/procurement-form';

interface NewProcurementDialogProps {
  trigger?: React.ReactNode;
}

export default function NewProcurementDialog({ trigger }: NewProcurementDialogProps) {
  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    setOpen(false);
  };

  const defaultTrigger = (
    <Button>
      <Plus className='mr-2 h-4 w-4' />
      New Request
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className='max-w-[95vw] max-h-[95vh] overflow-y-auto p-0 w-full'>
        <DialogHeader className='px-6 pt-6 pb-2'>
          <DialogTitle className='text-2xl font-bold'>Create New Procurement Request</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new procurement ticket. All required fields must be completed.
          </DialogDescription>
        </DialogHeader>
        <div className='px-6 pb-6'>
          <ProcurementForm onCancel={handleCancel} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
*/ 