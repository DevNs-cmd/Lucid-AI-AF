import type { SVGProps } from "react";

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.3-1.72 3.8-5.5 3.8-3.3 0-6-2.73-6-6.1s2.7-6.1 6-6.1c1.88 0 3.14.8 3.86 1.48l2.63-2.53C16.83 3.13 14.66 2.2 12 2.2 6.87 2.2 2.7 6.37 2.7 11.5S6.87 20.8 12 20.8c6.93 0 9.5-4.86 9.5-8.83 0-.6-.07-1.05-.15-1.77H12z"
      />
    </svg>
  );
}
