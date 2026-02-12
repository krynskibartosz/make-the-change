"use client";

import { cn } from "@make-the-change/core/shared/utils";
import { Button } from "@make-the-change/core/ui";
import { ProductCard as SharedProductCard } from "@make-the-change/core/ui/next";
import { Eye, EyeOff, Minus, Plus, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
	type FC,
	type KeyboardEvent,
	type MouseEvent,
	startTransition,
	useEffect,
	useRef,
	useState,
} from "react";
import { updateProductAction } from "@/app/[locale]/admin/(dashboard)/products/actions";
import { useRouter } from "@/i18n/navigation";
import type { Product } from "@/lib/types/product";

type ProductUpdateInput = {
	stock_quantity?: number;
	is_active?: boolean;
};

type ProductCardProps = {
	product: Product;
	view: "grid" | "list";
	onFilterChange?: {
		setCategory: (categoryId: string) => void;
		setProducer: (producerId: string) => void;
		addTag: (tag: string) => void;
	};
};

const getProductContextClass = (product: Product) => {
	const name = (product.name_default || "").toLowerCase();
	const category = (product.category?.name_default || "").toLowerCase();
	const producer = (product.producer?.name_default || "").toLowerCase();

	if (
		name.includes("miel") ||
		name.includes("honey") ||
		category.includes("miel")
	) {
		return "badge-honey";
	}
	if (
		name.includes("huile") ||
		name.includes("olive") ||
		name.includes("oil")
	) {
		return "badge-olive";
	}
	if (
		name.includes("eau") ||
		name.includes("water") ||
		name.includes("aqua") ||
		producer.includes("ocean")
	) {
		return "badge-ocean";
	}
	if (
		producer.includes("terre") ||
		category.includes("agriculture") ||
		name.includes("terre")
	) {
		return "badge-earth";
	}
	return "badge-accent-subtle";
};

