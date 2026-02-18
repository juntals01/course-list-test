// components/custom-ui/custom-table/row-action-menu.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Ellipsis } from 'lucide-react';
import { APPS } from '@/types/ENUMS';
import Themes from '../styling/Themes';
import React from 'react';
import { Glowing } from '../styling/glowing';
import Spinner from '#components/ui/spinner';
import { cn } from '@/lib/utils';

interface RowActionMenuProps {
  app?: APPS;
  isLoading?: boolean;
  menuItems: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    className?: string; // Added className to interface
  }[];
}

const RowActionMenu: React.FC<RowActionMenuProps> = ({
  menuItems,
  isLoading = false,
  app = APPS.PORTAL,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 p-0 ${Glowing(app).icon}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner size={16} />
          ) : (
            <Ellipsis className={`h-4 w-4 ${Glowing(app).icon}`} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={Themes(app).dropdownMenu.content}
      >
        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.label}
            className={`${Themes(app).dropdownMenu.item}`}
            onClick={item.onClick}
          >
            {item.icon}
            <span className={cn("text-sm text-grey-700 align-left", item.className)}>
              {item.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RowActionMenu;
