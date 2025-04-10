"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// Definição de tipos para categorias e equipamentos
interface Category {
  id: string;
  name: string;
}

interface Equipment {
  id: string;
  category: string;
  tag: string;
  name?: string;
  description?: string;
  model?: string;
  brand?: string;
  serialNumber?: string;
  location: string;
  capacity?: string;
  floor?: string;
  gasType?: string;
}

const categories: Category[] = [
  { id: "generator", name: "Gerador" },
  { id: "elevator", name: "Elevador" },
  { id: "pump", name: "Bomba de Recalque" },
  { id: "aircon", name: "Ar Condicionado" },
  { id: "electrical", name: "Quadros Elétricos" },
  { id: "bathrooms", name: "Banheiros" },
  { id: "gases", name: "Gases Medicinais" },
];

const EquipmentForm = () => {
  // Estado para equipamentos e formulário
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("generator");
  const [tag, setTag] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("");
  const [brand, setBrand] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [floor, setFloor] = useState("");
  const [gasType, setGasType] = useState("");
  
  // Estados auxiliares
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Carregar equipamentos do localStorage
    const storedEquipments = localStorage.getItem("equipments");
    if (storedEquipments) {
      setEquipments(JSON.parse(storedEquipments));
    }
    setLoading(false);
  }, []);

  // Salvar equipamentos no localStorage quando houver alterações
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("equipments", JSON.stringify(equipments));
    }
  }, [equipments, loading]);

  // Resetar o formulário
  const resetForm = () => {
    setTag("");
    setName("");
    setDescription("");
    setModel("");
    setBrand("");
    setSerialNumber("");
    setLocation("");
    setCapacity("");
    setFloor("");
    setGasType("");
    setFormError("");
  };

  // Validar o formulário
  const validateForm = () => {
    // Validar TAG
    if (!tag || !/^[A-Za-z]{3}-[A-Za-z0-9]{2}-[0-9]{3}$/.test(tag)) {
      setFormError("TAG deve seguir o formato AAA-AA-999.");
      return false;
    }
    
    // Validar demais campos obrigatórios
    if (!location) {
      setFormError("Local de instalação é obrigatório.");
      return false;
    }
    
    // Validar campos específicos por categoria
    switch (selectedCategory) {
      case "generator":
      case "pump":
      case "aircon":
        if (!name || !description || !model || !brand) {
          setFormError("Todos os campos são obrigatórios, exceto número de série.");
          return false;
        }
        break;
      case "elevator":
        if (!name || !description || !model || !brand || !capacity) {
          setFormError("Todos os campos são obrigatórios, exceto número de série.");
          return false;
        }
        break;
      case "bathrooms":
        if (!floor) {
          setFormError("Pavimento é obrigatório.");
          return false;
        }
        break;
      case "gases":
        if (!name || !description || !model || !brand || !gasType) {
          setFormError("Todos os campos são obrigatórios (exceto número de série). O tipo de gás também deve ser informado.");
          return false;
        }
        break;
    }
    
    // Se chegou até aqui, está tudo certo
    setFormError("");
    return true;
  };

  // Manipular envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Criar objeto de equipamento
    const equipmentData: Equipment = {
      id: editing || Date.now().toString(),
      category: selectedCategory,
      tag,
      name,
      description,
      model,
      brand,
      serialNumber,
      location,
      capacity,
      floor,
      gasType,
    };
    
    if (editing) {
      // Atualizar equipamento existente
      setEquipments(
        equipments.map((eq) => (eq.id === editing ? equipmentData : eq))
      );
      setEditing(null);
    } else {
      // Adicionar novo equipamento
      setEquipments([...equipments, equipmentData]);
    }
    
    resetForm();
  };

  // Carregar dados para edição
  const handleEdit = (equipment: Equipment) => {
    setSelectedCategory(equipment.category);
    setTag(equipment.tag);
    setName(equipment.name || "");
    setDescription(equipment.description || "");
    setModel(equipment.model || "");
    setBrand(equipment.brand || "");
    setSerialNumber(equipment.serialNumber || "");
    setLocation(equipment.location);
    setCapacity(equipment.capacity || "");
    setFloor(equipment.floor || "");
    setGasType(equipment.gasType || "");
    setEditing(equipment.id);
    setFormError("");
  };

  // Excluir equipamento
  const handleDelete = (id: string) => {
    setEquipments(equipments.filter((eq) => eq.id !== id));
    
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

  // Filtrar equipamentos
  const filteredEquipments = equipments.filter((equipment) => {
    const searchTerms = searchQuery.toLowerCase();
    
    return (
      equipment.tag.toLowerCase().includes(searchTerms) ||
      (equipment.name?.toLowerCase() || "").includes(searchTerms) ||
      (equipment.location.toLowerCase() || "").includes(searchTerms)
    );
  });

  // Renderizar campos de formulário específicos por categoria
  const renderCategorySpecificFields = () => {
    switch (selectedCategory) {
      case "generator":
      case "pump":
        return (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                Nome do Equipamento
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
                Descrição
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-muted-foreground mb-1">
                Modelo
              </label>
              <input
                type="text"
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-muted-foreground mb-1">
                Marca
              </label>
              <input
                type="text"
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-muted-foreground mb-1">
                N° de Série (Não obrigatório)
              </label>
              <input
                type="text"
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </>
        );
      
      case "elevator":
        return (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                Nome do Equipamento
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
                Descrição
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-muted-foreground mb-1">
                Modelo
              </label>
              <input
                type="text"
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-muted-foreground mb-1">
                Marca
              </label>
              <input
                type="text"
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-muted-foreground mb-1">
                N° de Série (Não obrigatório)
              </label>
              <input
                type="text"
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-muted-foreground mb-1">
                Capacidade
              </label>
              <input
                type="text"
                id="capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </>
        );
      
      case "aircon":
        return (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                Nome do Equipamento
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
                Descrição
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-muted-foreground mb-1">
                Modelo
              </label>
              <input
                type="text"
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-muted-foreground mb-1">
                Marca
              </label>
              <input
                type="text"
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-muted-foreground mb-1">
                N° de Série (Não obrigatório)
              </label>
              <input
                type="text"
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-muted-foreground mb-1">
                Capacidade em BTUs
              </label>
              <input
                type="text"
                id="capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </>
        );
      
      case "electrical":
        return null;
      
      case "bathrooms":
        return (
          <div>
            <label htmlFor="floor" className="block text-sm font-medium text-muted-foreground mb-1">
              Pavimento
            </label>
            <input
              type="text"
              id="floor"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        );
      
      case "gases":
        return (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                Nome do Equipamento
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
                Descrição
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-muted-foreground mb-1">
                Modelo
              </label>
              <input
                type="text"
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-muted-foreground mb-1">
                Marca
              </label>
              <input
                type="text"
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-muted-foreground mb-1">
                N° de Série (Não obrigatório)
              </label>
              <input
                type="text"
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label htmlFor="gasType" className="block text-sm font-medium text-muted-foreground mb-1">
                Tipo de Gás
              </label>
              <input
                type="text"
                id="gasType"
                value={gasType}
                onChange={(e) => setGasType(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  // Função para renderizar detalhes do equipamento
  const renderEquipmentDetails = (equipment: Equipment) => {
    switch (equipment.category) {
      case "generator":
      case "pump":
        return (
          <>
            <p><strong>Nome:</strong> {equipment.name}</p>
            <p><strong>Modelo:</strong> {equipment.model}</p>
            <p><strong>Marca:</strong> {equipment.brand}</p>
          </>
        );
      
      case "elevator":
        return (
          <>
            <p><strong>Nome:</strong> {equipment.name}</p>
            <p><strong>Modelo:</strong> {equipment.model}</p>
            <p><strong>Capacidade:</strong> {equipment.capacity}</p>
          </>
        );
      
      case "aircon":
        return (
          <>
            <p><strong>Nome:</strong> {equipment.name}</p>
            <p><strong>Marca:</strong> {equipment.brand}</p>
            <p><strong>BTUs:</strong> {equipment.capacity}</p>
          </>
        );
      
      case "electrical":
        return (
          <p><strong>Local:</strong> {equipment.location}</p>
        );
      
      case "bathrooms":
        return (
          <>
            <p><strong>Pavimento:</strong> {equipment.floor}</p>
            <p><strong>Localização:</strong> {equipment.location}</p>
          </>
        );
      
      case "gases":
        return (
          <>
            <p><strong>Nome:</strong> {equipment.name}</p>
            <p><strong>Tipo de Gás:</strong> {equipment.gasType}</p>
            <p><strong>Local:</strong> {equipment.location}</p>
          </>
        );
      
      default:
        return null;
    }
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
          {editing ? "Editar Equipamento" : "Cadastrar Novo Equipamento"}
        </h2>

        {formError && (
          <div className="bg-destructive/20 text-destructive p-3 rounded-md mb-4">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Categoria
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label
                htmlFor="tag"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                TAG (AAA-AA-999)
              </label>
              <input
                type="text"
                id="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="GER-01-001"
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Local de Instalação
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            {renderCategorySpecificFields()}
          </div>

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
          <h3 className="text-lg font-medium">Equipamentos Cadastrados</h3>
          
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar equipamentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
        </div>
        
        {filteredEquipments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery 
              ? "Nenhum equipamento encontrado para a busca." 
              : "Nenhum equipamento cadastrado."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipments.map((equipment) => (
              <div
                key={equipment.id}
                className="border border-border rounded-md p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs mb-2">
                      {categories.find((c) => c.id === equipment.category)?.name}
                    </span>
                    <h4 className="text-lg font-medium">{equipment.tag}</h4>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(equipment)}
                      className="text-muted-foreground hover:text-foreground p-1"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(equipment.id)}
                      className="text-destructive hover:text-destructive/80 p-1"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-sm space-y-1 mt-3">
                  {renderEquipmentDetails(equipment)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default EquipmentForm;
