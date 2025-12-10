import { useEffect, useState, useMemo } from "react";
import { api } from "../services/api";
import { Search, TrendingUp, TrendingDown, BarChart3, DollarSign, Percent, Hash } from "lucide-react";

interface Pair {
  id: number;
  symbol: string;
  category: string;
  last_price: string;
  volume_24h: string;
  funding_rate: string;
  price_change_percent_24h: string;
}

type SortField = 'price_change_percent_24h' | 'volume_24h' | 'last_price' | 'funding_rate';
type SortDirection = 'asc' | 'desc';

export default function Screener() {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [changeFilter, setChangeFilter] = useState("all");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [minVolume, setMinVolume] = useState<number | "">("");
  const [sortField, setSortField] = useState<SortField>('price_change_percent_24h');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    api.get("trading-pairs/")
      .then(res => { setPairs(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredPairs = useMemo(() => {
    let filtered = pairs
      .filter(p => p.symbol.toLowerCase().includes(search.toLowerCase()))
      .filter(p => categoryFilter === "all" || p.category === categoryFilter)
      .filter(p => {
        if (changeFilter === "positive") return Number(p.price_change_percent_24h) >= 0;
        if (changeFilter === "negative") return Number(p.price_change_percent_24h) < 0;
        return true;
      })
      .filter(p => minPrice === "" || Number(p.last_price) >= minPrice)
      .filter(p => minVolume === "" || Number(p.volume_24h) >= minVolume);

    filtered.sort((a, b) => {
      const aVal = Number(a[sortField]);
      const bVal = Number(b[sortField]);
      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
    });
    return filtered;
  }, [pairs, search, categoryFilter, changeFilter, minPrice, minVolume, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    else { setSortField(field); setSortDirection('desc'); }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      linear: "from-blue-500 to-cyan-400",
      inverse: "from-purple-500 to-pink-400",
      spot: "from-emerald-500 to-teal-400"
    };
    return colors[category as keyof typeof colors] || "from-gray-500 to-gray-400";
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button onClick={() => handleSort(field)} className="flex items-center gap-1 font-medium hover:text-blue-400 transition-colors">
      {children} {sortField === field && <span className="text-xs">{sortDirection === 'desc' ? '▼' : '▲'}</span>}
    </button>
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        Chargement...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-full mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">📊 Crypto Screener</h1>
          <div className="text-sm text-gray-400">{filteredPairs.length} paires affichées</div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text" placeholder="Chercher..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 bg-gray-800/70 rounded-xl text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-3 bg-gray-800/70 rounded-xl border border-gray-700 text-white focus:outline-none">
            <option value="all">Toutes catégories</option>
            <option value="linear">Linear Perpetual</option>
            <option value="inverse">Inverse Perpetual</option>
            <option value="spot">Spot</option>
          </select>
          <select value={changeFilter} onChange={e => setChangeFilter(e.target.value)}
            className="px-4 py-3 bg-gray-800/70 rounded-xl border border-gray-700 text-white focus:outline-none">
            <option value="all">Toutes variations</option>
            <option value="positive">Positive</option>
            <option value="negative">Négative</option>
          </select>
          <input
            type="number" placeholder="Prix min" value={minPrice} onChange={e => setMinPrice(e.target.value ? Number(e.target.value) : "")}
            className="px-4 py-3 bg-gray-800/70 rounded-xl border border-gray-700 text-white focus:outline-none"
          />
          <input
            type="number" placeholder="Volume min $" value={minVolume} onChange={e => setMinVolume(e.target.value ? Number(e.target.value) : "")}
            className="px-4 py-3 bg-gray-800/70 rounded-xl border border-gray-700 text-white focus:outline-none"
          />
          <button onClick={() => { setSearch(""); setCategoryFilter("all"); setChangeFilter("all"); setMinPrice(""); setMinVolume(""); }}
            className="px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white">Réinitialiser</button>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto bg-gray-800/40 rounded-2xl border border-gray-700/50">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800/60 text-gray-300 text-sm sticky top-0 z-10">
              <tr>
                <th className="p-5">Symbol</th>
                <th className="p-5">Catégorie</th>
                <th className="p-5"><SortButton field="last_price"><DollarSign className="inline w-4 h-4 mr-1"/>Prix</SortButton></th>
                <th className="p-5"><SortButton field="price_change_percent_24h"><Percent className="inline w-4 h-4 mr-1"/>24h%</SortButton></th>
                <th className="p-5"><SortButton field="volume_24h"><BarChart3 className="inline w-4 h-4 mr-1"/>Volume $</SortButton></th>
                <th className="p-5"><SortButton field="funding_rate"><Hash className="inline w-4 h-4 mr-1"/>Funding</SortButton></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filteredPairs.map(p => {
                const change = Number(p.price_change_percent_24h);
                const volume = Number(p.volume_24h);
                const funding = Number(p.funding_rate);
                const changePercent = Math.min(Math.abs(change), 100);
                const volumePercent = Math.min(volume / 1000000, 100);

                return (
                  <tr key={p.id} className="hover:bg-gray-700/30 transition-all">
                    <td className="p-5 text-white font-bold">{p.symbol}</td>
                    <td className="p-5">
                      <span className={`inline-block px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(p.category)} text-white`}>
                        {p.category.charAt(0).toUpperCase() + p.category.slice(1)}
                      </span>
                    </td>
                    <td className="p-5 text-white font-mono">{p.last_price ? Number(p.last_price).toFixed(4) : "--"}</td>
                    <td className="p-5">
                      <div className="flex flex-col gap-1">
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-xl text-sm font-bold ${
                          change >= 0 ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                      : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                          {change >= 0 ? <TrendingUp className="w-4 h-4"/> : <TrendingDown className="w-4 h-4"/>}
                          {change.toFixed(2)}%
                        </span>
                        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-2 ${change >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                            style={{ width: `${changePercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-white font-mono">
                      <div className="flex flex-col gap-1">
                        ${volume.toLocaleString()}
                        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-blue-400"
                            style={{ width: `${volumePercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className={`p-5 font-mono font-medium ${funding >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {funding.toFixed(6)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredPairs.length === 0 && <div className="text-center text-gray-400 py-16">Aucune paire trouvée</div>}
        </div>
      </div>
    </div>
  );
}
