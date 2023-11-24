"use client";

import { ReactNode } from "react";

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto px-6">{children}</div>
);

export { Wrapper };
