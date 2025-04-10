"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// Definição de tipos para categorias
interface Category {
  id: string;
  name: string;
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

const EquipmentCategoryForm = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("generator");
  
  useEffect(() => {
    // Simulação de carregamento
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
        <h2 className="text-xl font-semibold mb-4">Categorias de Equipamentos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Selecione uma categoria
            </label>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm",
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <h3 className="text-lg font-medium mb-4">
            Informações da Categoria: {categories.find(c => c.id === selectedCategory)?.name}
          </h3>
          
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">TAG:</span>
              <span>Formato: AAA-AA-999 (Exemplo: GER-01-001)</span>
            </li>
            
            {selectedCategory === "generator" && (
              <>
                <li>Nome do Equipamento</li>
                <li>Descrição</li>
                <li>Modelo</li>
                <li>Marca</li>
                <li>N° de Série (Não obrigatório)</li>
                <li>Local de Instalação</li>
              </>
            )}
            
            {selectedCategory === "elevator" && (
              <>
                <li>Nome do Equipamento</li>
                <li>Descrição</li>
                <li>Modelo</li>
                <li>Marca</li>
                <li>N° de Série (Não obrigatório)</li>
                <li>Local de Instalação</li>
                <li>Capacidade</li>
              </>
            )}
            
            {selectedCategory === "pump" && (
              <>
                <li>Nome do Equipamento</li>
                <li>Descrição</li>
                <li>Modelo</li>
                <li>Marca</li>
                <li>N° de Série (Não obrigatório)</li>
                <li>Local de Instalação</li>
              </>
            )}
            
            {selectedCategory === "aircon" && (
              <>
                <li>Nome do Equipamento</li>
                <li>Descrição</li>
                <li>Modelo</li>
                <li>Marca</li>
                <li>N° de Série (Não obrigatório)</li>
                <li>Local de Instalação</li>
                <li>Capacidade em BTUs</li>
              </>
            )}
            
            {selectedCategory === "electrical" && (
              <>
                <li>TAG (Exemplo AAA-AA-999)</li>
                <li>Local de Instalação</li>
              </>
            )}
            
            {selectedCategory === "bathrooms" && (
              <>
                <li>TAG (Exemplo AAA-AA-999)</li>
                <li>Pavimento</li>
                <li>Localização</li>
              </>
            )}
            
            {selectedCategory === "gases" && (
              <>
                <li>Nome do Equipamento</li>
                <li>Descrição</li>
                <li>Modelo</li>
                <li>Marca</li>
                <li>N° de Série (Não obrigatório)</li>
                <li>Tipo de Gás</li>
                <li>Local de Instalação</li>
              </>
            )}
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default EquipmentCategoryForm;
