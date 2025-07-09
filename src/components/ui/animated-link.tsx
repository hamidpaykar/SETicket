'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnimatedLinkProps {
  href: string;
  text: string;
}

export default function AnimatedLink({ href, text }: AnimatedLinkProps) {
  return (
    <Link href={href} passHref>
      <motion.div
        className='relative inline-block'
        whileHover='hover'
        initial='rest'
      >
        <Button variant='link' size='sm' className='p-0 h-auto'>
          <div className='flex items-center'>
            <span>{text}</span>
            <motion.div
              className='ml-1'
              variants={{
                rest: { x: 0 },
                hover: { x: 4 }
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ArrowRight className='h-4 w-4' />
            </motion.div>
          </div>
        </Button>
      </motion.div>
    </Link>
  );
} 