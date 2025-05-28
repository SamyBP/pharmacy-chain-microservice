import { Button, CircularProgress, type ButtonProps } from "@mui/material";
import type React from "react";
import { useState } from "react";

interface ActionButtonProps extends ButtonProps {}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children, disabled, ...rest }) => {
    const [loading, setLoading] = useState(false)

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!onClick) {
            return;
        }

        try {
            setLoading(true)
            const result = onClick(event);

            if (result !== undefined && typeof (result as any).then === 'function') {
                await result;
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
					{...rest}
					onClick={handleClick}
					disabled={disabled || loading}
					startIcon={loading ? <CircularProgress size={20} color="inherit" /> : rest.startIcon}
				>
        	{children}
        </Button>
    );

}