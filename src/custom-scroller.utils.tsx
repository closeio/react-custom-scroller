/**
 * Utility to create dynamic and conditionally class name
 */
export const createClassName = (...args: (string | undefined)[]) => args.filter(Boolean).join(' ');
