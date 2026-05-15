"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
    useGetWholesalerListQuery, 
    useGetWholesalerProductListQuery, 
    useFetchRelatedResellersMutation, 
    useGetAllAiUsersQuery, 
    useTriggerAiCustomerMutation 
} from "@/redux/features/user/user.api";
import PageHeader from "@/components/shared/PageHeader";
import { 
    Search, 
    ChevronDown, 
    X, 
    Check, 
    Bot, 
    User, 
    Package, 
    Store, 
    Loader2, 
    ArrowLeft,
    Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import getFullImageUrl from "@/utils/getFullImageUrl";
import Image from "next/image";

const TriggerAiCustomerPage = () => {
    const router = useRouter();

    // Form State
    const [selectedWholesaler, setSelectedWholesaler] = useState<any>(null);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [selectedResellers, setSelectedResellers] = useState<any[]>([]);
    const [selectedAiCustomers, setSelectedAiCustomers] = useState<any[]>([]);

    // UI State (Dropdowns open)
    const [wholesalerOpen, setWholesalerOpen] = useState(false);
    const [productOpen, setProductOpen] = useState(false);
    const [resellerOpen, setResellerOpen] = useState(false);
    const [aiUserOpen, setAiUserOpen] = useState(false);

    // Search State
    const [wholesalerSearch, setWholesalerSearch] = useState("");
    const [productSearch, setProductSearch] = useState("");
    const [resellerSearch, setResellerSearch] = useState("");
    const [aiUserSearch, setAiUserSearch] = useState("");

    // API Queries
    const { data: wholesalers, isLoading: loadingWholesalers } = useGetWholesalerListQuery(undefined);
    const { data: products, isFetching: loadingProducts } = useGetWholesalerProductListQuery(selectedWholesaler?.id, {
        skip: !selectedWholesaler?.id
    });
    const { data: aiUsers, isLoading: loadingAiUsers } = useGetAllAiUsersQuery({ search: aiUserSearch });
    
    // API Mutations
    const [getResellers, { data: resellers, isLoading: apiLoadingResellers }] = useFetchRelatedResellersMutation();
    const [triggerAi, { isLoading: isTriggering }] = useTriggerAiCustomerMutation();

    const [isResellerLoading, setIsResellerLoading] = useState(false);
    const loadingResellers = apiLoadingResellers || isResellerLoading;

    // Reset products when wholesaler changes
    useEffect(() => {
        setSelectedProducts([]);
        setSelectedResellers([]);
    }, [selectedWholesaler]);

    // Fetch resellers when selected products change
    useEffect(() => {
        if (selectedProducts.length > 0) {
            setIsResellerLoading(true);
            getResellers({ product_list: selectedProducts.map(p => p.id) });
            // Simulate additional loading time as requested by user
            const timer = setTimeout(() => {
                setIsResellerLoading(false);
            }, 2000); // 2 seconds delay
            return () => clearTimeout(timer);
        } else {
            setSelectedResellers([]);
            setIsResellerLoading(false);
        }
    }, [selectedProducts, getResellers]);

    // Filtered lists for search
    const filteredWholesalers = useMemo(() => {
        if (!wholesalers?.data) return [];
        return wholesalers.data.filter((w: any) => 
            w.full_name?.toLowerCase().includes(wholesalerSearch.toLowerCase()) ||
            w.email?.toLowerCase().includes(wholesalerSearch.toLowerCase())
        );
    }, [wholesalers, wholesalerSearch]);

    const filteredProducts = useMemo(() => {
        if (!products?.data) return [];
        return products.data.filter((p: any) => 
            p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.brand?.toLowerCase().includes(productSearch.toLowerCase())
        );
    }, [products, productSearch]);

    const filteredResellers = useMemo(() => {
        if (!resellers?.data) return [];
        // Map to get the nested reseller objects
        const uniqueResellersMap = new Map();
        resellers.data.forEach((item: any) => {
            if (item.reseller) {
                uniqueResellersMap.set(item.reseller.id, item.reseller);
            }
        });
        
        const resellersList = Array.from(uniqueResellersMap.values());
        
        return resellersList.filter((r: any) => 
            r.full_name?.toLowerCase().includes(resellerSearch.toLowerCase()) ||
            r.email?.toLowerCase().includes(resellerSearch.toLowerCase())
        );
    }, [resellers, resellerSearch]);

    const handleTrigger = async () => {
        if (!selectedWholesaler || selectedProducts.length === 0 || selectedResellers.length === 0 || selectedAiCustomers.length === 0) {
            toast.error("Please fill all fields");
            return;
        }

        if (selectedResellers.length !== selectedAiCustomers.length) {
            toast.error(`Selection mismatch: You have selected ${selectedResellers.length} resellers, so you must select exactly ${selectedResellers.length} AI customers.`);
            return;
        }

        try {
            const payload = {
                wholeseller_id: selectedWholesaler.id,
                product_list: selectedProducts.map(p => [p.id, p.qty || 1]),
                list_of_reseller: selectedResellers.map(r => r.id),
                ai_customers: selectedAiCustomers.map(c => c.id)
            };

            const res = await triggerAi(payload).unwrap();
            if (res.success || res.message) {
                toast.success(res.message || "AI Customers triggered successfully!");
                router.push("/ai-customers");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to trigger AI customers");
        }
    };

    const updateProductQty = (id: number, qty: number) => {
        setSelectedProducts(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, qty) } : p));
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => router.back()}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft className="size-5" />
                </button>
                <PageHeader 
                    title="Trigger AI Customer Activity" 
                    description="Configure and launch automated purchasing activity for AI-driven virtual customers"
                />
            </div>

            <div className="grid gap-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 relative">
                {/* Background Decoration */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                        <Bot className="size-64 rotate-12" />
                    </div>
                </div>

                {/* Step 1: Wholesaler Select */}
                <div className="space-y-3 relative z-10">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Store className="size-4 text-blue-500" />
                        Select Wholesaler
                    </label>
                    <div className="relative">
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setWholesalerOpen(!wholesalerOpen)}
                            onKeyDown={(e) => e.key === 'Enter' && setWholesalerOpen(!wholesalerOpen)}
                            className={cn(
                                "flex w-full items-center justify-between rounded-2xl border bg-slate-50 px-4 py-3.5 text-left text-sm font-medium transition-all cursor-pointer",
                                wholesalerOpen ? "border-blue-500 bg-white ring-4 ring-blue-50" : "border-slate-200 hover:border-slate-300"
                            )}
                        >
                            <span className={cn(selectedWholesaler ? "text-slate-900 font-bold" : "text-slate-400")}>
                                {selectedWholesaler ? selectedWholesaler.full_name : "Choose a wholesaler..."}
                            </span>
                            <ChevronDown className={cn("size-4 text-slate-400 transition-transform", wholesalerOpen && "rotate-180")} />
                        </div>

                        {wholesalerOpen && (
                            <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="relative mb-2">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        autoFocus
                                        placeholder="Search wholesalers..."
                                        value={wholesalerSearch}
                                        onChange={(e) => setWholesalerSearch(e.target.value)}
                                        className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                                    {loadingWholesalers ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="size-6 animate-spin text-blue-500" />
                                        </div>
                                    ) : filteredWholesalers.length > 0 ? (
                                        filteredWholesalers.map((w: any) => (
                                            <button
                                                key={w.id}
                                                onClick={() => {
                                                    setSelectedWholesaler(w);
                                                    setWholesalerOpen(false);
                                                }}
                                                className={cn(
                                                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                                                    selectedWholesaler?.id === w.id ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-600"
                                                )}
                                            >
                                                <div className="size-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                                    {w.image ? (
                                                        <Image src={getFullImageUrl(w.image)} alt={w.full_name} width={32} height={32} className="object-cover" />
                                                    ) : (
                                                        <div className="size-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-xs">
                                                            {w.full_name?.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{w.full_name}</span>
                                                    <span className="text-[10px] opacity-70">{w.email}</span>
                                                </div>
                                                {selectedWholesaler?.id === w.id && <Check className="ml-auto size-4" />}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-xs text-slate-400">No wholesalers found</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Step 2: Product Multi-Select */}
                <div className={cn("space-y-3 relative z-[9]", !selectedWholesaler && "opacity-50 pointer-events-none")}>
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Package className="size-4 text-emerald-500" />
                        Select Products
                    </label>
                    <div className="relative">
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setProductOpen(!productOpen)}
                            onKeyDown={(e) => e.key === 'Enter' && setProductOpen(!productOpen)}
                            className={cn(
                                "flex w-full items-center justify-between rounded-2xl border bg-slate-50 px-4 py-3.5 text-left text-sm font-medium transition-all min-h-[54px] cursor-pointer",
                                productOpen ? "border-emerald-500 bg-white ring-4 ring-emerald-50" : "border-slate-200 hover:border-slate-300"
                            )}
                        >
                            <div className="flex flex-wrap gap-1.5 flex-1 pr-2">
                                {selectedProducts.length > 0 ? (
                                    selectedProducts.map(p => (
                                        <span key={p.id} className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 pl-2 pr-1 py-1 text-xs font-bold text-emerald-700 border border-emerald-100 transition-all">
                                            <span className="truncate max-w-[100px]">{p.name}</span>
                                            <div className="flex items-center bg-white rounded-md border border-emerald-200 overflow-hidden shadow-2xs">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={p.qty || 1}
                                                    onChange={(e) => updateProductQty(p.id, parseInt(e.target.value))}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-10 px-1 py-0.5 text-center text-[10px] font-bold focus:outline-none bg-transparent"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedProducts(prev => prev.filter(item => item.id !== p.id));
                                                }}
                                                className="p-0.5 hover:bg-emerald-100 rounded-md transition-colors"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-400">Select multiple products...</span>
                                )}
                            </div>
                            <ChevronDown className={cn("size-4 text-slate-400 transition-transform flex-shrink-0", productOpen && "rotate-180")} />
                        </div>

                        {productOpen && (
                            <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="relative mb-2">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        autoFocus
                                        placeholder="Search products by name or brand..."
                                        value={productSearch}
                                        onChange={(e) => setProductSearch(e.target.value)}
                                        className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                    />
                                </div>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                                    {loadingProducts ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="size-6 animate-spin text-emerald-500" />
                                        </div>
                                    ) : filteredProducts.length > 0 ? (
                                        filteredProducts.map((p: any) => {
                                            const isSelected = selectedProducts.some(item => item.id === p.id);
                                            return (
                                                <button
                                                    key={p.id}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedProducts(prev => prev.filter(item => item.id !== p.id));
                                                        } else {
                                                            setSelectedProducts(prev => [...prev, { ...p, qty: 1 }]);
                                                        }
                                                    }}
                                                    className={cn(
                                                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                                                        isSelected ? "bg-emerald-50 text-emerald-700" : "hover:bg-slate-50 text-slate-600"
                                                    )}
                                                >
                                                    <div className="size-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                        {p.images?.[0]?.image ? (
                                                            <Image src={getFullImageUrl(p.images[0].image)} alt={p.name} width={40} height={40} className="object-cover" />
                                                        ) : (
                                                            <div className="size-full flex items-center justify-center bg-slate-200 text-slate-400">
                                                                <Package className="size-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-bold truncate">{p.name}</span>
                                                        <span className="text-[10px] opacity-70 font-semibold">{p.brand}</span>
                                                    </div>
                                                    <div className={cn(
                                                        "ml-auto size-5 rounded-md border flex items-center justify-center transition-all",
                                                        isSelected ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-200 bg-white"
                                                    )}>
                                                        {isSelected && <Check className="size-3.5" />}
                                                    </div>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="py-8 text-center text-xs text-slate-400">No products found for this wholesaler</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Step 3: Reseller Multi-Select */}
                <div className={cn("space-y-3 relative z-[8]", selectedProducts.length === 0 && "opacity-50 pointer-events-none")}>
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Store className="size-4 text-purple-500" />
                        Related Resellers
                    </label>
                    <div className="relative">
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setResellerOpen(!resellerOpen)}
                            onKeyDown={(e) => e.key === 'Enter' && setResellerOpen(!resellerOpen)}
                            className={cn(
                                "flex w-full items-center justify-between rounded-2xl border bg-slate-50 px-4 py-3.5 text-left text-sm font-medium transition-all min-h-[54px] cursor-pointer",
                                resellerOpen ? "border-purple-500 bg-white ring-4 ring-purple-50" : "border-slate-200 hover:border-slate-300"
                            )}
                        >
                            <div className="flex flex-wrap gap-1.5 flex-1 pr-2">
                                {selectedResellers.length > 0 ? (
                                    selectedResellers.map(r => (
                                        <span key={r.id} className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2 py-1 text-xs font-bold text-purple-700 border border-purple-100">
                                            {r.full_name}
                                            <X className="size-3 cursor-pointer" onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedResellers(prev => prev.filter(item => item.id !== r.id));
                                            }} />
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-400">Select target resellers...</span>
                                )}
                            </div>
                            <ChevronDown className={cn("size-4 text-slate-400 transition-transform flex-shrink-0", resellerOpen && "rotate-180")} />
                        </div>

                        {resellerOpen && (
                            <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="relative mb-2">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        autoFocus
                                        placeholder="Search related resellers..."
                                        value={resellerSearch}
                                        onChange={(e) => setResellerSearch(e.target.value)}
                                        className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-100"
                                    />
                                </div>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                                    {loadingResellers ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="size-6 animate-spin text-purple-500" />
                                        </div>
                                    ) : filteredResellers.length > 0 ? (
                                        filteredResellers.map((r: any) => {
                                            const isSelected = selectedResellers.some(item => item.id === r.id);
                                            return (
                                                <button
                                                    key={r.id}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedResellers(prev => prev.filter(item => item.id !== r.id));
                                                        } else {
                                                            setSelectedResellers(prev => [...prev, r]);
                                                        }
                                                    }}
                                                    className={cn(
                                                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                                                        isSelected ? "bg-purple-50 text-purple-700" : "hover:bg-slate-50 text-slate-600"
                                                    )}
                                                >
                                                    <div className="size-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                                                        {r.full_name?.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-bold truncate">{r.full_name}</span>
                                                        <span className="text-[10px] opacity-70 truncate">{r.email}</span>
                                                    </div>
                                                    <div className={cn(
                                                        "ml-auto size-5 rounded-md border flex items-center justify-center transition-all",
                                                        isSelected ? "bg-purple-500 border-purple-500 text-white" : "border-slate-200 bg-white"
                                                    )}>
                                                        {isSelected && <Check className="size-3.5" />}
                                                    </div>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="py-8 text-center text-xs text-slate-400">No related resellers found</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Step 4: AI Customer Multi-Select */}
                <div className="space-y-3 relative z-[7]">
                    <label className="text-sm font-bold text-slate-700 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Bot className="size-4 text-amber-500" />
                            AI Customers
                        </div>
                        {selectedResellers.length > 0 && (
                            <span className={cn(
                                "text-[10px] px-2 py-0.5 rounded-full border",
                                selectedAiCustomers.length === selectedResellers.length 
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                    : "bg-amber-50 text-amber-600 border-amber-100"
                            )}>
                                Need {selectedResellers.length} (Selected: {selectedAiCustomers.length})
                            </span>
                        )}
                    </label>
                    <div className="relative">
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setAiUserOpen(!aiUserOpen)}
                            onKeyDown={(e) => e.key === 'Enter' && setAiUserOpen(!aiUserOpen)}
                            className={cn(
                                "flex w-full items-center justify-between rounded-2xl border bg-slate-50 px-4 py-3.5 text-left text-sm font-medium transition-all min-h-[54px] cursor-pointer",
                                aiUserOpen ? "border-amber-500 bg-white ring-4 ring-amber-50" : "border-slate-200 hover:border-slate-300"
                            )}
                        >
                            <div className="flex flex-wrap gap-1.5 flex-1 pr-2">
                                {selectedAiCustomers.length > 0 ? (
                                    selectedAiCustomers.map(c => (
                                        <span key={c.id} className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 border border-amber-100">
                                            {c.full_name}
                                            <X className="size-3 cursor-pointer" onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedAiCustomers(prev => prev.filter(item => item.id !== c.id));
                                            }} />
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-400">
                                        {selectedResellers.length > 0 
                                            ? `Select exactly ${selectedResellers.length} AI customer${selectedResellers.length > 1 ? 's' : ''}...` 
                                            : "Select AI customers..."}
                                    </span>
                                )}
                            </div>
                            <ChevronDown className={cn("size-4 text-slate-400 transition-transform flex-shrink-0", aiUserOpen && "rotate-180")} />
                        </div>

                        {aiUserOpen && (
                            <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="relative mb-3">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        autoFocus
                                        placeholder="Search AI customers..."
                                        value={aiUserSearch}
                                        onChange={(e) => setAiUserSearch(e.target.value)}
                                        className="w-full rounded-xl border border-slate-100 bg-slate-50/50 py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="max-h-64 overflow-y-auto custom-scrollbar p-1 flex flex-col gap-1">
                                    {loadingAiUsers ? (
                                        <div className="flex items-center justify-center py-10">
                                            <Loader2 className="size-8 animate-spin text-amber-500/50" />
                                        </div>
                                    ) : aiUsers?.data && aiUsers.data.length > 0 ? (
                                        aiUsers.data.map((c: any) => {
                                            const isSelected = selectedAiCustomers.some(item => item.id === c.id);
                                            return (
                                                <button
                                                    key={c.id}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedAiCustomers(prev => prev.filter(item => item.id !== c.id));
                                                        } else {
                                                            if (selectedAiCustomers.length >= selectedResellers.length) {
                                                                toast.warning(`You have already selected ${selectedResellers.length} AI customers (1 per reseller).`);
                                                                return;
                                                            }
                                                            setSelectedAiCustomers(prev => [...prev, c]);
                                                        }
                                                    }}
                                                    className={cn(
                                                        "flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-all duration-200",
                                                        isSelected 
                                                            ? "bg-amber-50 text-amber-900" 
                                                            : "hover:bg-slate-50 text-slate-600 hover:translate-x-1"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "size-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm",
                                                        isSelected ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-600"
                                                    )}>
                                                        {c.full_name?.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col min-w-0 flex-1">
                                                        <span className="font-bold text-sm truncate">{c.full_name}</span>
                                                        <span className="text-[11px] opacity-60 truncate font-medium">{c.email}</span>
                                                    </div>
                                                    <div className={cn(
                                                        "size-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                                        isSelected 
                                                            ? "bg-amber-500 border-amber-500 scale-110 shadow-lg shadow-amber-200" 
                                                            : "border-slate-200 bg-white"
                                                    )}>
                                                        {isSelected && <Check className="size-4 text-white" />}
                                                    </div>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="py-10 text-center flex flex-col items-center gap-2">
                                            <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center">
                                                <X className="size-6 text-slate-300" />
                                            </div>
                                            <span className="text-xs text-slate-400 font-medium">No AI users found</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Final Trigger Button */}
                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Summary</span>
                        <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                                <Package className="size-3 text-emerald-500" /> {selectedProducts.length} Products
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                                <Store className="size-3 text-purple-500" /> {selectedResellers.length} Resellers
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                                <Bot className="size-3 text-amber-500" /> {selectedAiCustomers.length} AI Customers
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleTrigger}
                        disabled={isTriggering || !selectedWholesaler || selectedProducts.length === 0 || selectedResellers.length === 0 || selectedAiCustomers.length === 0}
                        className={cn(
                            "inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-sm font-extrabold text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                            "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/25 hover:shadow-2xl"
                        )}
                    >
                        {isTriggering ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                <span>Triggering...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="size-5" />
                                <span>Trigger AI Activity</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
};

export default TriggerAiCustomerPage;