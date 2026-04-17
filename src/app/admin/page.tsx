"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("₹49");
  const [itemType, setItemType] = useState("song");
  const [season, setSeason] = useState("FRESH");
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // Authenticate simple
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length > 3) setAuthed(true);
    else toast.error("Enter a valid admin password.");
  };

  const uploadToR2 = async (file: File, pathPrefix: string, bucket: string) => {
    const filename = `${pathPrefix}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, "")}`;
    
    const presignRes = await fetch("/api/admin/s3-presign", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${password}` },
      body: JSON.stringify({ filename, contentType: file.type, bucket }),
    });
    
    if (!presignRes.ok) throw new Error(`Presign failed for ${file.name}`);
    
    const { uploadUrl, key } = await presignRes.json() as { uploadUrl: string; key: string };

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    
    if (!uploadRes.ok) throw new Error(`Upload failed for ${file.name}`);
    return key;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !price || !coverFile || !audioFile) {
       toast.error("Please fill all required fields and select both files");
       return;
    }

    setIsLoading(true);
    
    try {
       // 1. Upload Cover Art to PUBLIC bucket
       toast("Uploading Cover Art...");
       const coverKey = await uploadToR2(coverFile, "covers", "public-assets");
       
       // 2. Upload Audio File to PRIVATE bucket
       toast("Uploading Private Audio File...");
       const audioKey = await uploadToR2(audioFile, "shades", "audio-files");
       
       // 3. Save to D1
       toast("Saving Metadata to D1 Database...");
       const catalogRes = await fetch("/api/admin/catalog", {
           method: "POST",
           headers: { "Content-Type": "application/json", "Authorization": `Bearer ${password}` },
           body: JSON.stringify({
               title,
               slug,
               price,
               item_type: itemType,
               season,
               artist: "NILXNJXN",
               cover_url: `https://pub-605f0bbe88d44b79a7f56d3b4cd9feff.r2.dev/${coverKey}`,
               preview_url: null, // Omitted streaming preview for simplicity
               r2_download_key: audioKey
           })
       });

       if (!catalogRes.ok) {
           const errBody = await catalogRes.json() as { error?: string };
           throw new Error(errBody.error || "Failed inserting to D1");
       }

       toast.success("Successfully pushed to storefront!");
       
       // Reset
       setTitle("");
       setSlug("");
       setCoverFile(null);
       setAudioFile(null);

    } catch(err: unknown) {
       toast.error(err instanceof Error ? err.message : "An Error occurred during publish");
    } finally {
       setIsLoading(false);
    }
  };

  if (!authed) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <form onSubmit={handleAuth} className="space-y-4 text-center">
                <h1 className="text-xl tracking-widest uppercase mb-8">NILXNJXN System Access</h1>
                <input 
                    type="password" 
                    placeholder="ADMIN_PASSWORD"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded text-center tracking-widest uppercase text-xs focus:outline-none focus:border-white/40"
                />
                <button type="submit" className="w-full bg-white text-black py-4 uppercase font-bold text-xs tracking-widest hover:bg-neutral-200 transition-colors">
                    Authenticate
                </button>
            </form>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold tracking-widest uppercase">Admin Operations</h1>
      </div>

      <div className="bg-neutral-900 border border-white/10 p-8 rounded-xl shadow-2xl">
          <h2 className="text-sm tracking-widest text-[#888] uppercase mb-8">Publish New Catalog Item</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div className="col-span-2 md:col-span-1">
                     <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">Title</label>
                     <input type="text" value={title} onChange={e => { setTitle(e.target.value); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));}} required className="w-full bg-black border border-white/10 px-4 py-3 rounded text-sm focus:outline-none focus:border-white/30" />
                 </div>
                 
                 <div className="col-span-2 md:col-span-1">
                     <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">Slug Path</label>
                     <input type="text" value={slug} onChange={e => setSlug(e.target.value)} required className="w-full bg-black border border-white/10 px-4 py-3 rounded text-sm focus:outline-none focus:border-white/30" />
                 </div>
                 
                 <div className="col-span-2 md:col-span-1">
                     <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">Price (e.g. ₹49)</label>
                     <input type="text" value={price} onChange={e => setPrice(e.target.value)} required className="w-full bg-black border border-white/10 px-4 py-3 rounded text-sm focus:outline-none focus:border-white/30" />
                 </div>

                 <div className="col-span-2 md:col-span-1">
                     <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">Format</label>
                     <select value={itemType} onChange={e => setItemType(e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 rounded text-sm focus:outline-none focus:border-white/30 text-white [&>option]:bg-black">
                         <option value="song">Single Track (.wav / .mp3)</option>
                         <option value="album">Full Album Bundle (.zip)</option>
                     </select>
                 </div>
                 
                 <div className="col-span-2">
                     <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">Season / Tier</label>
                     <select value={season} onChange={e => setSeason(e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 rounded text-sm focus:outline-none focus:border-white/30 text-white [&>option]:bg-black">
                         <option value="FRESH">Fresh Drop (Emerald)</option>
                         <option value="AKAD">Akademic (Orange)</option>
                         <option value="LATE">Late Night (Cyan)</option>
                     </select>
                 </div>
              </div>

              <div className="h-px bg-white/10 my-8"></div>

              <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1 border border-white/10 border-dashed rounded-xl p-8 bg-black flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer relative overflow-hidden">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
                      <div className="text-white/40 mb-2">
                         <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <span className="text-xs uppercase tracking-widest">{coverFile ? coverFile.name : "Drop Cover Art"}</span>
                  </div>

                  <div className="col-span-2 md:col-span-1 border border-white/10 border-dashed rounded-xl p-8 bg-black flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer relative overflow-hidden">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".mp3,.wav,.zip" onChange={e => setAudioFile(e.target.files?.[0] || null)} />
                      <div className="text-white/40 mb-2">
                         <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                      </div>
                      <span className="text-xs uppercase tracking-widest">{audioFile ? audioFile.name : "Drop Audio (.WAV/.MP3/.ZIP)"}</span>
                  </div>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={isLoading} className={cn("w-full bg-white text-black py-4 uppercase font-bold text-xs tracking-widest hover:bg-neutral-200 transition-colors rounded", isLoading && "opacity-50 cursor-not-allowed")}>
                    {isLoading ? "Publishing to Network..." : "Launch Catalog Item"}
                </button>
              </div>
          </form>
      </div>
    </div>
  );
}
