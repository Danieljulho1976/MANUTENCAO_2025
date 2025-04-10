"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Loader2, Search, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface InspectionCategory {
  id: string;
  name: string;
}

interface ChecklistItem {
  id: string;
  question: string;
  type: "text" | "number" | "radio" | "checkbox";
  options?: string[];
  unit?: string;
}

interface Checklist {
  id: string;
  categoryId: string;
  name: string;
  items: ChecklistItem[];
}

const predefinedChecklists: Record<string, ChecklistItem[]> = {
  "RONDA DIÁRIA DE GERADORES": [
    {
      id: "g1",
      question: "Nível do óleo diesel (anotar qtde. aprox. em litros)",
      type: "number",
      unit: "litros"
    },
    {
      id: "g2",
      question: "Medir a tensão da bateria (anotar valor)",
      type: "number",
      unit: "V"
    },
    {
      id: "g3",
      question: "Nível do óleo lubrificante",
      type: "radio",
      options: ["OK", "NOK"]
    },
    {
      id: "g4",
      question: "Nível da água do radiador",
      type: "radio",
      options: ["OK", "NOK"]
    },
    {
      id: "g5",
      question: "Funcionamento do sistema de pré-aquecimento",
      type: "radio",
      options: ["OK", "NOK"]
    }
  ],
  "RONDA DIÁRIA DE BOMBAS DE RECALQUE": [
    {
      id: "b1",
      question: "VERIFICAR SE EXISTE PONTOS DE VAZAMENTO NA BOMBA/TUBULAÇÕES",
      type: "radio",
      options: ["SIM", "NÃO", "NA"]
    },
    {
      id: "b2",
      question: "QUAL BOMBA ESTÁ EM USO?",
      type: "radio",
      options: ["BOMBA 01", "BOMBA 02"]
    },
    {
      id: "b3",
      question: "Verificar condições gerais do quadro elétrico (limpeza, oxidações, reapertos)",
      type: "radio",
      options: ["SIM", "NÃO", "NA"]
    },
    {
      id: "b4a",
      question: "Ligar a bomba no MODO MANUAL e medir/anotar valor da CORRENTE - FASE R",
      type: "number",
      unit: "A"
    },
    {
      id: "b4b",
      question: "Ligar a bomba no MODO MANUAL e medir/anotar valor da CORRENTE - FASE S",
      type: "number",
      unit: "A"
    },
    {
      id: "b4c",
      question: "Ligar a bomba no MODO MANUAL e medir/anotar valor da CORRENTE - FASE T",
      type: "number",
      unit: "A"
    },
    {
      id: "b5",
      question: "Retornar para MODO AUTOMÁTICO",
      type: "checkbox",
      options: ["Concluído"]
    }
  ],
  "PREVENTIVA DE AR CONDICIONADO": [
    {
      id: "ac1",
      question: "Limpeza do filtro de ar",
      type: "radio",
      options: ["Sim", "Não", "NA"]
    },
    {
      id: "ac2",
      question: "Verificação de vazamentos de gás refrigerante",
      type: "radio",
      options: ["Sim", "Não", "NA"]
    },
    {
      id: "ac3",
      question: "Lubrificação dos componentes mecânicos",
      type: "radio",
      options: ["Sim", "Não", "NA"]
    },
    {
      id: "ac4",
      question: "Verificação do sistema elétrico",
      type: "radio",
      options: ["Sim", "Não", "NA"]
    },
    {
      id: "ac5a",
      question: "Verificação da pressão do sistema",
      type: "radio",
      options: ["Sim", "Não", "NA"]
    },
    {
      id: "ac5b",
      question: "Pressão",
      type: "number",
      unit: "PSI"
    },
    {
      id: "ac6a",
      question: "Verificação da temperatura de saída de ar",
      type: "radio",
      options: ["Sim", "Não", "NA"]
    },
    {
      id: "ac6b",
      question: "Temperatura",
      type: "number",
      unit: "°C"
    },
    {
      id: "ac7",
      question: "Verificação do controle remoto",
      type: "radio",
      options: ["Sim", "Não", "NA"]
    },
    {
      id: "ac8",
      question: "Verificação do sistema de dreno",
      type: "radio",
      options: ["Sim", "Não", "NA"]
    },
    {
      id: "ac9a",
      question: "Medir TENSÃO(V) do Equipamento",
      type: "radio",
      options: ["Sim", "Não", "NA"]
    },
    {
      id: "ac9b",
      question: "Tensão",
      type: "number",
      unit: "V"
    },
    {
      id: "ac10a",
      question: "Medir CORRENTE (A) do Equipamento",
      type: "radio",
      options: ["Sim", "Não", "NA"]
    },
    {
      id: "ac10b",
      question: "Corrente",
      type: "number",
      unit: "A"
    }
  ],
  "PREVENTIVA DE QUADROS ELÉTRICOS": [
    {
      id: "qe1",
      question: "Limpeza geral do gabinete, com uso de aspiradores ou pincel, caso necessário.",
      type: "radio",
      options: ["SIM", "NÃO", "NA"]
    },
    {
      id: "qe2",
      question: "Verificar se o quadro possue tranca ou cadeado na porta.",
      type: "radio",
      options: ["SIM", "NÃO", "NA"]
    },
    {
      id: "qe3",
      question: "Realizar reaperto de possível.",
      type: "radio",
      options: ["SIM", "NÃO", "NA"]
    },
    {
      id: "qe4a",
      question: "Realizar medição de Tensão entre Fases - RS",
      type: "number",
      unit: "V"
    },
    {
      id: "qe4b",
      question: "Realizar medição de Tensão entre Fases - RT",
      type: "number",
      unit: "V"
    },
    {
      id: "qe4c",
      question: "Realizar medição de Tensão entre Fases - ST",
      type: "number",
      unit: "V"
    },
    {
      id: "qe5a",
      question: "Realizar medição de Tensão entre Fase e Neutro - RN",
      type: "number",
      unit: "V"
    },
    {
      id: "qe5b",
      question: "Realizar medição de Tensão entre Fase e Neutro - SN",
      type: "number",
      unit: "V"
    },
    {
      id: "qe5c",
      question: "Realizar medição de Tensão entre Fase e Neutro - TN",
      type: "number",
      unit: "V"
    },
    {
      id: "qe6a",
      question: "Realizar medição de Corrente - FASE R",
      type: "number",
      unit: "A"
    },
    {
      id: "qe6b",
      question: "Realizar medição de Corrente - FASE S",
      type: "number",
      unit: "A"
    },
    {
      id: "qe6c",
      question: "Realizar medição de Corrente - FASE T",
      type: "number",
      unit: "A"
    },
    {
      id: "qe7",
      question: "Realizar medição de Tensão e Terra - Fase/Neutro",
      type: "number",
      unit: "V"
    },
    {
      id: "qe8",
      question: "Verificar se há sinais de aquecimento nos fios, terminais, disjuntores, etc...",
      type: "radio",
      options: ["SIM", "NÃO", "NA"]
    }
  ],
  "RONDA DIÁRIA DE GASES MEDICINAIS": [
    {
      id: "gm1a",
      question: "TANQUE OXIGÊNIO REGIONAL (23442) - NÍVEL (VOL)",
      type: "number",
      unit: ""
    },
    {
      id: "gm1b",
      question: "TANQUE OXIGÊNIO REGIONAL (23442) - PRESSÃO TQ.",
      type: "number",
      unit: ""
    },
    {
      id: "gm1c",
      question: "TANQUE OXIGÊNIO REGIONAL (23442) - PRESSÃO DA LINHA",
      type: "number",
      unit: ""
    },
    {
      id: "gm2a",
      question: "TANQUE OXIGÊNIO LEONOR (23280) - NÍVEL (VOL)",
      type: "number",
      unit: ""
    },
    {
      id: "gm2b",
      question: "TANQUE OXIGÊNIO LEONOR (23280) - PRESSÃO TQ.",
      type: "number",
      unit: ""
    },
    {
      id: "gm2c",
      question: "TANQUE OXIGÊNIO LEONOR (23280) - PRESSÃO DA LINHA",
      type: "number",
      unit: ""
    },
    {
      id: "gm3a",
      question: "TANQUE OXIGÊNIO RESERVA (20698) - NÍVEL (VOL)",
      type: "number",
      unit: ""
    },
    {
      id: "gm3b",
      question: "TANQUE OXIGÊNIO RESERVA (20698) - PRESSÃO TQ.",
      type: "number",
      unit: ""
    },
    {
      id: "gm3c",
      question: "TANQUE OXIGÊNIO RESERVA (20698) - PRESSÃO DA LINHA",
      type: "number",
      unit: ""
    },
    {
      id: "gm4a",
      question: "MÓDULO DE AR MEDICINAL (VALMIG) - PRESSÃO DA LINHA",
      type: "number",
      unit: ""
    },
    {
      id: "gm4b",
      question: "MÓDULO DE AR MEDICINAL (VALMIG) - MÓDULO C/ ALARME?",
      type: "radio",
      options: ["SIM", "NÃO"]
    },
    {
      id: "gm5a",
      question: "BACKUP BATERIA DE AR MEDICINAL (VALMIG) - PRESSÃO BANCO 1",
      type: "number",
      unit: ""
    },
    {
      id: "gm5b",
      question: "BACKUP BATERIA DE AR MEDICINAL (VALMIG) - PRESSÃO BANCO 2",
      type: "number",
      unit: ""
    }
  ],
  "RONDA DIÁRIA DE BOILER": [
    {
      id: "bo1",
      question: "Verificar se existe vazamentos (bombas, tubulações, etc)",
      type: "checkbox",
      options: ["Verificado"]
    },
    {
      id: "bo2",
      question: "Verificar condições gerais do quadro elétrico (limpeza, oxidações, reapertos)",
      type: "checkbox",
      options: ["Verificado"]
    },
    {
      id: "bo3",
      question: "Qual bomba está em funcionamento?",
      type: "radio",
      options: ["Bomba 01", "Bomba 02"]
    },
    {
      id: "bo4",
      question: "Anotar a TEMPERATURA da resistencia 01",
      type: "number",
      unit: "°C"
    },
    {
      id: "bo5",
      question: "Anotar a TEMPERATURA da resistencia 02",
      type: "number",
      unit: "°C"
    },
    {
      id: "bo6",
      question: "Anotar a CORRENTE (A) da resistencia 01",
      type: "number",
      unit: "A"
    },
    {
      id: "bo7",
      question: "Anotar a CORRENTE (A) da resistencia 02",
      type: "number",
      unit: "A"
    },
    {
      id: "bo8",
      question: "Anotar a TEMPERATURA (ºC) do boiller",
      type: "number",
      unit: "°C"
    }
  ],
  "RONDA DIÁRIA DE ELEVADORES": [
    {
      id: "el1",
      question: "Cabine limpa e sem danos (pisos, paredes, teto)",
      type: "checkbox",
      options: ["Verificado"]
    },
    {
      id: "el2",
      question: "Espelho (se houver) limpo e sem trincas",
      type: "checkbox",
      options: ["Verificado"]
    },
    {
      id: "el3",
      question: "Iluminação interna funcionando corretamente",
      type: "checkbox",
      options: ["Verificado"]
    },
    {
      id: "el4",
      question: "Painel de botões funcionando (todos os andares respondem)",
      type: "checkbox",
      options: ["Verificado"]
    },
    {
      id: "el5",
      question: "Indicador de andares funcionando",
      type: "checkbox",
      options: ["Verificado"]
    },
    {
      id: "el6",
      question: "Campainha de emergência funcionando",
      type: "checkbox",
      options: ["Verificado"]
    },
    {
      id: "el7",
      question: "Comunicação de emergência (interfone ou botão de alarme) testada",
      type: "checkbox",
      options: ["Verificado"]
    },
    {
      id: "el8",
      question: "Portas abrem e fecham corretamente, sem trancos",
      type: "checkbox",
      options: ["Verificado"]
    },
    {
      id: "el9",
      question: "Sem ruídos anormais durante o funcionamento",
      type: "checkbox",
      options: ["Verificado"]
    },
    {
      id: "el10",
      question: "Tempo de espera aceitável",
      type: "checkbox",
      options: ["Verificado"]
    },
    {
      id: "el11",
      question: "Corrimão firme (se aplicável)",
      type: "checkbox",
      options: ["Verificado"]
    }
  ]
};

