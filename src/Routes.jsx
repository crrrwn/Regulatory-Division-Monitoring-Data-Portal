import { Routes as RR, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AnalyticsProvider } from './context/AnalyticsContext'

import LandingLayout from './layouts/LandingLayout'
import DashboardLayout from './layouts/DashboardLayout'

import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import FeaturesPage from './pages/FeaturesPage'
import ContactUsPage from './pages/ContactUsPage'
import AdminLogin from './pages/AdminLogin'
import StaffLogin from './pages/StaffLogin'
import Dashboard from './pages/Dashboard'
import ViewRecords from './pages/ViewRecords'
import DataAnalytics from './pages/DataAnalytics'
import Settings from './pages/Settings'
import SystemLogs from './pages/SystemLogs'

import AnimalFeedForm from './pages/forms/AnimalFeedForm'
import LivestockHandlersForm from './pages/forms/LivestockHandlersForm'
import TransportCarrierForm from './pages/forms/TransportCarrierForm'
import AnimalWelfareForm from './pages/forms/AnimalWelfareForm'
import PlantMaterialForm from './pages/forms/PlantMaterialForm'
import OrganicAgriForm from './pages/forms/OrganicAgriForm'
import GoodAgriPracticesForm from './pages/forms/GoodAgriPracticesForm'
import GoodAnimalHusbandryForm from './pages/forms/GoodAnimalHusbandryForm'
import OrganicPostMarketForm from './pages/forms/OrganicPostMarketForm'
import LandUseMatterForm from './pages/forms/LandUseMatterForm'
import FoodSafetyForm from './pages/forms/FoodSafetyForm'
import PlantPestSurveillanceForm from './pages/forms/PlantPestSurveillanceForm'
import CFSADMCCForm from './pages/forms/CFSADMCCForm'
import AnimalDiseaseSurveillanceForm from './pages/forms/AnimalDiseaseSurveillanceForm'
import SafdzValidationForm from './pages/forms/SafdzValidationForm'

function ProtectedRoute({ children, requireAdmin }) {
  const { user, role, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-muted">Loading...</div></div>
  if (!user) return <Navigate to="/" replace />
  if (requireAdmin && role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function Routes() {
  return (
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
        <Route path="analytics" element={<DataAnalytics />} />
        <Route path="records" element={<ViewRecords />} />
        <Route path="settings" element={<Settings />} />
        <Route path="system-logs" element={<ProtectedRoute requireAdmin><SystemLogs /></ProtectedRoute>} />
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
  )
}
