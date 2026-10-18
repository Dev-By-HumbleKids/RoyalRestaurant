import { MotionConfig } from 'framer-motion';
import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { usePageMeta } from './usePageMeta';

const Home = lazy(() => import('@/pages/Home'));
const Story = lazy(() => import('@/pages/Story'));
const Menu = lazy(() => import('@/pages/Menu'));
const Experience = lazy(() => import('@/pages/Experience'));
const Reservations = lazy(() => import('@/pages/Reservations'));
const ManageReservation = lazy(() => import('@/pages/ManageReservation'));
const Contact = lazy(() => import('@/pages/Contact'));
const Credits = lazy(() => import('@/pages/Credits'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function AppRoutes() {
  usePageMeta();
  return (
    <Layout>
      {(location) => (
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/story" element={<Story />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:slug" element={<Menu />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reservations/manage" element={<ManageReservation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </Layout>
  );
}

export default function App() {
  return (
    // reducedMotion="user": transform/layout animations are disabled for visitors who prefer reduced motion.
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AppRoutes />
      </BrowserRouter>
    </MotionConfig>
  );
}
