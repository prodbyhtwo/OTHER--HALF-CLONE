// client/components/builder/LinkButton.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { validateComponentProps, linkButtonSchema } from "./registry";
import { cn } from "@/lib/utils";

interface LinkButtonProps {
  text: string;
  to: string;
  external?: boolean;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  className?: string;
}

export function LinkButton(props: LinkButtonProps) {
  // Validate props at runtime
  const validatedProps = validateComponentProps('LinkButton', props, linkButtonSchema);
  const { 
    text, 
    to, 
    external = false, 
    variant = 'link', 
    size = 'default',
    className
  } = validatedProps;
  
  // Determine if link is external based on URL or explicit prop
  const isExternal = external || to.startsWith('http');
  
  if (isExternal) {
    return (
      <Button
        variant={variant}
        size={size}
        asChild
        className={className}
      >
        <a 
          href={to} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label={`${text} (opens in new tab)`}
        >
          {text}
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    );
  }
  
  return (
    <Button
      variant={variant}
      size={size}
      asChild
      className={className}
    >
      <Link to={to} aria-label={text}>
        {text}
      </Link>
    </Button>
  );
}

export default LinkButton;
