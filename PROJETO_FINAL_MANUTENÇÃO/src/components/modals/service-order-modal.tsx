"use client";

import React, { useState, useEffect } from "react";
import { X, Printer, Download, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ServiceOrderPDFViewer, ServiceOrderPDFDownload } from "@/components/pdf/service-order-pdf";

interface ServiceOrderModalProps {
  serviceOrder: any;
  onClose: () => void;
  employees: any[];
  equipmentCategories: any[];
  inspectionCategories: any[];
  checklists: any[];
}

const ServiceOrderModal = ({
  serviceOrder,
  onClose,
  employees,
  equipmentCategories,
  inspectionCategories,
  checklists,
}: ServiceOrderModalProps) => {
  const [activeTab, setActiveTab] = useState<"details" | "pdf">("details");
  const [employee, setEmployee] = useState<any>(null);
  const [equipmentCategory, setEquipmentCategory] = useState<any>(null);
  const [inspectionCategory, setInspectionCategory] = useState<any>(null);
  const [checklist, setChecklist] = useState<any>(null);

  useEffect(() => {
    // Encontrar os dados relacionados
    const foundEmployee = employees.find(emp => emp.id === serviceOrder.employeeId);
    const foundEquipmentCategory = equipmentCategories.find(cat => cat.id === serviceOrder.equipmentCategoryId);
    const foundInspectionCategory = inspectionCategories.find(cat => cat.id === serviceOrder.inspectionCategoryId);
    const foundChecklist = checklists.find(cl => cl.id === serviceOrder.checklistId);
    
    setEmployee(foundEmployee || null);
    setEquipmentCategory(foundEquipmentCategory || null);
    setInspectionCategory(foundInspectionCategory || null);
    setChecklist(foundChecklist || null);
  }, [serviceOrder, employees, equipmentCategories, inspectionCategories, checklists]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pendente: "Pendente",
      em_andamento: "Em Andamento",
      concluida: "Concluída",
      cancelada: "Cancelada"
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    const statusClasses: Record<string, string> = {
      pendente: "bg-yellow-100 text-yellow-800",
      em_andamento: "bg-blue-100 text-blue-800",
      concluida: "bg-green-100 text-green-800",
      cancelada: "bg-red-100 text-red-800"
    };
    return statusClasses[status] || "";
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            Ordem de Serviço #{serviceOrder.number}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-muted rounded-full"
              title="Imprimir"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "details" ? "border-b-2 border-primary" : ""
            }`}
            onClick={() => setActiveTab("details")}
          >
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Detalhes</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "pdf" ? "border-b-2 border-primary" : ""
            }`}
            onClick={() => setActiveTab("pdf")}
          >
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </div>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          {activeTab === "details" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Informações Gerais
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Número:</span>
                      <span className="ml-2">{serviceOrder.number}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Data de Criação:</span>
                      <span className="ml-2">{formatDate(serviceOrder.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusClass(serviceOrder.status)}`}>
                        {getStatusLabel(serviceOrder.status)}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Funcionário Responsável
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Nome:</span>
                      <span className="ml-2">{employee?.name || "Não especificado"}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">DRT:</span>
                      <span className="ml-2">{employee?.drt || "Não especificado"}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Função:</span>
                      <span className="ml-2">{employee?.role || "Não especificado"}</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Detalhes da Inspeção
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Categoria de Equipamento:</span>
                      <span className="ml-2">{equipmentCategory?.name || "Não especificado"}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Categoria de Inspeção:</span>
                      <span className="ml-2">{inspectionCategory?.name || "Não especificado"}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Checklist:</span>
                      <span className="ml-2">{checklist?.name || "Não especificado"}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Observações
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">
                    {serviceOrder.observations || "Nenhuma observação registrada."}
                  </p>
                </Card>
              </div>

              {checklist && (
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Itens do Checklist
                  </h3>
                  <div className="space-y-2">
                    {checklist.items.map((item: any, index: number) => (
                      <div key={item.id} className="border-b border-border pb-2 last:border-0">
                        <p className="text-sm">
                          <span className="font-medium">{index + 1}.</span> {item.question}
                        </p>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {item.type === "radio" && (
                            <span>Opções: {item.options?.join(", ")}</span>
                          )}
                          {item.type === "number" && item.unit && (
                            <span>Unidade: {item.unit}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end mb-4">
                <ServiceOrderPDFDownload
                  serviceOrder={serviceOrder}
                  employee={employee}
                  equipmentCategory={equipmentCategory}
                  inspectionCategory={inspectionCategory}
                  checklist={checklist}
                />
              </div>
              <ServiceOrderPDFViewer
                serviceOrder={serviceOrder}
                employee={employee}
                equipmentCategory={equipmentCategory}
                inspectionCategory={inspectionCategory}
                checklist={checklist}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceOrderModal;
