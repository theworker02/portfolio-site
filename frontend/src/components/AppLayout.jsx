import { motion } from 'framer-motion';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';
import { motionTokens } from '../styles/tokens.ts';

export default function AppLayout({ profile, children }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: motionTokens.page, ease: motionTokens.ease }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="page-orb left-[-8%] top-20" />
        <div className="page-orb right-[-10%] top-[30rem]" />
      </div>

      <Navbar profile={profile} />

      <main>{children}</main>

      <Footer profile={profile} />
    </motion.div>
  );
}
