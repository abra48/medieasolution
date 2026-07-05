import { SkeletonTable, SkeletonStats } from "@/components/skeletons";

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <div className="h-7 bg-skeleton w-56" style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }} />
        <div className="h-3 bg-skeleton w-72" style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }} />
      </div>
      <SkeletonStats count={3} />
      <SkeletonTable rows={6} cols={5} />
    </div>
  );
}
