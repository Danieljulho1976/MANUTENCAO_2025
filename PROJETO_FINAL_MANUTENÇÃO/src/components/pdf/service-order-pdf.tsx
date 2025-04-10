"use client";

import React, { useState } from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink, Font, Image } from "@react-pdf/renderer";
import { useCompanyData, type Company, type CompanyLogo } from "@/hooks/useCompanyData";

// Interfaces para tipagem
interface ServiceOrder {
  id: string;
  number: string;
  employeeId: string;
  equipmentCategoryId: string;
  inspectionCategoryId: string;
  checklistId: string;
  observations: string;
  createdAt: string;
  status: "pendente" | "em_andamento" | "concluida" | "cancelada";
}

interface Employee {
  id: string;
  name: string;
  drt: string;
  role: string;
}

interface Category {
  id: string;
  name: string;
}

interface ChecklistItem {
  id: string;
  question: string;
  type: string;
  options?: string[];
  unit?: string;
}

interface Checklist {
  id: string;
  categoryId: string;
  name: string;
  items: ChecklistItem[];
}

interface Company {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
}

interface CompanyLogo {
  id: string;
  company_id: string;
  logo_url: string;
  logo_position: string;
}

interface UserProfile {
  id: string;
  company_id: string | null;
  name: string | null;
  email: string | null;
}

// Registrar fonte
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    marginBottom: 20,
    padding: 10,
    borderBottom: "1px solid #ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLogo: {
    width: 100,
    height: 50,
    objectFit: "contain",
  },
  headerCenter: {
    flex: 1,
    textAlign: "center",
  },
  companyInfo: {
    fontSize: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderBottomStyle: "solid",
    paddingBottom: 5,
    paddingTop: 5,
  },
  column: {
    flexDirection: "column",
    marginBottom: 10,
  },
  label: {
    width: "30%",
    fontSize: 10,
    fontWeight: "bold",
  },
  value: {
    width: "70%",
    fontSize: 10,
  },
  fullWidth: {
    width: "100%",
    fontSize: 10,
    marginBottom: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "grey",
  },
  signature: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "solid",
    paddingTop: 5,
    textAlign: "center",
    fontSize: 10,
  },
});

