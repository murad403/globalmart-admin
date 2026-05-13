"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateAiCustomerMutation } from "@/redux/features/user/user.api";
import PageHeader from "@/components/shared/PageHeader";
import { ArrowLeft, Bot, Briefcase, Truck, Save, Loader2, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

// Rigorous validation schema mapping exactly the required fields
const aiCustomerSchema = z.object({
    full_name: z.string().min(1, "Full name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(1, "Phone number is required"),
    user_type: z.string(),
    profile: z.object({
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
        phone_number: z.string().min(1, "Phone number is required"),
        business_type: z.string().min(1, "Business type is required"),
        business_name: z.string().min(1, "Business name is required"),
        industry_category: z.string().min(1, "Industry category is required"),
        industry: z.string().min(1, "Industry is required"),
        country: z.string().min(1, "Country is required"),
        state_province: z.string().min(1, "State/Province is required"),
        city: z.string().min(1, "City is required"),
        postal_code: z.string().min(1, "Postal code is required"),
        street_address: z.string().min(1, "Street address is required"),
    }),
    shiping_address: z.object({
        email: z.string().email("Valid shipping email required"),
        phone: z.string().min(1, "Shipping phone required"),
        first_name: z.string().min(1, "Shipping first name required"),
        last_name: z.string().min(1, "Shipping last name required"),
        country: z.string().min(1, "Shipping country required"),
        state: z.string().min(1, "Shipping state required"),
        address: z.string().min(1, "Shipping address required"),
    })
});

type AiCustomerFormValues = z.infer<typeof aiCustomerSchema>;

export default function CreateAiCustomerPage() {
    const router = useRouter();
    const [createAiCustomer, { isLoading }] = useCreateAiCustomerMutation();

    // Image upload state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize clean, empty inputs strictly matching requested JSON payload
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<AiCustomerFormValues>({
        resolver: zodResolver(aiCustomerSchema),
        defaultValues: {
            full_name: "",
            email: "",
            phone: "",
            user_type: "customer",
            profile: {
                first_name: "",
                last_name: "",
                phone_number: "",
                business_type: "",
                business_name: "",
                industry_category: "",
                industry: "",
                country: "",
                state_province: "",
                city: "",
                postal_code: "",
                street_address: "",
            },
            shiping_address: {
                email: "",
                phone: "",
                first_name: "",
                last_name: "",
                country: "",
                state: "",
                address: "",
            }
        }
    });

    const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const clearImageSelection = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit = async (data: AiCustomerFormValues) => {
        try {
            // Build FormData containing exactly the parameters requested
            const formData = new FormData();

            formData.append("full_name", data.full_name);
            formData.append("email", data.email);
            formData.append("phone", data.phone);
            formData.append("user_type", data.user_type);

            // Hardcoded status/verification fields strictly matching your JSON template
            formData.append("is_ai_customer", "true");
            formData.append("is_email_verified", "false");
            formData.append("is_phone_verified", "false");
            formData.append("status", "false");

            // Append nested structures as JSON stringified strings
            formData.append("profile", JSON.stringify(data.profile));
            formData.append("shiping_address", JSON.stringify(data.shiping_address));

            // Append uploaded image if available
            if (imageFile) {
                formData.append("image", imageFile);
            }

            await createAiCustomer(formData).unwrap();
            toast.success(`AI Customer "${data.full_name}" created successfully!`);
            router.push("/ai-customers");
        } catch (error: any) {
            toast.error(
                error?.data?.message || "Failed to create AI customer account."
            );
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
            {/* Top Navigation */}
            <div className="flex items-center justify-between gap-4">
                <Link
                    href="/ai-customers"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-2xs transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    <span>Back to AI Customers</span>
                </Link>
            </div>

            {/* Title Header */}
            <PageHeader
                title="Create AI Customer"
                description="Input basic parameters, entity metadata, and shipping destination to instantiate a new virtual profile"
            />

            {/* Core Form wrapper */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

                {/* SECTION 1: Virtual Persona Profile & Image Upload */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <div className="border-b border-slate-100 bg-slate-900 px-6 py-4 text-white flex items-center gap-2.5">
                        <Bot className="size-5 text-indigo-400" />
                        <h2 className="font-extrabold text-white text-base">Virtual Persona Profile</h2>
                    </div>

                    <div className="p-6 flex flex-col gap-6">
                        {/* Profile Image Uploader */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Profile Image (Optional)
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="relative size-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="size-6 text-slate-400" />
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelection}
                                    className="hidden"
                                />
                                <div className="flex items-center gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                                    >
                                        Choose Image
                                    </button>
                                    {imagePreview && (
                                        <button
                                            type="button"
                                            onClick={clearImageSelection}
                                            className="rounded-xl px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                            <X className="size-3.5" /> Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 pt-2 border-t border-slate-100">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Full Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("full_name", {
                                        onChange: (e) => {
                                            const val = e.target.value || "";
                                            const parts = val.trim().split(" ");
                                            const fName = parts[0] || "";
                                            const lName = parts.slice(1).join(" ") || "";
                                            setValue("profile.first_name", fName);
                                            setValue("profile.last_name", lName);
                                            setValue("shiping_address.first_name", fName);
                                            setValue("shiping_address.last_name", lName);
                                        }
                                    })}
                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                    placeholder="Enter full name"
                                />
                                {errors.full_name && (
                                    <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.full_name.message}</span>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Email <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    {...register("email", {
                                        onChange: (e) => {
                                            setValue("shiping_address.email", e.target.value);
                                        }
                                    })}
                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                    placeholder="Enter email address"
                                />
                                {errors.email && (
                                    <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.email.message}</span>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Phone <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("phone", {
                                        onChange: (e) => {
                                            setValue("profile.phone_number", e.target.value);
                                            setValue("shiping_address.phone", e.target.value);
                                        }
                                    })}
                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                    placeholder="Enter phone number"
                                />
                                {errors.phone && (
                                    <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.phone.message}</span>
                                )}
                            </div>

                            {/* User Type */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    User Type
                                </label>
                                <input
                                    type="text"
                                    {...register("user_type")}
                                    readOnly
                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-500 bg-slate-100 cursor-not-allowed capitalize focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: Business Profile */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <div className="border-b border-slate-100 bg-slate-900 px-6 py-4 text-white flex items-center gap-2.5">
                        <Briefcase className="size-5 text-purple-400" />
                        <h2 className="font-extrabold text-white text-base">Business Profile</h2>
                    </div>

                    <div className="p-6 grid gap-4 md:grid-cols-3">
                        {/* First Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                First Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("profile.first_name")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="First name"
                            />
                            {errors.profile?.first_name && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.profile.first_name.message}</span>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Last Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("profile.last_name")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Last name"
                            />
                            {errors.profile?.last_name && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.profile.last_name.message}</span>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Phone Number <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("profile.phone_number")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Phone number"
                            />
                            {errors.profile?.phone_number && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.profile.phone_number.message}</span>
                            )}
                        </div>

                        {/* Business Type */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Business Type <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("profile.business_type")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Business type"
                            />
                            {errors.profile?.business_type && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.profile.business_type.message}</span>
                            )}
                        </div>

                        {/* Business Name */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Business Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("profile.business_name")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Business name"
                            />
                            {errors.profile?.business_name && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.profile.business_name.message}</span>
                            )}
                        </div>

                        {/* Industry Category */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Industry Category <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("profile.industry_category")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Industry category"
                            />
                            {errors.profile?.industry_category && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.profile.industry_category.message}</span>
                            )}
                        </div>

                        {/* Industry */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Industry <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("profile.industry")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Industry"
                            />
                            {errors.profile?.industry && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.profile.industry.message}</span>
                            )}
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Country <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("profile.country")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Country"
                            />
                            {errors.profile?.country && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.profile.country.message}</span>
                            )}
                        </div>

                        {/* State / Province */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                State / Province <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("profile.state_province")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="State / Province"
                            />
                            {errors.profile?.state_province && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.profile.state_province.message}</span>
                            )}
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                City <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("profile.city")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="City"
                            />
                            {errors.profile?.city && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.profile.city.message}</span>
                            )}
                        </div>

                        {/* Postal Code */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Postal Code <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("profile.postal_code")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Postal code"
                            />
                            {errors.profile?.postal_code && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.profile.postal_code.message}</span>
                            )}
                        </div>

                        {/* Street Address */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Street Address <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("profile.street_address")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Street address"
                            />
                            {errors.profile?.street_address && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.profile.street_address.message}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* SECTION 3: Shipping Address */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <div className="border-b border-slate-100 bg-slate-900 px-6 py-4 text-white flex items-center gap-2.5">
                        <Truck className="size-5 text-emerald-400" />
                        <h2 className="font-extrabold text-white text-base">Shipping Address</h2>
                    </div>

                    <div className="p-6 grid gap-4 md:grid-cols-2">
                        {/* First Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                First Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("shiping_address.first_name")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="First name"
                            />
                            {errors.shiping_address?.first_name && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.shiping_address.first_name.message}</span>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Last Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("shiping_address.last_name")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Last name"
                            />
                            {errors.shiping_address?.last_name && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.shiping_address.last_name.message}</span>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Email <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="email"
                                {...register("shiping_address.email")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Email address"
                            />
                            {errors.shiping_address?.email && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.shiping_address.email.message}</span>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Phone <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("shiping_address.phone")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Phone number"
                            />
                            {errors.shiping_address?.phone && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.shiping_address.phone.message}</span>
                            )}
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Address <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("shiping_address.address")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Street address details"
                            />
                            {errors.shiping_address?.address && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.shiping_address.address.message}</span>
                            )}
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                State <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("shiping_address.state")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="State"
                            />
                            {errors.shiping_address?.state && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.shiping_address.state.message}</span>
                            )}
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Country <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("shiping_address.country")}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-950 focus:border-slate-950 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                                placeholder="Country"
                            />
                            {errors.shiping_address?.country && (
                                <span className="text-xs font-bold text-rose-600 mt-1 block">{errors.shiping_address.country.message}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Final Form Actions Bar */}
                <div className="flex items-center justify-end gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mt-2">
                    <button
                        type="button"
                        onClick={() => router.push("/ai-customers")}
                        className="rounded-xl px-5 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-extrabold text-white shadow-md hover:bg-slate-900 transition-all disabled:opacity-50 cursor-pointer"
                    >
                        {isLoading ? (
                            <Loader2 className="size-4.5 animate-spin" />
                        ) : (
                            <Save className="size-4.5" />
                        )}
                        <span>Create AI Customer</span>
                    </button>
                </div>
            </form>
        </div>
    );
}