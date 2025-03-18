import { Tooltip } from 'react-tooltip';

interface TooltipIconProps {
  id: string;
  content: string;
  icon: JSX.Element;
}

export const TooltipIcon = ({ id, content, icon }: TooltipIconProps) => (
  <>
    <Tooltip id={id} />
    <span data-tooltip-id={id} data-tooltip-content={content}>
      {icon}
    </span>
  </>
);