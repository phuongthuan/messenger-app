import * as React from 'react';

export interface UserAvatarProps {
  className?: string;
  isSender?: boolean;
}

function UserAvatar({ className, isSender = false }: UserAvatarProps) {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
      className={`w-7 h-7 border-2 rounded-full ${isSender ? 'border-indigo-500' : 'border-purple-400'} ${className}`}
    />
  );
}

export default UserAvatar;
