import { ProductCardSkeleton as SharedProductCardSkeleton } from "@make-the-change/core/ui/next";
import type { FC } from "react";

export const ProductCardSkeleton: FC = () => (
	<SharedProductCardSkeleton context="admin" view="grid" />
);

export const ProductListSkeleton: FC = () => (
	<SharedProductCardSkeleton context="admin" view="list" />
);