// Componente do PDF da Ordem de Serviço
const ServiceOrderPDF = ({ 
  serviceOrder, 
  employee, 
  equipmentCategory, 
  inspectionCategory, 
  checklist,
  company,
  companyLogos
}: { 
  serviceOrder: ServiceOrder; 
  employee: Employee | null; 
  equipmentCategory: Category | null; 
  inspectionCategory: Category | null; 
  checklist: Checklist | null;
  company: Company | null;
  companyLogos: CompanyLogo[];
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      pendente: "Pendente",
      em_andamento: "Em Andamento",
      concluida: "Concluída",
      cancelada: "Cancelada",
    };
    return statusMap[status] || status;
  };

  // Get logos by position
  const getLogoByPosition = (position: string): string | null => {
    const logo = companyLogos.find(logo => logo.logo_position === position);
    return logo ? logo.logo_url : null;
  };

  const leftLogo = getLogoByPosition('left') || "https://pre-built-images.s3.amazonaws.com/webapp-uploads/ef9806262b9611b81517e59e9c83c55d.png";
  const rightLogo = getLogoByPosition('right') || "https://pre-built-images.s3.amazonaws.com/webapp-uploads/2be59b864e2eed0fb47e01b1739f4192.jpeg";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image 
            src={leftLogo} 
            style={styles.headerLogo} 
          />
          <View style={styles.headerCenter}>
            {company && (
              <>
                <Text style={styles.title}>{company.name}</Text>
                {company.address && <Text style={styles.companyInfo}>{company.address}</Text>}
                {(company.phone || company.email) && (
                  <Text style={styles.companyInfo}>
                    {company.phone && `Tel: ${company.phone}`} 
                    {company.phone && company.email && " | "} 
                    {company.email && `Email: ${company.email}`}
                  </Text>
                )}
                {company.website && <Text style={styles.companyInfo}>{company.website}</Text>}
              </>
            )}
            <Text style={styles.subtitle}>ORDEM DE SERVIÇO</Text>
            <Text style={styles.subtitle}>Nº {serviceOrder.number}</Text>
            <Text style={styles.subtitle}>
              Status: {formatStatus(serviceOrder.status)}
            </Text>
          </View>
          <Image 
            src={rightLogo} 
            style={styles.headerLogo} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Gerais</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Data de Criação:</Text>
            <Text style={styles.value}>{formatDate(serviceOrder.createdAt)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Funcionário Responsável:</Text>
            <Text style={styles.value}>{employee?.name || "Não especificado"}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>DRT:</Text>
            <Text style={styles.value}>{employee?.drt || "Não especificado"}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Função:</Text>
            <Text style={styles.value}>{employee?.role || "Não especificado"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes da Inspeção</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Categoria de Equipamento:</Text>
            <Text style={styles.value}>{equipmentCategory?.name || "Não especificado"}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Categoria de Inspeção:</Text>
            <Text style={styles.value}>{inspectionCategory?.name || "Não especificado"}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Checklist:</Text>
            <Text style={styles.value}>{checklist?.name || "Não especificado"}</Text>
          </View>
        </View>

        {serviceOrder.observations && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <View style={styles.column}>
              <Text style={styles.fullWidth}>{serviceOrder.observations}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens do Checklist</Text>
          {checklist?.items?.map((item: ChecklistItem, index: number) => (
            <View key={index} style={styles.row}>
              <Text style={styles.fullWidth}>
                {index + 1}. {item.question}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text>Responsável pela Execução</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Responsável pela Aprovação</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Documento gerado em {new Date().toLocaleDateString("pt-BR")}</Text>
          {company && company.name && <Text>{company.name} - {formatDate(serviceOrder.createdAt)}</Text>}
        </View>
      </Page>
    </Document>
  );
};

// Hook for fetching company data is now imported from useCompanyData.ts

// Componente para visualização do PDF
export const ServiceOrderPDFViewer = ({ 
  serviceOrder, 
  employee, 
  equipmentCategory, 
  inspectionCategory, 
  checklist 
}: { 
  serviceOrder: ServiceOrder; 
  employee: Employee | null; 
  equipmentCategory: Category | null; 
  inspectionCategory: Category | null; 
  checklist: Checklist | null; 
}) => {
  const { company, companyLogos, loading } = useCompanyData();

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando dados da empresa...</div>;
  }

  return (
    <PDFViewer style={{ width: "100%", height: "70vh" }}>
      <ServiceOrderPDF 
        serviceOrder={serviceOrder} 
        employee={employee} 
        equipmentCategory={equipmentCategory} 
        inspectionCategory={inspectionCategory} 
        checklist={checklist}
        company={company}
        companyLogos={companyLogos}
      />
    </PDFViewer>
  );
};

// Componente para download do PDF
export const ServiceOrderPDFDownload = ({ 
  serviceOrder, 
  employee, 
  equipmentCategory, 
  inspectionCategory, 
  checklist 
}: { 
  serviceOrder: ServiceOrder; 
  employee: Employee | null; 
  equipmentCategory: Category | null; 
  inspectionCategory: Category | null; 
  checklist: Checklist | null; 
}) => {
  const { company, companyLogos, loading } = useCompanyData();

  if (loading) {
    return (
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md opacity-50 cursor-not-allowed"
        disabled
      >
        Carregando...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={
        <ServiceOrderPDF 
          serviceOrder={serviceOrder} 
          employee={employee} 
          equipmentCategory={equipmentCategory} 
          inspectionCategory={inspectionCategory} 
          checklist={checklist}
          company={company}
          companyLogos={companyLogos}
        />
      }
      fileName={`ordem-servico-${serviceOrder.number.replace("/", "-")}.pdf`}
      style={{
        textDecoration: "none",
        padding: "10px 20px",
        color: "white",
        backgroundColor: "#3B82F6",
        borderRadius: "4px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "medium",
        fontSize: "14px",
      }}
    >
      {({ blob, url, loading, error }) =>
        loading ? "Gerando PDF..." : "Baixar PDF"
      }
    </PDFDownloadLink>
  );
};
