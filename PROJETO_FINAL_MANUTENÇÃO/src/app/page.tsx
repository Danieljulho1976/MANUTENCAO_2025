"use client";

import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import Dashboard from "@/components/dashboard/dashboard";
import EmployeeForm from "@/components/forms/employee-form";
import EquipmentCategoryForm from "@/components/forms/equipment-category-form";
import EquipmentForm from "@/components/forms/equipment-form";
import InspectionCategoryForm from "@/components/forms/inspection-category-form";
import ChecklistForm from "@/components/forms/checklist-form";
import ServiceOrderForm from "@/components/forms/service-order-form";
import CompanySettingsForm from "@/components/forms/company-settings-form";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "employees":
        return <EmployeeForm />;
      case "categories":
        return <EquipmentCategoryForm />;
      case "equipment":
        return <EquipmentForm />;
      case "inspection-categories":
        return <InspectionCategoryForm />;
      case "checklists":
        return <ChecklistForm />;
      case "service-orders":
        return <ServiceOrderForm />;
      case "company":
        return <CompanySettingsForm />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
