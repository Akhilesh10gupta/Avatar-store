import { useState, useEffect, useRef } from 'react';
import { Post, toggleLikePost, deletePost, updatePost } from '@/lib/firestore';
import { useAuth } from '@/components/AuthProvider';
import { Heart, MessageCircle, UserCircle, Share2, MoreHorizontal, Pencil, Trash2, X, Check, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CommentSection from './CommentSection';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes.length);
    const [commentCount, setCommentCount] = useState(post.commentCount || 0);
    const [showComments, setShowComments] = useState(false);
    const [showFullImage, setShowFullImage] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const isSwiping = useRef(false);

    // Helper to get all images
    const images = post.imageUrls || (post.imageUrl ? [post.imageUrl] : []);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            zIndex: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        })
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentImageIndex(prev => prev + newDirection);
    };

    // Edit/Delete State
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [editedContentDisplay, setEditedContentDisplay] = useState(post.content); // Display updated content after save
    const [updatedAtDisplay, setUpdatedAtDisplay] = useState(post.updatedAt);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        isSwiping.current = false;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
        isSwiping.current = true;
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentImageIndex < images.length - 1) {
            paginate(1);
        }
        if (isRightSwipe && currentImageIndex > 0) {
            paginate(-1);
        }
        // Reset swiping flag after a short delay to allow click handler to be blocked
        setTimeout(() => {
            isSwiping.current = false;
        }, 100);
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentImageIndex < images.length - 1) {
            paginate(1);
        }
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentImageIndex > 0) {
            paginate(-1);
        }
    };

    useEffect(() => {
        if (user) {
            setIsLiked(post.likes.includes(user.uid));
        } else {
            setIsLiked(false);
        }
    }, [user, post.likes]);

    // Handle clicking outside to close menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Check for hash to auto-open comments (Instagram style deep linking)
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash === `#${post.id}`) {
            setShowComments(true);
            // Optional: Scroll into view smoothly after a short delay to ensure rendering
            setTimeout(() => {
                document.getElementById(post.id!)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }, [post.id]);

    // Sync local state with prop when it updates
    useEffect(() => {
        setCommentCount(post.commentCount || 0);
    }, [post.commentCount]);

    const handleLike = async () => {
        if (!user) return;

        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);

        try {
            await toggleLikePost(post.id!, user.uid);
        } catch (error) {
            console.error("Error toggling like:", error);
            setIsLiked(!newIsLiked);
            setLikeCount(prev => !newIsLiked ? prev + 1 : prev - 1);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Avatar Play Community',
            text: `Check out ${post.userName}'s post: "${post.content.slice(0, 50)}${post.content.length > 50 ? '...' : ''}"`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        setIsDeleting(true);
        try {
            await deletePost(post.id!);
            setIsDeleted(true); // Hide the card
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post.");
            setIsDeleting(false);
        }
    };

    const handleUpdate = async () => {
        if (!editContent.trim()) return;

        setIsSaving(true);
        try {
            await updatePost(post.id!, editContent);
            setEditedContentDisplay(editContent);
            setUpdatedAtDisplay(new Date().toISOString());
            setIsEditing(false);
            setIsMenuOpen(false);
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isDeleted) return null;

    return (
        <motion.div
            id={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all relative"
        >
            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                            {post.userAvatar ? (
                                <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle className="w-6 h-6 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">{post.userName}</h3>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                </p>
                                {updatedAtDisplay && (
                                    <span className="text-[10px] text-muted-foreground/60 italic">
                                        (edited)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Options Menu */}
                    {user?.uid === post.userId && (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-muted-foreground hover:text-white rounded-full hover:bg-white/5 transition-colors"
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-32 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors text-left"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="mb-4 space-y-4">
                    {isEditing ? (
                        <div className="space-y-3">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50 min-h-[100px] resize-none"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-3 py-1.5 text-sm text-muted-foreground hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={isSaving || !editContent.trim()}
                                    className="px-4 py-1.5 bg-primary text-white text-sm rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <p className={cn("text-white/90 whitespace-pre-wrap leading-relaxed transition-all", !isExpanded && "line-clamp-3")}>
                                {editedContentDisplay}
                            </p>
                            {editedContentDisplay.length > 150 && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-xs text-muted-foreground hover:text-white mt-1 font-medium"
                                >
                                    {isExpanded ? "Show less" : "Read more"}
                                </button>
                            )}
                        </div>
                    )}

                    {images.length > 0 && (
                        <div
                            className="rounded-xl overflow-hidden border border-white/5 aspect-video bg-secondary/20 relative group cursor-pointer touch-pan-y"
                            onClick={(e) => {
                                if (isSwiping.current || (touchStart && touchEnd && Math.abs(touchStart - touchEnd) > 10)) return;
                                setShowFullImage(true);
                            }}
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                <motion.img
                                    key={currentImageIndex}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    src={images[currentImageIndex]}
                                    alt={`Post content ${currentImageIndex + 1}`}
                                    className="absolute inset-0 w-full h-full object-cover select-none"
                                />
                            </AnimatePresence>

                            {/* Carousel Controls (Card) */}
                            {images.length > 1 && (
                                <>
                                    {currentImageIndex > 0 && (
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm z-10 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                    )}
                                    {currentImageIndex < images.length - 1 && (
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm z-10 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    )}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                        {images.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Full Screen Image Modal */}
                <AnimatePresence>
                    {showFullImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                            onClick={() => setShowFullImage(false)}
                        >
                            <button
                                onClick={() => setShowFullImage(false)}
                                className="absolute top-5 right-5 md:top-8 md:right-8 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-[60] backdrop-blur-md"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Lightbox Navigation */}
                            {images.length > 1 && (
                                <>
                                    {currentImageIndex > 0 && (
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md z-[60] transition-colors"
                                        >
                                            <ChevronLeft className="w-8 h-8" />
                                        </button>
                                    )}
                                    {currentImageIndex < images.length - 1 && (
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md z-[60] transition-colors"
                                        >
                                            <ChevronRight className="w-8 h-8" />
                                        </button>
                                    )}
                                </>
                            )}

                            <motion.img
                                key={currentImageIndex} // Key forces re-render for animation on slide
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                src={images[currentImageIndex]}
                                alt="Full screen"
                                className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl cursor-default"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-white'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{likeCount}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-2 text-sm transition-colors ${showComments ? 'text-white' : 'text-muted-foreground hover:text-white'
                            }`}
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span>{commentCount > 0 ? commentCount : 'Comments'}</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors ml-auto"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <CommentSection
                            postId={post.id!}
                            postOwnerId={post.userId}
                            postOwnerAvatar={post.userAvatar}
                            onCommentAdded={() => setCommentCount(prev => prev + 1)}
                            onCommentsLoaded={(count: number) => setCommentCount(count)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
