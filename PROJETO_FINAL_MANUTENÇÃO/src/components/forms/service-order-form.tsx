"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Loader2, Search, FileText, Eye, Download, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import ServiceOrderModal from "@/components/modals/service-order-modal";

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

interface InspectionCategory {
  id: string;
  name: string;
}

interface Checklist {
  id: string;
  categoryId: string;
  name: string;
  items: any[];
}

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

const ServiceOrderForm = () => {
  // Estados para dados
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [equipmentCategories, setEquipmentCategories] = useState<Category[]>([]);
  const [inspectionCategories, setInspectionCategories] = useState<InspectionCategory[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  
  // Estados para formulário
  const [orderNumber, setOrderNumber] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedEquipmentCategoryId, setSelectedEquipmentCategoryId] = useState("");
  const [selectedInspectionCategoryId, setSelectedInspectionCategoryId] = useState("");
  const [selectedChecklistId, setSelectedChecklistId] = useState("");
  const [observations, setObservations] = useState("");
  const [status, setStatus] = useState<ServiceOrder["status"]>("pendente");
  
  // Estados auxiliares
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChecklists, setFilteredChecklists] = useState<Checklist[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Carregar dados do localStorage
  useEffect(() => {
    const isBrowser = typeof window !== 'undefined';
    if (!isBrowser) return;

    // Carregar ordens de serviço
    const storedOrders = localStorage.getItem("serviceOrders");
    if (storedOrders) {
      setServiceOrders(JSON.parse(storedOrders));
    }

    // Carregar funcionários
    const storedEmployees = localStorage.getItem("employees");
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }

    // Carregar categorias de equipamentos
    const storedEquipmentCategories = localStorage.getItem("equipmentCategories");
    if (storedEquipmentCategories) {
      setEquipmentCategories(JSON.parse(storedEquipmentCategories));
    } else {
      // Categorias padrão se não existirem
      const defaultCategories: Category[] = [
        { id: "generator", name: "Gerador" },
        { id: "elevator", name: "Elevador" },
        { id: "pump", name: "Bomba de Recalque" },
        { id: "aircon", name: "Ar Condicionado" },
        { id: "electrical", name: "Quadros Elétricos" },
        { id: "bathrooms", name: "Banheiros" },
        { id: "gases", name: "Gases Medicinais" },
      ];
      setEquipmentCategories(defaultCategories);
    }

    // Carregar categorias de inspeção
    const storedInspectionCategories = localStorage.getItem("inspectionCategories");
    if (storedInspectionCategories) {
      setInspectionCategories(JSON.parse(storedInspectionCategories));
    }

    // Carregar checklists
    const storedChecklists = localStorage.getItem("checklists");
    if (storedChecklists) {
      setChecklists(JSON.parse(storedChecklists));
    }

    setLoading(false);
  }, []);

  // Salvar ordens de serviço no localStorage quando houver alterações
  useEffect(() => {
    const isBrowser = typeof window !== 'undefined';
    if (!isBrowser || loading) return;
    
    localStorage.setItem("serviceOrders", JSON.stringify(serviceOrders));
  }, [serviceOrders, loading]);

  // Filtrar checklists com base na categoria de inspeção selecionada
  useEffect(() => {
    if (selectedInspectionCategoryId) {
      const filtered = checklists.filter(
        (checklist) => checklist.categoryId === selectedInspectionCategoryId
      );
      setFilteredChecklists(filtered);
      
      // Limpar checklist selecionado se não estiver na lista filtrada
      if (filtered.length > 0 && !filtered.some(c => c.id === selectedChecklistId)) {
        setSelectedChecklistId("");
      }
    } else {
      setFilteredChecklists([]);
      setSelectedChecklistId("");
    }
  }, [selectedInspectionCategoryId, checklists, selectedChecklistId]);

  // Gerar número de OS automático
  const generateOrderNumber = () => {
    const lastOrder = serviceOrders.length > 0 
      ? serviceOrders.reduce((max, order) => {
          const orderNum = parseInt(order.number.split('/')[0]);
          return orderNum > max ? orderNum : max;
        }, 0)
      : 0;
    
    const newNumber = (lastOrder + 1).toString().padStart(5, '0');
    return `${newNumber}/${year}`;
  };

  // Resetar formulário
  const resetForm = () => {
    setOrderNumber("");
    setSelectedEmployeeId("");
    setSelectedEquipmentCategoryId("");
    setSelectedInspectionCategoryId("");
    setSelectedChecklistId("");
    setObservations("");
    setStatus("pendente");
    setFormError("");
  };

  // Validar formulário
  const validateForm = () => {
    if (!orderNumber) {
      setFormError("O número da OS é obrigatório.");
      return false;
    }
    
    if (!selectedEmployeeId) {
      setFormError("Selecione um funcionário responsável.");
      return false;
    }
    
    if (!selectedEquipmentCategoryId) {
      setFormError("Selecione uma categoria de equipamento.");
      return false;
    }
    
    if (!selectedInspectionCategoryId) {
      setFormError("Selecione uma categoria de inspeção.");
      return false;
    }
    
    if (!selectedChecklistId) {
      setFormError("Selecione um checklist.");
      return false;
    }
    
    setFormError("");
    return true;
  };

  // Manipular envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const now = new Date().toISOString();
    
    if (editing) {
      // Atualizar ordem existente
      setServiceOrders(
        serviceOrders.map((order) =>
          order.id === editing
            ? {
                ...order,
                number: orderNumber,
                employeeId: selectedEmployeeId,
                equipmentCategoryId: selectedEquipmentCategoryId,
                inspectionCategoryId: selectedInspectionCategoryId,
                checklistId: selectedChecklistId,
                observations,
                status
              }
            : order
        )
      );
      setEditing(null);
    } else {
      // Adicionar nova ordem
      const newOrder: ServiceOrder = {
        id: Date.now().toString(),
        number: orderNumber,
        employeeId: selectedEmployeeId,
        equipmentCategoryId: selectedEquipmentCategoryId,
        inspectionCategoryId: selectedInspectionCategoryId,
        checklistId: selectedChecklistId,
        observations,
        createdAt: now,
        status: "pendente"
      };
      
      setServiceOrders([...serviceOrders, newOrder]);
    }
    
    resetForm();
  };

  // Carregar dados para edição
  const handleEdit = (order: ServiceOrder) => {
    setOrderNumber(order.number);
    setSelectedEmployeeId(order.employeeId);
    setSelectedEquipmentCategoryId(order.equipmentCategoryId);
    setSelectedInspectionCategoryId(order.inspectionCategoryId);
    setSelectedChecklistId(order.checklistId);
    setObservations(order.observations);
    setStatus(order.status);
    setEditing(order.id);
    setFormError("");
  };

  // Excluir ordem
  const handleDelete = (id: string) => {
    setServiceOrders(serviceOrders.filter((order) => order.id !== id));
    
    if (editing === id) {
      setEditing(null);
      resetForm();
    }
  };

  // Cancelar edição
  const handleCancel = () => {
    setEditing(null);
    resetForm();
  };

  // Visualizar ordem de serviço
  const handleViewOrder = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  // Filtrar ordens de serviço
  const filteredOrders = serviceOrders.filter((order) => {
    const searchTerms = searchQuery.toLowerCase();
    const employee = employees.find(emp => emp.id === order.employeeId);
    const equipmentCategory = equipmentCategories.find(cat => cat.id === order.equipmentCategoryId);
    const inspectionCategory = inspectionCategories.find(cat => cat.id === order.inspectionCategoryId);
    
    return (
      order.number.toLowerCase().includes(searchTerms) ||
      (employee?.name.toLowerCase() || "").includes(searchTerms) ||
      (equipmentCategory?.name.toLowerCase() || "").includes(searchTerms) ||
      (inspectionCategory?.name.toLowerCase() || "").includes(searchTerms) ||
      order.observations.toLowerCase().includes(searchTerms)
    );
  });

  // Obter nome do funcionário pelo ID
  const getEmployeeName = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : "Funcionário não encontrado";
  };

  // Obter nome da categoria de equipamento pelo ID
  const getEquipmentCategoryName = (id: string) => {
    const category = equipmentCategories.find(cat => cat.id === id);
    return category ? category.name : "Categoria não encontrada";
  };

  // Obter nome da categoria de inspeção pelo ID
  const getInspectionCategoryName = (id: string) => {
    const category = inspectionCategories.find(cat => cat.id === id);
    return category ? category.name : "Categoria não encontrada";
  };

  // Obter nome do checklist pelo ID
  const getChecklistName = (id: string) => {
    const checklist = checklists.find(cl => cl.id === id);
    return checklist ? checklist.name : "Checklist não encontrado";
  };

  // Traduzir status para exibição
  const getStatusLabel = (status: ServiceOrder["status"]) => {
    const statusMap = {
      pendente: "Pendente",
      em_andamento: "Em Andamento",
      concluida: "Concluída",
      cancelada: "Cancelada"
    };
    return statusMap[status];
  };

  // Obter classe CSS para o status
  const getStatusClass = (status: ServiceOrder["status"]) => {
    const statusClasses = {
      pendente: "bg-yellow-100 text-yellow-800",
      em_andamento: "bg-blue-100 text-blue-800",
      concluida: "bg-green-100 text-green-800",
      cancelada: "bg-red-100 text-red-800"
    };
    return statusClasses[status];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editing ? "Editar Ordem de Serviço" : "Cadastrar Nova Ordem de Serviço"}
        </h2>

        {formError && (
          <div className="bg-destructive/20 text-destructive p-3 rounded-md mb-4">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="orderNumber"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Número da OS
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="00001/2025"
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setOrderNumber(generateOrderNumber())}
                  className="ml-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
                  title="Gerar número automático"
                >
                  Gerar
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="employee"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Funcionário Responsável
              </label>
              <select
                id="employee"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecione um funcionário</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.drt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="equipmentCategory"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Categoria de Equipamento
              </label>
              <select
                id="equipmentCategory"
                value={selectedEquipmentCategoryId}
                onChange={(e) => setSelectedEquipmentCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecione uma categoria</option>
                {equipmentCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="inspectionCategory"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Categoria de Inspeção
              </label>
              <select
                id="inspectionCategory"
                value={selectedInspectionCategoryId}
                onChange={(e) => setSelectedInspectionCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecione uma categoria</option>
                {inspectionCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="checklist"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Checklist
            </label>
            <select
              id="checklist"
              value={selectedChecklistId}
              onChange={(e) => setSelectedChecklistId(e.target.value)}
              disabled={filteredChecklists.length === 0}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Selecione um checklist</option>
              {filteredChecklists.map((checklist) => (
                <option key={checklist.id} value={checklist.id}>
                  {checklist.name}
                </option>
              ))}
            </select>
            {selectedInspectionCategoryId && filteredChecklists.length === 0 && (
              <p className="text-sm text-destructive mt-1">
                Não há checklists disponíveis para esta categoria de inspeção.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="observations"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Observações
            </label>
            <textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {editing && (
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ServiceOrder["status"])}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluida">Concluída</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            {editing && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-border rounded-md text-muted-foreground hover:bg-secondary"
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              className={cn(
                "px-4 py-2 rounded-md text-primary-foreground flex items-center space-x-1",
                editing
                  ? "bg-chart-2 hover:bg-chart-2/80"
                  : "bg-primary hover:bg-primary/80"
              )}
            >
              {editing ? (
                <>
                  <Pencil className="w-4 h-4" />
                  <span>Atualizar</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Adicionar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Ordens de Serviço Cadastradas</h3>
          
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar ordens de serviço..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery 
              ? "Nenhuma ordem de serviço encontrada para a busca." 
              : "Nenhuma ordem de serviço cadastrada."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-3 text-sm">Número</th>
                  <th className="text-left p-3 text-sm">Funcionário</th>
                  <th className="text-left p-3 text-sm">Categoria</th>
                  <th className="text-left p-3 text-sm">Inspeção</th>
                  <th className="text-left p-3 text-sm">Status</th>
                  <th className="text-right p-3 text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="p-3">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                        {order.number}
                      </div>
                    </td>
                    <td className="p-3">{getEmployeeName(order.employeeId)}</td>
                    <td className="p-3">{getEquipmentCategoryName(order.equipmentCategoryId)}</td>
                    <td className="p-3">{getInspectionCategoryName(order.inspectionCategoryId)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-muted-foreground hover:text-foreground mr-2"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(order)}
                        className="text-muted-foreground hover:text-foreground mr-2"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-destructive hover:text-destructive/80"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal de visualização da ordem de serviço */}
      {showModal && selectedOrder && (
        <ServiceOrderModal
          serviceOrder={selectedOrder}
          onClose={handleCloseModal}
          employees={employees}
          equipmentCategories={equipmentCategories}
          inspectionCategories={inspectionCategories}
          checklists={checklists}
        />
      )}
    </div>
  );
};

export default ServiceOrderForm;
