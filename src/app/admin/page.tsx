"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  LockIcon, 
  MusicNote01Icon, 
  Ticket01Icon, 
  Delete02Icon, 
  Logout01Icon,
  CloudUploadIcon,
  Album01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PromoCode } from "@/lib/db/d1-client";

const ADMIN_PASSWORD = "nilxnjxn-admin-2026";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<"catalog" | "promos">("catalog");
  const [isLoading, setIsLoading] = useState(false);

  // Catalog Form
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("₹49");
  const [itemType, setItemType] = useState<"song" | "album">("song");
  const [season, setSeason] = useState<"FRESH" | "AKAD" | "LATE">("FRESH");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // Promo Form
  const [promoCode, setPromoCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState<"fixed" | "percentage">("fixed");
  const [promos, setPromos] = useState<PromoCode[]>([]);

  // Fetch data
  useEffect(() => {
    if (authed && activeTab === 'promos') {
      fetchPromos();
    }
  }, [authed, activeTab]);

  const fetchPromos = async () => {
    try {
      const res = await fetch("/api/admin/promo", {
        headers: { "Authorization": `Bearer ${password}` }
      });
      if (res.ok) {
        const data = await res.json() as PromoCode[];
        setPromos(data);
      }
    } catch (err) {
      console.error("Failed to fetch promos", err);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      toast.success("Identity Verified. Welcome back.");
    } else {
      toast.error("Invalid access credentials.");
    }
  };

  const uploadToR2 = async (file: File, pathPrefix: string, bucket: string) => {
    const filename = `${pathPrefix}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, "")}`;
    const presignRes = await fetch("/api/admin/s3-presign", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${password}` },
      body: JSON.stringify({ filename, contentType: file.type, bucket }),
    });
    const data = await presignRes.json() as any;
    const { uploadUrl, key } = data;
    await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
    return key;
  };

  const handlePublishCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !price || !coverFile || !audioFile) {
      toast.error("Missing required metadata or assets.");
      return;
    }
    setIsLoading(true);
    try {
      const coverKey = await uploadToR2(coverFile, "covers", "public-assets");
      const audioKey = await uploadToR2(audioFile, "shades", "audio-files");
      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${password}` },
        body: JSON.stringify({
          title, slug, price, item_type: itemType, season, artist: "NILXNJXN",
          cover_url: `https://pub-605f0bbe88d44b79a7f56d3b4cd9feff.r2.dev/${coverKey}`,
          r2_download_key: audioKey
        })
      });
      if (!res.ok) throw new Error("Database push failed.");
      toast.success(`${title} is now live.`);
      setSlug(""); setTitle(""); setCoverFile(null); setAudioFile(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publishing failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode || !discountValue) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${password}` },
        body: JSON.stringify({ code: promoCode, discountValue, discountType })
      });
      if (!res.ok) throw new Error("Failed to create coupon.");
      toast.success(`Coupon ${promoCode.toUpperCase()} Created.`);
      setPromoCode(""); setDiscountValue("");
      fetchPromos();
    } catch (err) {
      toast.error("Coupon creation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePromo = async (code: string) => {
    try {
      const res = await fetch("/api/admin/promo", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${password}` },
        body: JSON.stringify({ code })
      });
      if (res.ok) {
        toast.success(`Coupon ${code} Revoked.`);
        fetchPromos();
      }
    } catch (err) {
      toast.error("Revocation failed.");
    }
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm space-y-12 text-center"
        >
          <div className="space-y-4">
            <HugeiconsIcon icon={LockIcon} size={40} className="mx-auto text-white/20" />
            <h1 className="font-expressive text-3xl tracking-widest text-white">SYSTEM ACCESS</h1>
          </div>
          <form onSubmit={handleAuth} className="space-y-6">
            <input 
              type="password" 
              placeholder="IDENTITY KEY"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-b border-white/10 bg-transparent py-4 text-center font-mono text-sm tracking-[0.5em] text-white focus:border-white/40 focus:outline-none"
            />
            <button type="submit" className="w-full rounded-full bg-white py-4 text-[10px] font-bold tracking-[0.3em] text-black uppercase transition-all hover:bg-neutral-200">
              VERIFY ACCESS
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Cinematic Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-3xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-12">
            <h2 className="font-expressive text-xl tracking-tighter">ADMIN</h2>
            <div className="flex gap-8">
              {[
                { id: "catalog" as const, label: "CATALOG", icon: MusicNote01Icon },
                { id: "promos" as const, label: "COUPONS", icon: Ticket01Icon },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "group flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase transition-all",
                    activeTab === tab.id ? "text-white" : "text-white/40 hover:text-white/60"
                  )}
                >
                  <HugeiconsIcon icon={tab.icon} size={14} className={cn("transition-transform group-hover:scale-110", activeTab === tab.id ? "text-accent" : "")} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setAuthed(false)} className="text-white/40 transition-colors hover:text-white">
            <HugeiconsIcon icon={Logout01Icon} size={20} />
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 pt-32 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === "catalog" ? (
            <motion.div 
              key="catalog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h3 className="font-expressive text-4xl">Publishing</h3>
                <p className="font-functional text-[10px] tracking-[0.5em] text-white/40 uppercase">Broadcast to storefront</p>
              </div>

              <form onSubmit={handlePublishCatalog} className="space-y-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-8 rounded-3xl border border-white/5 bg-white/2 p-8 backdrop-blur-xl">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">Track Name</label>
                        <input value={title} onChange={e => { setTitle(e.target.value); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));}} placeholder="EPHEMERAL" className="w-full bg-transparent font-expressive text-xl focus:outline-none" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">Slug Path</label>
                         <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-transparent font-mono text-xs tracking-widest text-white/60 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">Price</label>
                          <input value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-transparent font-functional text-lg focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">Format</label>
                          <select value={itemType} onChange={e => setItemType(e.target.value as any)} className="w-full bg-transparent font-functional text-xs tracking-widest focus:outline-none [&>option]:bg-black">
                            <option value="song">SINGLE</option>
                            <option value="album">BUNDLE</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8 rounded-3xl border border-white/5 bg-white/2 p-8 backdrop-blur-xl">
                    <label className="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">Shade Spectrum</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['FRESH', 'AKAD', 'LATE'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSeason(s as any)}
                          className={cn(
                            "group flex flex-col items-center gap-4 rounded-xl border border-white/5 py-6 transition-all",
                            season === s ? "bg-white text-black" : "bg-white/2 hover:bg-white/10"
                          )}
                        >
                          <div className={cn(
                            "h-2 w-2 rounded-full",
                            s === 'FRESH' ? "bg-emerald-500" : s === 'AKAD' ? "bg-orange-500" : "bg-cyan-500",
                            season === s ? "animate-pulse" : "opacity-40"
                          )} />
                          <span className="text-[8px] font-bold tracking-widest">{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="group relative rounded-3xl border border-white/10 border-dashed bg-white/2 p-12 text-center transition-all hover:bg-white/5">
                    <input type="file" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="absolute inset-0 cursor-pointer opacity-0" accept="image/*" />
                    <HugeiconsIcon icon={Album01Icon} size={32} className="mx-auto mb-6 text-white/20 transition-transform group-hover:scale-110 group-hover:text-white/40" />
                    <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
                      {coverFile ? coverFile.name : "COVER ART"}
                    </span>
                  </div>
                  <div className="group relative rounded-3xl border border-white/10 border-dashed bg-white/2 p-12 text-center transition-all hover:bg-white/5">
                    <input type="file" onChange={e => setAudioFile(e.target.files?.[0] || null)} className="absolute inset-0 cursor-pointer opacity-0" accept=".mp3,.wav,.zip" />
                    <HugeiconsIcon icon={CloudUploadIcon} size={32} className="mx-auto mb-6 text-white/20 transition-transform group-hover:scale-110 group-hover:text-white/40" />
                    <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
                      {audioFile ? audioFile.name : "MASTER AUDIO"}
                    </span>
                  </div>
                </div>

                <button disabled={isLoading} className="group relative w-full overflow-hidden rounded-full bg-white py-10 shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50">
                  <span className="relative z-10 text-[11px] font-bold tracking-[0.8em] text-black uppercase">
                    {isLoading ? "BROADCASTING FREQUENCY..." : "COMMIT TO NETWORK"}
                  </span>
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
               key="promos"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-16"
            >
              <div className="space-y-2">
                <h3 className="font-expressive text-4xl">Protocols</h3>
                <p className="font-functional text-[10px] tracking-[0.5em] text-white/40 uppercase">Discount Signatures</p>
              </div>

              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <form onSubmit={handleCreatePromo} className="space-y-8 sticky top-32">
                    <div className="space-y-6 rounded-3xl border border-white/5 bg-white/2 p-8">
                       <div className="space-y-4">
                          <label className="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">Code Name</label>
                          <input value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="NILA100" className="w-full bg-transparent font-mono text-2xl tracking-tighter text-white focus:outline-none" />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">Value</label>
                          <div className="flex items-center gap-4">
                            <input value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder="0" className="w-1/2 bg-transparent font-functional text-2xl focus:outline-none" />
                            <select value={discountType} onChange={e => setDiscountType(e.target.value as any)} className="w-1/2 bg-transparent text-[10px] font-bold tracking-widest focus:outline-none [&>option]:bg-black">
                               <option value="fixed">FLAT (INR)</option>
                               <option value="percentage">PERCENT (%)</option>
                            </select>
                          </div>
                       </div>
                       <button disabled={isLoading} className="w-full rounded-full bg-white/10 py-4 text-[9px] font-bold tracking-[0.2em] text-white uppercase hover:bg-white hover:text-black transition-all">
                          GENERATE PROTOCOL
                       </button>
                    </div>
                  </form>
                </div>

                <div className="lg:col-span-2">
                   <div className="space-y-4">
                      {promos.length === 0 && (
                        <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl">
                           <p className="text-[10px] tracking-[0.4em] text-white/20 uppercase">No active protocols found</p>
                        </div>
                      )}
                      {promos.map(promo => (
                        <div key={promo.code} className="flex items-center justify-between p-8 rounded-3xl border border-white/5 bg-white/1 hover:bg-white/3 transition-colors">
                           <div className="flex items-center gap-8">
                              <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center bg-white/2">
                                 <HugeiconsIcon icon={Ticket01Icon} size={20} className="text-accent" />
                              </div>
                              <div className="space-y-1">
                                 <h4 className="font-mono text-lg tracking-tighter">{promo.code}</h4>
                                 <p className="text-[9px] tracking-widest text-white/40 uppercase">
                                   - {promo.discount_value}{promo.discount_type === 'percentage' ? '%' : ' Rs'} Active
                                 </p>
                              </div>
                           </div>
                           <button onClick={() => handleDeletePromo(promo.code)} className="h-10 w-10 flex items-center justify-center rounded-full text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all">
                              <HugeiconsIcon icon={Delete02Icon} size={18} />
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
