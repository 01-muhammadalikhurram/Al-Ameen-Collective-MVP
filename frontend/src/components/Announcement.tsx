import { motion } from 'framer-motion';
import { useSetting } from '../api/config';

export function Announcement() {
  const { value: showAnnouncement, isLoading: loadingShow } = useSetting('show_announcement_bar');
  const { value: announcementText, isLoading: loadingText } = useSetting('announcement_text');

  // If loading or the announcement is explicitly disabled in the DB
  if (loadingShow || loadingText || showAnnouncement === 'false' || !announcementText) {
    return null;
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-black text-white h-[44px] flex items-center justify-center px-4 text-center text-sm font-medium tracking-wide shadow-sm"
    >
      <p>{announcementText}</p>
    </motion.div>
  );
}
