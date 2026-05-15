"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Check, Loader2, MessageSquare, AlertCircle, Info, ChevronRight } from "lucide-react";
import { useGetNotificationsQuery, useGetNotificationsUnseenCountQuery } from "@/redux/features/message/message.api";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { useNotificationWS } from "@/utils/nws";

const NotificationDropdown = () => {
    // Initialize WebSocket
    useNotificationWS();

    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [allNotifications, setAllNotifications] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    const { data: unseenData } = useGetNotificationsUnseenCountQuery(undefined);
    const { data: notificationsData, isFetching, isLoading } = useGetNotificationsQuery(page, {
        skip: !isOpen && page === 1,
    });

    const unseenCount = unseenData?.total_unseen_note || 0;

    // Reset when closing
    useEffect(() => {
        if (!isOpen) {
            setPage(1);
            setAllNotifications([]);
            setHasMore(true);
        }
    }, [isOpen]);

    // Append new notifications
    useEffect(() => {
        if (notificationsData?.success && notificationsData.data) {
            if (page === 1) {
                setAllNotifications(notificationsData.data);
            } else {
                setAllNotifications((prev) => {
                    // Avoid duplicates
                    const newIds = new Set(notificationsData.data.map((n: any) => n.id));
                    const filteredPrev = prev.filter((n) => !newIds.has(n.id));
                    return [...filteredPrev, ...notificationsData.data];
                });
            }
            
            if (!notificationsData.meta.next) {
                setHasMore(false);
            }
        }
    }, [notificationsData, page]);

    const lastNotificationElementRef = useCallback(
        (node: any) => {
            if (isFetching) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetching, hasMore]
    );

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case "success":
                return <div className="p-2 bg-emerald-100 rounded-full text-emerald-600"><Check className="size-4" /></div>;
            case "warning":
                return <div className="p-2 bg-amber-100 rounded-full text-amber-600"><AlertCircle className="size-4" /></div>;
            case "info":
                return <div className="p-2 bg-blue-100 rounded-full text-blue-600"><Info className="size-4" /></div>;
            default:
                return <div className="p-2 bg-slate-100 rounded-full text-slate-600"><MessageSquare className="size-4" /></div>;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative grid size-10 place-items-center rounded-full transition-all duration-200",
                    isOpen ? "bg-white shadow-sm text-primary" : "text-slate-600 hover:bg-white hover:text-primary"
                )}
                aria-label="Notifications"
            >
                <Bell className={cn("size-5", unseenCount > 0 && "animate-tada")} />
                {unseenCount > 0 && (
                    <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-[#f4f6fb]">
                        {unseenCount > 9 ? "9+" : unseenCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 origin-top-right rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <h3 className="text-base font-semibold text-slate-900">Notifications</h3>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-medium">
                            {unseenCount} New
                        </Badge>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                        {allNotifications.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {allNotifications.map((notification, index) => (
                                    <div
                                        key={notification.id}
                                        ref={index === allNotifications.length - 1 ? lastNotificationElementRef : null}
                                        className="group relative flex gap-4 px-5 py-4 transition-colors hover:bg-slate-50 cursor-pointer"
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            {getIcon(notification.note_type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <p className="text-sm font-semibold text-slate-900 truncate">
                                                    {notification.title}
                                                </p>
                                                <ChevronRight className="size-3 text-slate-300 group-hover:text-slate-400" />
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                {notification.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {isFetching && (
                                    <div className="flex items-center justify-center p-4">
                                        <Loader2 className="size-5 animate-spin text-primary/40" />
                                    </div>
                                )}
                            </div>
                        ) : isLoading ? (
                            <div className="space-y-4 p-5">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <Skeleton className="size-10 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
                                <div className="mb-4 rounded-full bg-slate-50 p-4">
                                    <Bell className="size-8 text-slate-300" />
                                </div>
                                <p className="text-sm font-medium text-slate-900">No notifications yet</p>
                                <p className="mt-1 text-xs text-slate-500">We'll let you know when something happens.</p>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
