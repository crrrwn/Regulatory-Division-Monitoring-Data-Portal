import { lazy, Suspense } from 'react'
import { Routes as RR, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AnalyticsProvider } from './context/AnalyticsContext'

import LandingLayout from './layouts/LandingLayout'
import DashboardLayout from './layouts/DashboardLayout'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'))
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const StaffLogin = lazy(() => import('./pages/StaffLogin'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Ratings = lazy(() => import('./pages/Ratings'))
const ViewRecords = lazy(() => import('./pages/ViewRecords'))
const Settings = lazy(() => import('./pages/Settings'))
const SystemLogs = lazy(() => import('./pages/SystemLogs'))
const UserManagement = lazy(() => import('./pages/UserManagement'))

const AnimalFeedForm = lazy(() => import('./pages/forms/AnimalFeedForm'))
const LivestockHandlersForm = lazy(() => import('./pages/forms/LivestockHandlersForm'))
const TransportCarrierForm = lazy(() => import('./pages/forms/TransportCarrierForm'))
const AnimalWelfareForm = lazy(() => import('./pages/forms/AnimalWelfareForm'))
const PlantMaterialForm = lazy(() => import('./pages/forms/PlantMaterialForm'))
const OrganicAgriForm = lazy(() => import('./pages/forms/OrganicAgriForm'))
const GoodAgriPracticesForm = lazy(() => import('./pages/forms/GoodAgriPracticesForm'))
const GoodAnimalHusbandryForm = lazy(() => import('./pages/forms/GoodAnimalHusbandryForm'))
const OrganicPostMarketForm = lazy(() => import('./pages/forms/OrganicPostMarketForm'))
const LandUseMatterForm = lazy(() => import('./pages/forms/LandUseMatterForm'))
const FoodSafetyForm = lazy(() => import('./pages/forms/FoodSafetyForm'))
const PlantPestSurveillanceForm = lazy(() => import('./pages/forms/PlantPestSurveillanceForm'))
const CFSADMCCForm = lazy(() => import('./pages/forms/CFSADMCCForm'))
const AnimalDiseaseSurveillanceForm = lazy(() => import('./pages/forms/AnimalDiseaseSurveillanceForm'))
const SafdzValidationForm = lazy(() => import('./pages/forms/SafdzValidationForm'))

function ProtectedRoute({ children, requireAdmin }) {
  const { user, role, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-muted">Loading...</div></div>
  if (!user) return <Navigate to="/" replace />
  if (requireAdmin && role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function Routes() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-muted">Loading...</div></div>}>
      <RR>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="contact" element={<ContactUsPage />} />
          <Route path="admin-login" element={<AdminLogin />} />
          <Route path="staff-login" element={<StaffLogin />} />
        </Route>

        <Route path="/dashboard" element={<ProtectedRoute><AnalyticsProvider><DashboardLayout /></AnalyticsProvider></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="ratings" element={<Ratings />} />
          <Route path="records" element={<ViewRecords />} />
          <Route path="settings" element={<Settings />} />
          <Route path="system-logs" element={<ProtectedRoute requireAdmin><SystemLogs /></ProtectedRoute>} />
          <Route path="user-management" element={<ProtectedRoute requireAdmin><UserManagement /></ProtectedRoute>} />
          <Route path="forms/animal-feed" element={<AnimalFeedForm />} />
          <Route path="forms/livestock-handlers" element={<LivestockHandlersForm />} />
          <Route path="forms/transport-carrier" element={<TransportCarrierForm />} />
          <Route path="forms/animal-welfare" element={<AnimalWelfareForm />} />
          <Route path="forms/plant-material" element={<PlantMaterialForm />} />
          <Route path="forms/organic-agri" element={<OrganicAgriForm />} />
          <Route path="forms/good-agri-practices" element={<GoodAgriPracticesForm />} />
          <Route path="forms/good-animal-husbandry" element={<GoodAnimalHusbandryForm />} />
          <Route path="forms/organic-post-market" element={<OrganicPostMarketForm />} />
          <Route path="forms/land-use-matter" element={<LandUseMatterForm />} />
          <Route path="forms/food-safety" element={<FoodSafetyForm />} />
          <Route path="forms/safdz-validation" element={<SafdzValidationForm />} />
          <Route path="forms/plant-pest-surveillance" element={<PlantPestSurveillanceForm />} />
          <Route path="forms/cfs-admcc" element={<CFSADMCCForm />} />
          <Route path="forms/animal-disease-surveillance" element={<AnimalDiseaseSurveillanceForm />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </RR>
    </Suspense>
  )
}
