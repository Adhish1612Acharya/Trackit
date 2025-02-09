import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

const ProjectCardSkeleton = () => {
  return (
    <Card className="overflow-hidden w-1/4">
      <Skeleton className="h-48 w-full" />
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-2 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

ProjectCardSkeleton.propTypes = {};

export default ProjectCardSkeleton;
