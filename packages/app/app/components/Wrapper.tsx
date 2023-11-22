import { ReactNode } from "react";

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div className="max-w-xl mx-auto px-3">{children}</div>
);

export { Wrapper };
