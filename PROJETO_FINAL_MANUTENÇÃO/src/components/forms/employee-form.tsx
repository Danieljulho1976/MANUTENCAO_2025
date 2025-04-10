"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface Employee {
  id: string;
  name: string;
  drt: string;
  role: string;
}

const EmployeeForm = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState("");
  const [drt, setDrt] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    // Verificar se já existem dados no localStorage
    const storedEmployees = localStorage.getItem("employees");
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
    setLoading(false);
  }, []);

  // Salvar no localStorage quando o estado for atualizado
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("employees", JSON.stringify(employees));
    }
  }, [employees, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !drt || !role) {
      setFormError("Todos os campos são obrigatórios.");
      return;
    }
    
    setFormError("");

    if (editing) {
      // Atualizar funcionário existente
      setEmployees(
        employees.map((emp) =>
          emp.id === editing
            ? { ...emp, name: name, drt: drt, role: role }
            : emp
        )
      );
      setEditing(null);
    } else {
      // Adicionar novo funcionário
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name,
        drt,
        role,
      };
      setEmployees([...employees, newEmployee]);
    }

    // Limpar formulário
    setName("");
    setDrt("");
    setRole("");
  };

  const handleEdit = (employee: Employee) => {
    setName(employee.name);
    setDrt(employee.drt);
    setRole(employee.role);
    setEditing(employee.id);
    setFormError("");
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    if (editing === id) {
      setEditing(null);
      setName("");
      setDrt("");
      setRole("");
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setName("");
    setDrt("");
    setRole("");
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
          {editing ? "Editar Funcionário" : "Cadastrar Novo Funcionário"}
        </h2>

        {formError && (
          <div className="bg-destructive/20 text-destructive p-3 rounded-md mb-4">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Nome do Funcionário
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
              <label
                htmlFor="drt"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                DRT
              </label>
              <input
                type="text"
                id="drt"
                value={drt}
                onChange={(e) => setDrt(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Função
              </label>
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
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
        <h3 className="text-lg font-medium mb-4">Funcionários Cadastrados</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3 text-sm">Nome</th>
                <th className="text-left p-3 text-sm">DRT</th>
                <th className="text-left p-3 text-sm">Função</th>
                <th className="text-right p-3 text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-muted-foreground">
                    Nenhum funcionário cadastrado.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="p-3">{employee.name}</td>
                    <td className="p-3">{employee.drt}</td>
                    <td className="p-3">{employee.role}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-muted-foreground hover:text-foreground mr-2"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
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

export default EmployeeForm;