export const ProductCard: FC<ProductCardProps> = ({
	product: initialProduct,
	view,
	onFilterChange,
}) => {
	const t = useTranslations("admin.products");
	const locale = useLocale();
	const pendingRequest = useRef<NodeJS.Timeout | null>(null);
	const pendingPatch = useRef<ProductUpdateInput>({});
	const latestCommittedProduct = useRef<Product>(initialProduct);
	const router = useRouter();
	const [product, setProduct] = useState<Product>(initialProduct);

	useEffect(() => {
		if (pendingRequest.current) {
			clearTimeout(pendingRequest.current);
			pendingRequest.current = null;
		}
		pendingPatch.current = {};
		latestCommittedProduct.current = initialProduct;
		setProduct(initialProduct);
	}, [initialProduct]);

	useEffect(() => {
		return () => {
			if (pendingRequest.current) {
				clearTimeout(pendingRequest.current);
			}
		};
	}, []);

	const removeFocusFromParent = (event: MouseEvent | KeyboardEvent) => {
		const listContainer = event.currentTarget.closest('[role="button"]');
		if (listContainer) {
			(listContainer as HTMLElement).blur();
		}
	};

	const applyPatch = async (patch: ProductUpdateInput) => {
		const productId = latestCommittedProduct.current.id || initialProduct.id;
		if (!productId) {
			return;
		}

		const result = await updateProductAction(productId, patch);
		if (!result.success) {
			setProduct(latestCommittedProduct.current);
			throw new Error(result.error || "Échec de mise à jour");
		}
		latestCommittedProduct.current = {
			...latestCommittedProduct.current,
			...patch,
		};
		router.refresh();
	};

	const scheduleMutation = (delay = 500) => {
		if (pendingRequest.current) {
			clearTimeout(pendingRequest.current);
		}

		pendingRequest.current = setTimeout(() => {
			const patch = pendingPatch.current;
			pendingPatch.current = {};
			if (Object.keys(patch).length === 0) {
				pendingRequest.current = null;
				return;
			}
			applyPatch(patch).catch(() => {});
			pendingRequest.current = null;
		}, delay);
	};

	const adjustStock = (delta: number) => {
		let didChange = false;
		setProduct((current) => {
			const currentStock = current.stock_quantity || 0;
			const newStock = Math.max(0, currentStock + delta);
			if (newStock === currentStock) {
				return current;
			}

			didChange = true;
			pendingPatch.current = {
				...pendingPatch.current,
				stock_quantity: newStock,
			};
			return { ...current, stock_quantity: newStock };
		});

		if (!didChange) {
			return;
		}

		startTransition(() => {
			scheduleMutation(500);
		});
	};

	const toggleActive = () => {
		setProduct((current) => {
			const newActive = !current.is_active;
			pendingPatch.current = { ...pendingPatch.current, is_active: newActive };
			return { ...current, is_active: newActive };
		});

		startTransition(() => {
			scheduleMutation(300);
		});
	};

	const actions = (
		<div
			className="flex w-full items-center justify-between gap-4"
			data-card-action
		>
			<div className="flex items-center gap-3">
				<div className="group inline-flex items-center overflow-hidden border bg-background shadow-sm dark:rounded-xl dark:bg-card dark:shadow-black/10">
					<Button
						aria-label={t("stock.increase")}
						className="h-10 rounded-none border-0 px-3 text-muted-foreground transition-all duration-200 hover:bg-primary/8 hover:text-primary active:scale-95"
						size="sm"
						title={t("stock.increase")}
						variant="ghost"
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
							removeFocusFromParent(event);
							adjustStock(1);
						}}
					>
						<Plus className="h-4 w-4" />
					</Button>

					<div className="relative min-w-[4rem] border-x px-4 py-2 text-center dark:bg-muted/20">
						<span className="text-sm font-semibold tabular-nums text-foreground">
							{product.stock_quantity || 0}
						</span>
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-primary/10" />
					</div>

					<Button
						aria-label={t("stock.decrease")}
						className="h-10 rounded-none border-0 px-3 text-muted-foreground transition-all duration-200 hover:bg-destructive/8 hover:text-destructive active:scale-95 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
						disabled={product.stock_quantity === 0}
						size="sm"
						title={t("stock.decrease")}
						variant="ghost"
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
							removeFocusFromParent(event);
							adjustStock(-1);
						}}
					>
						<Minus className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<div
					aria-checked={product.is_active ? "true" : "false"}
					aria-label={
						product.is_active ? t("visibility.hide") : t("visibility.show")
					}
					role="switch"
					tabIndex={0}
					className={cn(
						"relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 transition-all duration-200 ease-in-out focus-within:ring-2 focus-within:ring-primary/20 dark:focus-within:ring-primary/30",
						product.is_active
							? "border-success bg-success shadow-sm dark:shadow-success/20"
							: "bg-muted dark:hover:bg-muted/60",
					)}
					onClick={(event) => {
						event.preventDefault();
						event.stopPropagation();
						removeFocusFromParent(event);
						toggleActive();
					}}
					onKeyDown={(event) => {
						if (!(event.key === "Enter" || event.key === " ")) {
							return;
						}
						event.preventDefault();
						event.stopPropagation();
						toggleActive();
					}}
				>
					<span
						className={cn(
							"inline-block h-5 w-5 transform rounded-full bg-background shadow-sm transition-transform duration-200 ease-in-out dark:shadow-black/20",
							product.is_active ? "translate-x-5" : "translate-x-0",
						)}
					/>
				</div>

				<div className="flex items-center gap-1.5 text-sm">
					<div
						className={cn(
							"flex items-center justify-center transition-colors duration-200",
							product.is_active ? "text-success" : "text-muted-foreground",
						)}
					>
						{product.is_active ? (
							<Eye className="h-4 w-4" />
						) : (
							<EyeOff className="h-4 w-4" />
						)}
					</div>
					<span
						className={cn(
							"font-medium transition-colors duration-200",
							product.is_active ? "text-foreground" : "text-muted-foreground",
						)}
					>
						{product.is_active
							? t("visibility.visible")
							: t("visibility.hidden")}
					</span>
				</div>
			</div>
		</div>
	);

	const featuredButton = product.featured ? (
		<button
			type="button"
			data-card-action
			className="pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-110 hover:text-accent hover:drop-shadow-sm active:scale-95"
			title={t("filters_tooltip.featured")}
			onClick={(event) => {
				event.preventDefault();
				event.stopPropagation();
				removeFocusFromParent(event);
			}}
		>
			<Star className="h-4 w-4 fill-current text-accent-subtle" />
		</button>
	) : undefined;

	const metaChips = (
		<div data-card-action className="contents">
			{product.category && (
				<button
					type="button"
					className="badge-subtle pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-105 hover:border-primary/30 hover:bg-primary/15 hover:text-primary hover:shadow-sm active:scale-95"
					title={t("filters_tooltip.category", {
						name: product.category.name_default || "",
					})}
					onClick={(event) => {
						event.preventDefault();
						event.stopPropagation();
						removeFocusFromParent(event);
						if (onFilterChange && product.category) {
							onFilterChange.setCategory(product.category.id);
						}
					}}
				>
					{product.category.name_default}
				</button>
			)}

			{product.secondary_category && (
				<button
					type="button"
					className="tag-subtle pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-105 hover:border-accent/40 hover:bg-accent/20 hover:text-accent active:scale-95"
					title={t("filters_tooltip.subcategory", {
						name: product.secondary_category.name_default || "",
					})}
					onClick={(event) => {
						event.preventDefault();
						event.stopPropagation();
						removeFocusFromParent(event);
						if (onFilterChange && product.secondary_category) {
							onFilterChange.setCategory(product.secondary_category.id);
						}
					}}
				>
					{product.secondary_category.name_default}
				</button>
			)}

			{product.producer && (
				<button
					type="button"
					className={cn(
						getProductContextClass(product),
						"pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-105 hover:brightness-110 hover:shadow-sm active:scale-95",
					)}
					title={t("filters_tooltip.producer", {
						name: product.producer.name_default || "",
					})}
					onClick={(event) => {
						event.preventDefault();
						event.stopPropagation();
						removeFocusFromParent(event);
						if (onFilterChange && product.producer) {
							onFilterChange.setProducer(product.producer.id);
						}
					}}
				>
					{product.producer.name_default}
				</button>
			)}

			{product.partner_source && (
				<span className="tag-subtle">{product.partner_source}</span>
			)}

			{product.tags?.slice(0, view === "grid" ? 3 : 4).map((tag) => (
				<button
					type="button"
					key={tag}
					className="pointer-events-auto inline-flex cursor-pointer items-center rounded-md border border-muted/60 bg-muted/50 px-2 py-1 text-xs text-muted-foreground transition-all duration-200 hover:scale-105 hover:border-muted-foreground/80 hover:bg-muted hover:text-foreground hover:shadow-sm active:scale-95"
					title={t("filters_tooltip.tag", { tag })}
					onClick={(event) => {
						event.preventDefault();
						event.stopPropagation();
						removeFocusFromParent(event);
						if (onFilterChange) {
							onFilterChange.addTag(tag);
						}
					}}
				>
					{tag}
				</button>
			))}

			{view === "list" && product.tags && product.tags.length > 4 && (
				<span className="inline-flex items-center px-2 py-0.5 text-xs font-medium tracking-wide text-muted-foreground/60">
					{t("other_tags", { count: product.tags.length - 4 })}
				</span>
			)}
		</div>
	);

	return (
		<SharedProductCard
			context="admin"
			view={view}
			model={{
				id: product.id || "",
				href: `/${locale}/admin/products/${product.id}`,
				title: product.name_default || "",
				subtitle:
					view === "list"
						? product.slug || undefined
						: product.short_description_default || undefined,
				description:
					view === "grid"
						? undefined
						: product.short_description_default || undefined,
				image: {
					src: product.images?.[0] || undefined,
					alt: product.name_default || "",
					blurDataURL: product.cover_blur_data_url || undefined,
				},
				pricePoints: product.price_points,
				stockQuantity: product.stock_quantity ?? 0,
			}}
			labels={{
				pointsLabel: t("stock.points_label"),
				stockLabel: t("stock.label"),
				viewLabel: "",
			}}
			slots={{
				topRight: featuredButton,
				footerActions: actions,
				metaChips,
			}}
		/>
	);
};
