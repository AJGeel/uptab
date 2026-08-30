import { useCallback, useEffect, useRef, useState } from "react";

const useLongHover = (delay = 1000) => {
    const [isLongHovering, setIsLongHovering] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const onMouseEnter = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            setIsLongHovering(true);
        }, delay);
    }, [delay]);

    const onMouseLeave = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setIsLongHovering(false);
    }, []);

    useEffect(
        () => () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        },
        [],
    );

    return {
        isLongHovering,
        hoverProps: {
            onMouseEnter,
            onMouseLeave,
        },
    };
};

export default useLongHover;
