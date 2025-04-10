"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface InspectionCategory {
  id: string;
  name: string;
}

const InspectionCategoryForm = () => {
  const [categories, setCategories] = useState<InspectionCategory[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    // Check if data exists in localStorage
    const storedCategories = localStorage.getItem("inspectionCategories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Initialize with default categories
      const defaultCategories: InspectionCategory[] = [
        { id: "1", name: "RONDA DIÁRIA DE GERADORES" },
        { id: "2", name: "RONDA DIÁRIA DE BOMBAS DE RECALQUE" },
        { id: "3", name: "RONDA DIÁRIA DE BOILER" },
        { id: "4", name: "RONDA DIÁRIA DE ELEVADORES" },
        { id: "5", name: "PREVENTIVA DE AR CONDICIONADO" },
        { id: "6", name: "PREVENTIVA DE QUADROS ELÉTRICOS" },
        { id: "7", name: "RONDA DIÁRIA DE GASES MEDICINAIS" },
      ];
      setCategories(defaultCategories);
      localStorage.setItem("inspectionCategories", JSON.stringify(defaultCategories));
    }
    setLoading(false);
  }, []);

  // Save to localStorage when state is updated
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("inspectionCategories", JSON.stringify(categories));
    }
  }, [categories, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      setFormError("O nome da categoria é obrigatório.");
      return;
    }
    
    setFormError("");

    if (editing) {
      // Update existing category
      setCategories(
        categories.map((cat) =>
          cat.id === editing
            ? { ...cat, name: name }
            : cat
        )
      );
      setEditing(null);
    } else {
      // Add new category
      const newCategory: InspectionCategory = {
        id: Date.now().toString(),
        name,
      };
      setCategories([...categories, newCategory]);
    }

    // Clear form
    setName("");
  };

  const handleEdit = (category: InspectionCategory) => {
    setName(category.name);
    setEditing(category.id);
    setFormError("");
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    if (editing === id) {
      setEditing(null);
      setName("");
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setName("");
    setFormError("");
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
          {editing ? "Editar Categoria de Inspeção" : "Cadastrar Nova Categoria de Inspeção"}
        </h2>

        {formError && (
          <div className="bg-destructive/20 text-destructive p-3 rounded-md mb-4">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Nome da Categoria
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
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
        <h3 className="text-lg font-medium mb-4">Categorias de Inspeção Cadastradas</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3 text-sm">Nome da Categoria</th>
                <th className="text-right p-3 text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-3 text-center text-muted-foreground">
                    Nenhuma categoria cadastrada.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="p-3">{category.name}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-muted-foreground hover:text-foreground mr-2"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-destructive hover:text-destructive/80"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default InspectionCategoryForm;
