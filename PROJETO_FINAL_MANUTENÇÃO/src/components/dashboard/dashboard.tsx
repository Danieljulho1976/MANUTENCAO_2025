"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Loader2, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [serviceOrders, setServiceOrders] = useState<any[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<any[]>([]);
  const [ordersByMonth, setOrdersByMonth] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);

  useEffect(() => {
    // Carregar dados do localStorage
    const isBrowser = typeof window !== 'undefined';
    if (!isBrowser) return;

    const storedOrders = localStorage.getItem("serviceOrders");
    let orders: any[] = [];
    
    if (storedOrders) {
      orders = JSON.parse(storedOrders);
      setServiceOrders(orders);
      
      // Contar ordens por status
      const pending = orders.filter(order => order.status === "pendente").length;
      const inProgress = orders.filter(order => order.status === "em_andamento").length;
      const completed = orders.filter(order => order.status === "concluida").length;
      const canceled = orders.filter(order => order.status === "cancelada").length;
      
      setPendingCount(pending);
      setInProgressCount(inProgress);
      setCompletedCount(completed);
      setCanceledCount(canceled);
      
      // Dados para o gráfico de pizza
      setOrdersByStatus([
        { name: "Pendentes", value: pending },
        { name: "Em Andamento", value: inProgress },
        { name: "Concluídas", value: completed },
        { name: "Canceladas", value: canceled }
      ]);
      
      // Dados para o gráfico de linha (ordens por mês)
      const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      const ordersByMonthData = months.map(month => ({
        name: month,
        preventivas: 0,
        corretivas: 0
      }));
      
      // Simulação de dados para o gráfico de linha
      // Em um cenário real, isso viria do banco de dados
      ordersByMonthData[0].preventivas = 12;
      ordersByMonthData[0].corretivas = 5;
      ordersByMonthData[1].preventivas = 15;
      ordersByMonthData[1].corretivas = 3;
      ordersByMonthData[2].preventivas = 18;
      ordersByMonthData[2].corretivas = 7;
      ordersByMonthData[3].preventivas = 14;
      ordersByMonthData[3].corretivas = 4;
      
      setOrdersByMonth(ordersByMonthData);
    }
    
    // Simulação de carregamento de dados
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const equipmentByCategory = [
    { name: "Gerador", value: 4 },
    { name: "Elevador", value: 8 },
    { name: "Bomba de Recalque", value: 12 },
    { name: "Ar Condicionado", value: 24 },
    { name: "Quadros Elétricos", value: 18 },
    { name: "Banheiros", value: 15 },
    { name: "Gases Medicinais", value: 7 },
  ];

  const maintenanceData = [
    {
      name: "Jan",
      preventivas: 45,
      corretivas: 12,
    },
    {
      name: "Fev",
      preventivas: 50,
      corretivas: 15,
    },
    {
      name: "Mar",
      preventivas: 35,
      corretivas: 8,
    },
    {
      name: "Abr",
      preventivas: 55,
      corretivas: 10,
    },
    {
      name: "Mai",
      preventivas: 48,
      corretivas: 7,
    },
    {
      name: "Jun",
      preventivas: 52,
      corretivas: 14,
    },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FAC858",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="col-span-2">
        <h2 className="text-2xl font-bold mb-4">
          Painel de Controle de Manutenções
        </h2>
      </div>

      {/* Contadores simples */}
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-muted-foreground text-sm font-medium">
            Total de Equipamentos
          </h3>
          <p className="text-3xl font-bold mt-2">88</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-muted-foreground text-sm font-medium">
            Manutenções Preventivas
          </h3>
          <p className="text-3xl font-bold mt-2 text-chart-2">285</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-muted-foreground text-sm font-medium">
            Manutenções Corretivas
          </h3>
          <p className="text-3xl font-bold mt-2 text-chart-1">66</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-muted-foreground text-sm font-medium">
            Funcionários Ativos
          </h3>
          <p className="text-3xl font-bold mt-2">15</p>
        </Card>
      </div>

      {/* Status das Ordens de Serviço */}
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-l-4 border-l-yellow-400">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">
                Ordens Pendentes
              </h3>
              <p className="text-3xl font-bold mt-2 text-yellow-600">{pendingCount}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-blue-400">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">
                Em Andamento
              </h3>
              <p className="text-3xl font-bold mt-2 text-blue-600">{inProgressCount}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-green-400">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">
                Concluídas
              </h3>
              <p className="text-3xl font-bold mt-2 text-green-600">{completedCount}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-red-400">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">
                Canceladas
              </h3>
              <p className="text-3xl font-bold mt-2 text-red-600">{canceledCount}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico de Barras */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">
          Manutenções Preventivas vs Corretivas
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={maintenanceData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="preventivas"
                name="Manutenções Preventivas"
                fill="var(--chart-2)"
              />
              <Bar
                dataKey="corretivas"
                name="Manutenções Corretivas"
                fill="var(--chart-1)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Gráfico de Pizza - Status das Ordens */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">
          Status das Ordens de Serviço
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ordersByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#EAB308" /> {/* Pendentes - Amarelo */}
                <Cell fill="#3B82F6" /> {/* Em Andamento - Azul */}
                <Cell fill="#22C55E" /> {/* Concluídas - Verde */}
                <Cell fill="#EF4444" /> {/* Canceladas - Vermelho */}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Gráfico de Pizza - Equipamentos */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">
          Distribuição de Equipamentos por Categoria
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={equipmentByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {equipmentByCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Gráfico de Linha - Tendência de Ordens */}
      <Card className="p-6 col-span-2">
        <h3 className="text-lg font-medium mb-4">
          Tendência de Ordens de Serviço
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={ordersByMonth}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="preventivas"
                name="Manutenções Preventivas"
                stroke="#22C55E"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="corretivas"
                name="Manutenções Corretivas"
                stroke="#EF4444"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
