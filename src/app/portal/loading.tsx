import { SkeletonGrid, SkeletonStats } from "@/components/skeletons";

export default function PortalLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <div className="h-7 bg-skeleton w-48" style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }} />
        <div className="h-3 bg-skeleton w-80" style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }} />
      </div>
      <SkeletonStats count={3} />
      <SkeletonGrid count={6} />
    </div>
  );
}
