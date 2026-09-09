import { useEffect, useMemo, useState } from "react";
import { galleryService } from "@/services/galleryService";
import { BACKEND_URL } from "@/lib/api";
import {
    LayoutGrid,
    Camera,
    Film,
    Play,
    X,
    ChevronLeft,
    ChevronRight,
    Tag,
    Image as ImageIcon,
} from "lucide-react";
import { TID } from "@/constants/testIds";

/* ------------------------------------------------------------------ */
/*  Local media helpers                                               */
/* ------------------------------------------------------------------ */

/**
 * Prefix a server-relative /uploads/... reference with the backend URL so
 * the browser can load it. Legacy external URLs are still rendered.
 */
export const mediaSrc = (value) => {
    if (!value) return "";
    if (/^https?:\/\//.test(value)) return value; // legacy external refs only
    if (value.startsWith("/uploads/")) return `${BACKEND_URL}${value}`;
    return value;
};

/** Prefer the admin-uploaded thumbnail for videos. */
export const getVideoThumbnail = (item) => mediaSrc(item?.thumbnail_url || "");

/* ------------------------------------------------------------------ */

const TABS = [
    { key: "all", label: "All", icon: LayoutGrid },
    { key: "photo", label: "Photos", icon: Camera },
    { key: "video", label: "Videos", icon: Film },
];

export default function Gallery() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    // Photo lightbox + video modal state
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [videoItem, setVideoItem] = useState(null);

    const loadGallery = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await galleryService.getActiveGallery();
            setItems(data || []);
        } catch (err) {
            console.error("Error loading gallery:", err);
            setError("We couldn't load the gallery right now. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGallery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const photos = useMemo(() => items.filter((i) => i.type === "photo"), [items]);
    const videos = useMemo(() => items.filter((i) => i.type === "video"), [items]);
    const visible =
        activeTab === "photo" ? photos : activeTab === "video" ? videos : items;

    /* Lightbox navigation ------------------------------------------- */

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const prevPhoto = () =>
        setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
    const nextPhoto = () =>
        setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length));

    const closeVideo = () => setVideoItem(null);

    // Keyboard support (Esc closes, arrows navigate) + body scroll lock
    useEffect(() => {
        if (lightboxIndex === null && !videoItem) return;
        const onKey = (e) => {
            if (e.key === "Escape") {
                closeLightbox();
                closeVideo();
            }
            if (lightboxIndex !== null && photos.length > 1) {
                if (e.key === "ArrowLeft") prevPhoto();
                if (e.key === "ArrowRight") nextPhoto();
            }
        };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lightboxIndex, videoItem, photos.length]);

    const currentPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

    const photoGrid = photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((p, idx) => (
                <button
                    key={p._id || `${p.type}-${idx}`}
                    data-testid={TID.galleryPhotoCard}
                    type="button"
                    onClick={() => openLightbox(idx)}
                    className="group text-left bg-white rounded-2xl border border-[#1A3626]/10 overflow-hidden hover:shadow-lg hover:shadow-[#1A3626]/10 hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="aspect-[4/3] overflow-hidden bg-[#E9E4D8]">
                        {p.media_url ? (
                            <img
                                src={mediaSrc(p.media_url)}
                                alt={p.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#1A3626]/30">
                                <ImageIcon className="w-12 h-12" />
                            </div>
                        )}
                    </div>
                    <div className="p-5">
                        <h3 className="font-serif-display text-lg text-[#1A3626] mb-1 line-clamp-1">
                            {p.title}
                        </h3>
                        {p.category && (
                            <div className="inline-flex items-center gap-1 text-xs text-[#5C4033] mb-2">
                                <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
                                {p.category}
                            </div>
                        )}
                        {p.description && (
                            <p className="text-sm text-[#1A3626]/70 line-clamp-2">{p.description}</p>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );

    const videoGrid = videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v, idx) => {
                const thumb = getVideoThumbnail(v);
                return (
                    <button
                        key={v._id || `${v.type}-${idx}`}
                        data-testid={TID.galleryVideoCard}
                        type="button"
                        onClick={() => setVideoItem(v)}
                        className="group text-left bg-white rounded-2xl border border-[#1A3626]/10 overflow-hidden hover:shadow-lg hover:shadow-[#1A3626]/10 hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="relative aspect-video overflow-hidden bg-[#1A3626]">
                            {thumb ? (
                                <img
                                    src={thumb}
                                    alt={v.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Film className="w-10 h-10 text-[#F9F6F0]/40" />
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="w-14 h-14 rounded-full bg-[#C5A059]/95 text-[#1A3626] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Play className="w-6 h-6 ml-0.5 fill-current" />
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-serif-display text-lg text-[#1A3626] mb-1 line-clamp-1">
                                {v.title}
                            </h3>
                            {v.category && (
                                <div className="inline-flex items-center gap-1 text-xs text-[#5C4033] mb-2">
                                    <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
                                    {v.category}
                                </div>
                            )}
                            {v.description && (
                                <p className="text-sm text-[#1A3626]/70 line-clamp-2">{v.description}</p>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );

    const emptyState = !loading && !error && visible.length === 0 && (
        <div className="py-16 text-center text-[#1A3626]/60">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[#E9E4D8] flex items-center justify-center mb-4">
                {activeTab === "video" ? (
                    <Film className="w-8 h-8 text-[#1A3626]/40" />
                ) : (
                    <Camera className="w-8 h-8 text-[#1A3626]/40" />
                )}
            </div>
            <p className="text-lg font-medium text-[#1A3626]/70">
                {activeTab === "all"
                    ? "No gallery items yet — check back soon."
                    : activeTab === "video"
                        ? "No videos added yet — check back soon."
                        : "No photos added yet — check back soon."}
            </p>
        </div>
    );

    return (
        <div>
            {/* Hero */}
            <section className="bg-[#1A3626] text-[#F9F6F0] py-20 lg:py-28">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-3">
                        Moments of Wellness
                    </div>
                    <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl mb-4 leading-tight">
                        Photo & Video Gallery
                    </h1>
                    <p className="text-[#F9F6F0]/80 max-w-2xl mx-auto">
                        A glimpse into our health camps, awareness programs and community
                        events — watch our journey towards a healthier, more aware India.
                    </p>
                </div>
            </section>

            {/* Tabs + content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Tab bar */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex items-center gap-1 rounded-full border border-[#1A3626]/15 bg-white p-1.5 shadow-sm">
                        {TABS.map((t) => {
                            const Icon = t.icon;
                            const active = activeTab === t.key;
                            return (
                                <button
                                    key={t.key}
                                    data-testid={TID.galleryTab}
                                    type="button"
                                    onClick={() => setActiveTab(t.key)}
                                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${active
                                        ? "bg-[#1A3626] text-[#F9F6F0] shadow"
                                        : "text-[#1A3626]/70 hover:text-[#1A3626] hover:bg-[#F9F6F0]"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {t.label}
                                    {t.key !== "all" && (
                                        <span
                                            className={`rounded-full px-1.5 text-[11px] ${active ? "bg-[#C5A059] text-[#1A3626]" : "bg-[#1A3626]/10 text-[#1A3626]/60"
                                                }`}
                                        >
                                            {t.key === "photo" ? photos.length : videos.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-[#1A3626]/60 py-16">
                        <div className="mx-auto w-12 h-12 rounded-full border-4 border-[#1A3626]/10 border-t-[#C5A059] animate-spin mb-4" />
                        <p>Loading gallery...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-[#1A3626]/60 py-16">{error}</div>
                ) : (
                    <>
                        {activeTab !== "video" && photoGrid}
                        {activeTab !== "photo" && videoGrid}
                        {emptyState}
                    </>
                )}
            </section>

            {/* Photo lightbox */}
            {lightboxIndex !== null && currentPhoto && (
                <div
                    data-testid={TID.galleryLightbox}
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-8"
                    role="dialog"
                    aria-modal="true"
                    aria-label={currentPhoto.title}
                >
                    <button
                        type="button"
                        data-testid={TID.galleryLightboxClose}
                        aria-label="Close"
                        onClick={closeLightbox}
                        className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {photos.length > 1 && (
                        <>
                            <button
                                type="button"
                                data-testid={TID.galleryLightboxPrev}
                                aria-label="Previous photo"
                                onClick={prevPhoto}
                                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                type="button"
                                data-testid={TID.galleryLightboxNext}
                                aria-label="Next photo"
                                onClick={nextPhoto}
                                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    <figure className="max-w-4xl w-full">
                        {currentPhoto.media_url ? (
                            <img
                                src={mediaSrc(currentPhoto.media_url)}
                                alt={currentPhoto.title}
                                className="mx-auto max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl"
                            />
                        ) : (
                            <div className="mx-auto max-h-[75vh] aspect-[4/3] max-w-full rounded-2xl bg-white/10 flex items-center justify-center">
                                <ImageIcon className="w-16 h-16 text-white/40" />
                            </div>
                        )}
                        <figcaption className="mt-5 text-center text-[#F9F6F0]">
                            <div className="font-serif-display text-xl">{currentPhoto.title}</div>
                            {currentPhoto.category && (
                                <div className="inline-flex items-center gap-1 text-xs text-[#C5A059] mt-1">
                                    <Tag className="w-3.5 h-3.5" />
                                    {currentPhoto.category}
                                </div>
                            )}
                            {currentPhoto.description && (
                                <p className="text-sm text-[#F9F6F0]/70 mt-2 max-w-2xl mx-auto">
                                    {currentPhoto.description}
                                </p>
                            )}
                            <div className="text-xs text-[#F9F6F0]/50 mt-3">
                                {lightboxIndex + 1} / {photos.length}
                            </div>
                        </figcaption>
                    </figure>
                </div>
            )}

            {/* Video modal — only rendered while open so the player fully unmounts */}
            {videoItem && (
                <div
                    data-testid={TID.galleryVideoModal}
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-8"
                    role="dialog"
                    aria-modal="true"
                    aria-label={videoItem.title}
                >
                    <button
                        type="button"
                        data-testid={TID.galleryVideoModalClose}
                        aria-label="Close video"
                        onClick={closeVideo}
                        className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="w-full max-w-4xl">
                        <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                            {videoItem.media_url ? (
                                <video
                                    src={mediaSrc(videoItem.media_url)}
                                    title={videoItem.title}
                                    controls
                                    autoPlay
                                    className="w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-[#F9F6F0]/70 gap-3">
                                    <Film className="w-12 h-12 text-[#F9F6F0]/40" />
                                    <p className="text-sm px-6 text-center">
                                        This video could not be played here.
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="mt-5 text-center text-[#F9F6F0]">
                            <div className="font-serif-display text-xl">{videoItem.title}</div>
                            {videoItem.category && (
                                <div className="inline-flex items-center gap-1 text-xs text-[#C5A059] mt-1">
                                    <Tag className="w-3.5 h-3.5" />
                                    {videoItem.category}
                                </div>
                            )}
                            {videoItem.description && (
                                <p className="text-sm text-[#F9F6F0]/70 mt-2 max-w-2xl mx-auto">
                                    {videoItem.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
