import { SplashAnimator } from "@/components/layout/SplashAnimator";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <SplashAnimator>
      {children}
    </SplashAnimator>
  );
}
