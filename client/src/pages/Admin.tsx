import { useState } from "react";
import { useFeedbackStats, useFeedbackList, getExportUrl } from "@/hooks/use-feedback";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Smile, 
  Meh, 
  Frown, 
  Users, 
  Download, 
  FileSpreadsheet, 
  FileText,
  Calendar,
  Loader2,
  LayoutDashboard
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { format } from "date-fns";

export default function Admin() {
  const [date, setDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: stats, isLoading: statsLoading } = useFeedbackStats(date || undefined);
  const { data: list, isLoading: listLoading } = useFeedbackList(page, limit, date || undefined);

  const chartData = stats ? [
    { name: 'Muito Satisfeito', value: stats.totals.muito_satisfeito, color: 'hsl(142, 71%, 45%)' },
    { name: 'Satisfeito', value: stats.totals.satisfeito, color: 'hsl(45, 93%, 47%)' },
    { name: 'Insatisfeito', value: stats.totals.insatisfeito, color: 'hsl(0, 84%, 60%)' },
  ] : [];

  const getIconForSatisfaction = (s: string) => {
    switch (s) {
      case 'muito_satisfeito': return <Smile className="w-5 h-5 text-green-600" />;
      case 'satisfeito': return <Meh className="w-5 h-5 text-yellow-500" />;
      case 'insatisfeito': return <Frown className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getLabelForSatisfaction = (s: string) => {
    switch (s) {
      case 'muito_satisfeito': return 'Muito Satisfeito';
      case 'satisfeito': return 'Satisfeito';
      case 'insatisfeito': return 'Insatisfeito';
      default: return s;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold">Painel Administrativo</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="pl-9 w-40 md:w-48 bg-background"
              />
            </div>
            
            <Button variant="outline" size="sm" asChild className="gap-2">
              <a href={getExportUrl('csv', date || undefined)} download>
                <FileText className="w-4 h-4" /> CSV
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild className="gap-2">
              <a href={getExportUrl('xlsx', date || undefined)} download>
                <FileSpreadsheet className="w-4 h-4" /> Excel
              </a>
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total de Votos" 
            value={stats?.total || 0} 
            icon={Users}
            className="bg-gradient-to-br from-primary/5 to-primary/10"
            colorClass="text-primary bg-primary/10"
          />
          <StatsCard 
            title="Muito Satisfeito" 
            value={stats?.totals.muito_satisfeito || 0} 
            icon={Smile} 
            colorClass="text-green-600 bg-green-100"
          />
          <StatsCard 
            title="Satisfeito" 
            value={stats?.totals.satisfeito || 0} 
            icon={Meh} 
            colorClass="text-yellow-600 bg-yellow-100"
          />
          <StatsCard 
            title="Insatisfeito" 
            value={stats?.totals.insatisfeito || 0} 
            icon={Frown} 
            colorClass="text-red-600 bg-red-100"
          />
        </div>

        {/* Chart Section */}
        <div className="glass-card p-6 md:p-8">
          <h2 className="text-lg font-bold font-display mb-6">Distribuição de Satisfação</h2>
          <div className="h-[300px] w-full">
            {statsLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Feedback Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-lg font-bold font-display">Feedback Recente</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Satisfação</TableHead>
                  <TableHead className="text-right">Data / Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : list?.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  list?.items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/20">
                      <TableCell className="font-mono text-muted-foreground">#{item.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                          {getIconForSatisfaction(item.satisfaction)}
                          {getLabelForSatisfaction(item.satisfaction)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Simple Pagination */}
          <div className="p-4 border-t border-border/50 flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || listLoading}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {page}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => p + 1)}
              disabled={!list || list.items.length < limit || listLoading}
            >
              Próxima
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
