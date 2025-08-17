import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

interface ReviewBreadcrumbsProps {
  category?: string;
  city?: string;
  reviewTitle?: string;
}

export function ReviewBreadcrumbs({ category, city, reviewTitle }: ReviewBreadcrumbsProps) {
  return (
    <div className="container mx-auto px-4 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {category && (
            <>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/categoria/${category.toLowerCase()}`}>
                  {category}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          
          {city && (
            <>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/ciudad/${city.toLowerCase()}`}>
                  {city}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          
          {reviewTitle && (
            <>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-[200px] truncate">
                  {reviewTitle}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}