const ChecklistForm = () => {
  const [categories, setCategories] = useState<InspectionCategory[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [checklistName, setChecklistName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load categories from localStorage
    const storedCategories = localStorage.getItem("inspectionCategories");
    if (storedCategories) {
      const parsedCategories = JSON.parse(storedCategories);
      setCategories(parsedCategories);
      if (parsedCategories.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(parsedCategories[0].id);
      }
    } else {
      // Initialize with default categories if none exist
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
      setSelectedCategoryId(defaultCategories[0].id);
      localStorage.setItem("inspectionCategories", JSON.stringify(defaultCategories));
    }

    // Load checklists from localStorage
    const storedChecklists = localStorage.getItem("checklists");
    if (storedChecklists) {
      setChecklists(JSON.parse(storedChecklists));
    }

    setLoading(false);
  }, []);

  // Save checklists to localStorage when they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("checklists", JSON.stringify(checklists));
    }
  }, [checklists, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategoryId) {
      setFormError("Selecione uma categoria de inspeção.");
      return;
    }

    if (!checklistName) {
      setFormError("O nome do checklist é obrigatório.");
      return;
    }
    
    setFormError("");

    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
    if (!selectedCategory) {
      setFormError("Categoria inválida.");
      return;
    }

    // Get predefined items for the selected category
    const categoryName = selectedCategory.name;
    const items = predefinedChecklists[categoryName] || [];

    if (editing) {
      // Update existing checklist
      setChecklists(
        checklists.map((checklist) =>
          checklist.id === editing
            ? { ...checklist, name: checklistName, categoryId: selectedCategoryId, items }
            : checklist
        )
      );
      setEditing(null);
    } else {
      // Add new checklist
      const newChecklist: Checklist = {
        id: Date.now().toString(),
        categoryId: selectedCategoryId,
        name: checklistName,
        items
      };
      setChecklists([...checklists, newChecklist]);
    }

    // Clear form
    setChecklistName("");
  };

  const handleEdit = (checklist: Checklist) => {
    setSelectedCategoryId(checklist.categoryId);
    setChecklistName(checklist.name);
    setEditing(checklist.id);
    setFormError("");
  };

  const handleDelete = (id: string) => {
    setChecklists(checklists.filter((checklist) => checklist.id !== id));
    if (editing === id) {
      setEditing(null);
      setChecklistName("");
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setChecklistName("");
    setFormError("");
  };

  // Filter checklists based on search query
  const filteredChecklists = checklists.filter((checklist) => {
    const searchTerms = searchQuery.toLowerCase();
    const category = categories.find(cat => cat.id === checklist.categoryId);
    
    return (
      checklist.name.toLowerCase().includes(searchTerms) ||
      (category?.name.toLowerCase() || "").includes(searchTerms)
    );
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Categoria Desconhecida";
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
          {editing ? "Editar Checklist" : "Cadastrar Novo Checklist"}
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
                htmlFor="category"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Categoria de Inspeção
              </label>
              <select
                id="category"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Nome do Checklist
              </label>
              <input
                type="text"
                id="name"
                value={checklistName}
                onChange={(e) => setChecklistName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ex: Inspeção Mensal - Gerador 01"
              />
            </div>
          </div>

          {selectedCategoryId && (
            <div className="border-t border-border pt-4 mt-4">
              <h3 className="text-md font-medium mb-3">
                Itens do Checklist para {getCategoryName(selectedCategoryId)}
              </h3>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <p className="text-sm text-muted-foreground mb-2">
                  Este checklist será criado com os itens padrão para a categoria selecionada.
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedCategoryId && categories.find(cat => cat.id === selectedCategoryId) && (
                    <>
                      {predefinedChecklists[getCategoryName(selectedCategoryId)]?.map((item, index) => (
                        <div key={item.id} className="flex items-center py-1 border-b border-border/50 last:border-0">
                          <CheckCircle2 className="w-4 h-4 text-chart-2 mr-2" />
                          <span className="text-sm">{item.question}</span>
                          {item.unit && (
                            <span className="text-xs text-muted-foreground ml-1">({item.unit})</span>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
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
          <h3 className="text-lg font-medium">Checklists Cadastrados</h3>
          
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar checklists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
        </div>
        
        {filteredChecklists.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery 
              ? "Nenhum checklist encontrado para a busca." 
              : "Nenhum checklist cadastrado."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChecklists.map((checklist) => (
              <div
                key={checklist.id}
                className="border border-border rounded-md p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs mb-2">
                      {getCategoryName(checklist.categoryId)}
                    </span>
                    <h4 className="text-lg font-medium">{checklist.name}</h4>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(checklist)}
                      className="text-muted-foreground hover:text-foreground p-1"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(checklist.id)}
                      className="text-destructive hover:text-destructive/80 p-1"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {checklist.items.length} itens no checklist
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChecklistForm;
