import Piece from '@/components/Piece';
import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface UserProfileProps {
  color: Color;
}

export default function UserProfile({
  color,
  className,
}: React.PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & UserProfileProps
>): JSX.Element {
  return (
    <div className={twMerge('h-full aspect-square rounded-sm', className)}>
      <div
        className="w-full h-full flex justify-center items-center p-[10%] rounded-sm"
        style={{ backgroundColor: color === 'white' ? '#FFF' : '#000' }}
      >
        <Piece piece={color === 'white' ? 'K' : 'k'} />
      </div>
    </div>
  );
}
